<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\PatientInsurance;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class PatientsInsuranceController extends Controller
{
    use ApiResponseMainTrait;

    public function createPatientsInsurance(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'company' => ['required', 'string', 'max:255'],
                'insurance_number' => ['required', 'numeric', 'unique:patient_insurances,insurance_number'],
                'date_end_at' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
                'patient_id' => ['required', 'integer', 'exists:patients,id']
            ], [
                'company.required' => 'Название компании обязательно',
                'insurance_number.required' => 'Номер страховки обязателен',
                'insurance_number.unique' => 'Такой номер страховки уже существует',
                'date_end_at.required' => 'Дата окончания обязательна',
                'date_end_at.after_or_equal' => 'Дата окончания должна быть сегодня или позже',
                'patient_id.required' => 'ID пациента обязательно',
                'patient_id.exists' => 'Пациент не найден'
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $dateEndAt = Carbon::createFromFormat('Y-m-d', $request->input('date_end_at'));

            $patientInsurance = PatientInsurance::create([
                'company' => $request->input('company'),
                'insurance_number' => $request->input('insurance_number'),
                'date_end_at' => $dateEndAt,
                'patient_id' => $request->input('patient_id')
            ]);

            return $this->successResponse(
                message: 'Страховка пациента успешно создана',
                data: $patientInsurance,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании страховки пациента: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании страховки пациента',
                error: $e->getMessage(),
            );
        }
    }

    public function patientsInsurancesAll(): JsonResponse
    {
        try {
            $insurances = PatientInsurance::all();

            return $this->successResponse(
                message: 'Список страховок пациентов получен',
                data: $insurances,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении страховок пациентов: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении страховок пациентов',
                error: $e->getMessage(),
            );
        }
    }

    public function patientsInsuranceUpdate(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'company' => ['nullable', 'string', 'max:255'],
                'insurance_number' => ['nullable', 'numeric', Rule::unique('patient_insurances')->ignore($id)],
                'date_end_at' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:today']
            ], [
                'insurance_number.unique' => 'Такой номер страховки уже существует',
                'date_end_at.after_or_equal' => 'Дата окончания должна быть сегодня или позже'
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $patientInsurance = PatientInsurance::find($id);

            if (!$patientInsurance) {
                return $this->notFoundResponse();
            }

            $updateData = $request->only(['company', 'insurance_number']);

            if ($request->has('date_end_at')) {
                $updateData['date_end_at'] = Carbon::createFromFormat('Y-m-d', $request->input('date_end_at'));
            }

            $updated = $patientInsurance->update($updateData);

            if (!$updated) {
                throw new Exception('Не удалось обновить страховку пациента');
            }

            $patientInsurance->refresh();

            return $this->successResponse(
                message: 'Страховка пациента успешно обновлена',
                data: $patientInsurance,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении страховки пациента: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'id' => $id
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении страховки пациента',
                error: $e->getMessage(),
            );
        }
    }

    public function patientsInsuranceDelete(int $id): JsonResponse
    {
        try {
            $patientInsurance = PatientInsurance::findOrFail($id);

            $patientInsurance->delete();

            return $this->successResponse(
                message: 'Страховка пациента успешно удалена',
                data: $patientInsurance,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении страховки пациента: ' . $e->getMessage(), [
                'exception' => $e,
                'id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении страховки пациента',
                error: $e->getMessage(),
            );
        }
    }
}
