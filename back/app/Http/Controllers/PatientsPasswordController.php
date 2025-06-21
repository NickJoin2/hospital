<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\PatientsPassword;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class PatientsPasswordController extends Controller
{
    use ApiResponseMainTrait;

    public function createPatientsPassword(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'series' => ['required', 'integer', 'unique:patients_passwords,series'],
                'number' => ['required', 'integer', 'unique:patients_passwords,number'],
                'issued' => [
                    'required',
                    'string',
                    'max:255',
                    function ($attribute, $value, $fail) {
                        try {
                            $issuedDate = Carbon::parse($value);
                            $today = Carbon::today();

                            if ($issuedDate > $today) {
                                $fail('Дата выдачи не может быть позже сегодняшней даты.');
                            }
                        } catch (\Exception $e) {
                            $fail('Некорректный формат даты.');
                        }
                    },
                ],
                'patient_id' => ['required', 'integer', 'exists:patients,id']
            ], [
                'series.required' => 'Серия обязательна для заполнения',
                'series.unique' => 'Такая серия уже существует',
                'number.required' => 'Номер обязателен для заполнения',
                'number.unique' => 'Такой номер уже существует',
                'issued.required' => 'Поле "Кем выдан" обязательно для заполнения',
                'patient_id.required' => 'ID пациента обязательно',
                'patient_id.exists' => 'Пациент не найден'
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $patientsPassword = PatientsPassword::create([
                'series' => $request->input('series'),
                'number' => $request->input('number'),
                'issued' => $request->input('issued'),
                'patient_id' => $request->input('patient_id')
            ]);

            return $this->successResponse(
                message: 'Пароль пациента успешно создан',
                data: $patientsPassword,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании пароля пациента: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании пароля пациента',
                error: $e->getMessage(),
            );
        }
    }

    public function patientsPasswordsAll(): JsonResponse
    {
        try {
            $passwords = PatientsPassword::all();

            return $this->successResponse(
                message: 'Список паролей пациентов получен',
                data: $passwords,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении паролей пациентов: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении паролей пациентов',
                error: $e->getMessage(),
            );
        }
    }

    public function patientsPasswordUpdate(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'series' => ['nullable', 'integer', Rule::unique('patients_passwords')->ignore($id)],
                'number' => ['nullable', 'integer', Rule::unique('patients_passwords')->ignore($id)],
                'issued' => ['nullable', 'string', 'max:255'],
            ], [
                'series.unique' => 'Такая серия уже существует',
                'number.unique' => 'Такой номер уже существует',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $patientsPassword = PatientsPassword::find($id);

            if (!$patientsPassword) {
                return $this->notFoundResponse();
            }

            $updated = $patientsPassword->update($request->only(['series', 'number', 'issued']));

            if (!$updated) {
                throw new Exception('Не удалось обновить пароль пациента');
            }

            $patientsPassword->refresh();

            return $this->successResponse(
                message: 'Пароль пациента успешно обновлен',
                data: $patientsPassword,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении пароля пациента: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'id' => $id
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении пароля пациента',
                error: $e->getMessage(),
            );
        }
    }

    public function patientsPasswordDelete(int $id): JsonResponse
    {
        try {
            $patientsPassword = PatientsPassword::findOrFail($id);

            $patientsPassword->delete();

            return $this->successResponse(
                message: 'Пароль пациента успешно удален',
                data: $patientsPassword,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении пароля пациента: ' . $e->getMessage(), [
                'exception' => $e,
                'id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении пароля пациента',
                error: $e->getMessage(),
            );
        }
    }
}
