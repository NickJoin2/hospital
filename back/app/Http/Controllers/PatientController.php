<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\Patient;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class PatientController extends Controller
{
    use ApiResponseMainTrait;

    public function createPatient(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'first_name' => ['required', 'string', 'max:255'],
                'middle_name' => ['required', 'string', 'max:255'],
                'last_name' => ['required', 'string', 'max:255'],
                'is_gender' => ['required', 'boolean'],
                'birth_date' => ['required', 'date_format:Y-m-d'],
                'phone' => ['required', 'string', 'max:20', 'unique:patients,phone'],
            ], [
                'first_name.required' => 'Поле обязательно для заполнения',
                'middle_name.required' => 'Поле обязательно для заполнения',
                'last_name.required' => 'Поле обязательно для заполнения',
                'is_gender.required' => 'Поле обязательно для заполнения',
                'birth_date.required' => 'Поле обязательно для заполнения',
                'phone.required' => 'Поле обязательно для заполнения',
                'phone.unique' => 'Пациент с таким номером телефона уже существует',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $doctor = Auth::user();


            if (!$doctor) {
                return $this->errorResponse(
                    message: 'Необходима авторизация для создания пациента',
                    statusCode: Response::HTTP_UNAUTHORIZED
                );
            }

            $patientData = [
                'first_name' => $request->input('first_name'),
                'middle_name' => $request->input('middle_name'),
                'last_name' => $request->input('last_name'),
                'is_gender' => $request->input('is_gender'),
                'birth_date' => $request->input('birth_date'),
                'phone' => $request->input('phone'),
            ];

            $patient = Patient::create($patientData);


            $responseData = [
                'first_name' => $patient->first_name,
                'middle_name' => $patient->middle_name,
                'last_name' => $patient->last_name,
                'gender' => $patient->is_gender ? 'Мужчина' : 'Женщина',
                'birth_date' => $patient->birth_date,
                'phone' => $patient->phone,
                'id' => $patient->id,
            ];

            return $this->successResponse(
                message: 'Пациент успешно создан',
                data: $responseData,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании пациента: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании пациента',
                error: $e->getMessage(),
            );
        }
    }

    public function patientsAll(): JsonResponse
    {
        try {
            $patients = Patient::with(['insurances', 'passport'])->get();

            return $this->successResponse(
                message: 'Список пациентов получен',
                data: $patients,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка пациентов: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка пациентов',
                error: $e->getMessage(),
            );
        }
    }

    public function patientFind(int $id): JsonResponse
    {
        try {
            $patient = Patient::with([
                'insurances',
                'passport',
                'operations' => function ($query) {
                    $query->with('operationType', 'anesthesiaType');
                },
                'allergies' => function ($query) {
                    $query->with(['allergen', 'severity']);
                },
                'appointments' => function ($query) {
                    $query->with([
                        'status',
                        'doctor',
                        'diagnoses' => function ($diagnosisQuery) {
                            $diagnosisQuery->with(['medications' => function ($medicationQuery) {
                                $medicationQuery->with('medicineName', 'frequency');
                            }]);
                        }
                    ]);
                }
            ])->find($id);

            if (!$patient) {
                return $this->notFoundResponse();
            }

            return $this->successResponse(
                message: 'Данные пациента получены',
                data: $patient
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении данных пациента: ' . $e->getMessage(), [
                'exception' => $e,
                'patient_id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении данных пациента',
                error: $e->getMessage(),
            );
        }
    }

    public function patientUpdate(Request $request, int $id): JsonResponse
    {
        try {
            // Сначала получаем пациента
            $patient = Patient::with('passport')->find($id); // сразу подгружаем паспорт

            if (!$patient) {
                return $this->notFoundResponse(message: 'Пациент не найден');
            }

            // Теперь создаём валидатор
            $validator = Validator::make($request->all(), [
                'first_name' => ['nullable', 'string', 'max:255'],
                'middle_name' => ['nullable', 'string', 'max:255'],
                'last_name' => ['nullable', 'string', 'max:255'],
                'is_gender' => ['nullable', 'boolean'],
                'birth_date' => ['nullable', 'date_format:Y-m-d'],
                'phone' => ['nullable', 'string', 'max:20'],
                'series' => ['nullable', 'integer', 'max:9999', Rule::unique('patients_passwords', 'series')->ignore($patient->passport?->id)],
                'number' => ['nullable', 'integer', 'max:999999', Rule::unique('patients_passwords', 'number')->ignore($patient->passport?->id)],
                'issued' => ['nullable', 'string', 'max:255'],
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(errors: $validator->errors());
            }

            // Разделяем данные
            $patientData = $request->only(
                'first_name', 'middle_name', 'last_name', 'is_gender', 'birth_date', 'phone'
            );

            $passportData = $request->only('series', 'number', 'issued');

            // Проверяем изменения
            $hasChanges = false;

            foreach ($patientData as $key => $value) {
                if ($patient->$key !== $value) {
                    $hasChanges = true;
                    break;
                }
            }

            $passport = $patient->passport;

            if (!$passport && !empty(array_filter($passportData))) {
                $hasChanges = true;
            } elseif ($passport) {
                foreach ($passportData as $key => $value) {
                    if ($value !== null && $passport->$key !== $value) {
                        $hasChanges = true;
                        break;
                    }
                }
            }

            if (!$hasChanges) {
                return $this->successResponse(
                    message: 'Данные пациента и паспорта не изменились',
                    data: $this->formatPatientResponse($patient)
                );
            }

            // Обновляем пациента
            $patient->update($patientData);

            // Обновляем или создаём паспорт
            if (!empty(array_filter($passportData))) {
                if ($passport) {
                    $passport->update($passportData);
                } else {
                    $patient->passport()->create($passportData);
                }
            }

            $patient->refresh();

            return $this->successResponse(
                message: 'Данные пациента успешно обновлены',
                data: $this->formatPatientResponse($patient)
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении данных пациента: ' . $e->getMessage(), [
                'exception' => $e,
                'patient_id' => $id,
                'request_data' => $request->all(),
                'user_id' => Auth::id() ?? 'guest',
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении данных пациента',
                error: $e->getMessage(),
            );
        }
    }

    private function formatPatientResponse(Patient $patient): array
    {
        $passport = $patient->passport;

        return [
            'id' => $patient->id,
            'first_name' => $patient->first_name,
            'middle_name' => $patient->middle_name,
            'last_name' => $patient->last_name,
            'gender' => $patient->is_gender ? 'Мужчина' : 'Женщина',
            'birth_date' => $patient->birth_date,
            'phone' => $patient->phone,
            'updated_at' => $patient->updated_at,
            'updated_by' => $patient->updated_id ? User::find($patient->updated_id)->name : null,
            'passport' => $passport ? [
                'series' => $passport->series,
                'number' => $passport->number,
                'issued' => $passport->issued,
            ] : null,
        ];
    }


    public function patientDelete(int $id): JsonResponse
    {
        try {
            $patient = Patient::find($id);
            if (!$patient) {
                return $this->notFoundResponse();
            }

            $patient->delete();

            return $this->successResponse(
                message: 'Пациент успешно удален',
                data: $patient
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении пациента: ' . $e->getMessage(), [
                'exception' => $e,
                'patient_id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении пациента',
                error: $e->getMessage(),
            );
        }
    }

//    public function updatePatientAvatar(Request $request, int $id): JsonResponse
//    {
//        try {
//            $validator = Validator::make($request->all(), [
//                'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
//            ]);
//
//            if ($validator->fails()) {
//                return $this->validationErrorResponse(
//                    errors: $validator->errors(),
//                );
//            }
//
//            $patient = Patient::find($id);
//            if (!$patient) {
//                return $this->notFoundResponse();
//            }
//
//            // Получаем текущего пользователя
//            $currentUser = Auth::user();
//
//            // Если текущий пользователь не создатель пациента, обновляем updated_id
//            if ($currentUser->id !== $patient->created_id) {
//                $patient->updated_id = $currentUser->id;
//            }
//
//            if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
//                $fileName = time() . '_' . $request->file('avatar')->getClientOriginalName();
//                $filePath = $request->file('avatar')->storeAs('avatarsPatients', $fileName, 'public');
//
//                if ($patient->avatar) {
//                    Storage::disk('public')->delete($patient->avatar);
//                }
//
//                $patient->avatar = $filePath;
//                $patient->save();
//            }
//
//            return $this->successResponse(
//                message: 'Аватар пациента успешно обновлен',
//                data: $patient
//            );
//
//        } catch (Exception $e) {
//            Log::error('Ошибка при обновлении аватара пациента: ' . $e->getMessage(), [
//                'exception' => $e,
//                'patient_id' => $id,
//            ]);
//
//            return $this->errorResponse(
//                message: 'Ошибка при обновлении аватара пациента',
//                error: $e->getMessage(),
//            );
//        }
//    }

    public function updatePatientAvatar(Request $request, $patientId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse(
                errors: $validator->errors(),
            );
        }

        $patient = Patient::find($patientId);
        if (!$patient) {
            return $this->notFoundResponse();
        }


        $originalExtension = $request->file('avatar')->getClientOriginalExtension();
        $fileName = time() . '_' . Str::random(16) . '.' . $originalExtension;

        $filePath = $request->file('avatar')->storeAs('avatarsPatients', $fileName, 'public');

        if ($patient->avatar) {
            $oldFilePath = str_replace(asset('storage/'), '', $patient->avatar);
            Storage::disk('public')->delete($oldFilePath);
        }

        $avatarUrl = asset('storage/' . $filePath);

        $patient->avatar = $avatarUrl;
        $patient->save();

        return response()->json([
            'message' => 'Avatar updated successfully',
            'patient' => $patient,
        ], 200);
    }
}
