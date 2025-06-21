<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\Allergy;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class AllergyController extends Controller
{
    use ApiResponseMainTrait;

    public function createAllergy(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'reaction' => ['required', 'string', 'max:1000'],
                'date_diagnose_at' => ['required', 'date_format:Y-m-d', 'before_or_equal:today'],
                'patient_id' => ['required', 'integer', 'exists:patients,id'],
                'allergen_id' => ['required', 'integer', 'exists:allergens,id'],
                'severity_id' => ['required', 'integer', 'exists:severities,id'],
            ], [
                'reaction.required' => 'Описание реакции обязательно',
                'reaction.max' => 'Описание реакции не должно превышать 1000 символов',
                'date_diagnose_at.required' => 'Дата диагностики обязательна',
                'date_diagnose_at.before_or_equal' => 'Дата не может быть в будущем',
                'patient_id.required' => 'ID пациента обязательно',
                'patient_id.exists' => 'Пациент не найден',
                'allergen_id.required' => 'Аллерген обязателен',
                'allergen_id.exists' => 'Аллерген не найден',
                'severity_id.required' => 'Степень тяжести обязательна',
                'severity_id.exists' => 'Степень тяжести не найдена',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $dateDiagnose = Carbon::createFromFormat('Y-m-d', $request->input('date_diagnose_at'));

            $allergy = Allergy::create([
                'reaction' => $request->input('reaction'),
                'date_diagnose_at' => $dateDiagnose,
                'patient_id' => $request->input('patient_id'),
                'allergen_id' => $request->input('allergen_id'),
                'severity_id' => $request->input('severity_id'),
            ]);

            return $this->successResponse(
                message: 'Аллергия успешно зарегистрирована',
                data: $allergy,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании аллергии: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании аллергии',
                error: $e->getMessage(),
            );
        }
    }

    public function allergiesAll(): JsonResponse
    {
        try {
            $allergies = Allergy::all();

            return $this->successResponse(
                message: 'Список аллергий получен',
                data: $allergies,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка аллергий: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка аллергий',
                error: $e->getMessage(),
            );
        }
    }

    public function allergyUpdate(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'reaction' => ['nullable', 'string', 'max:1000'],
                'date_diagnose_at' => ['nullable', 'date_format:Y-m-d', 'before_or_equal:today'],
                'patient_id' => ['nullable', 'integer', 'exists:patients,id'],
                'allergen_id' => ['nullable', 'integer', 'exists:allergens,id'],
                'severity_id' => ['nullable', 'integer', 'exists:severities,id'],
            ], [
                'reaction.max' => 'Описание реакции не должно превышать 1000 символов',
                'date_diagnose_at.before_or_equal' => 'Дата не может быть в будущем',
                'patient_id.exists' => 'Пациент не найден',
                'allergen_id.exists' => 'Аллерген не найден',
                'severity_id.exists' => 'Степень тяжести не найдена',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $allergy = Allergy::find($id);

            if (!$allergy) {
                return $this->notFoundResponse();
            }

            $updateData = $request->only([
                'reaction',
                'patient_id',
                'allergen_id',
                'severity_id'
            ]);

            if ($request->has('date_diagnose_at')) {
                $updateData['date_diagnose_at'] = Carbon::createFromFormat('Y-m-d', $request->input('date_diagnose_at'));
            }

            // Проверяем, были ли переданы данные для обновления
            if (empty(array_filter($updateData))) {
                return $this->successResponse(
                    message: 'Данные аллергии не изменились',
                    data: $allergy,
                );
            }

            $updated = $allergy->update($updateData);

            if (!$updated) {
                throw new Exception('Не удалось обновить данные аллергии');
            }

            $allergy->refresh();

            return $this->successResponse(
                message: 'Данные аллергии успешно обновлены',
                data: $allergy,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении аллергии: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении аллергии',
                error: $e->getMessage(),
            );
        }
    }

    public function allergyDelete(int $id): JsonResponse
    {
        try {
            $allergy = Allergy::findOrFail($id);

            $allergy->delete();

            return $this->successResponse(
                message: 'Аллергия успешно удалена',
                data: $allergy,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении аллергии: ' . $e->getMessage(), [
                'exception' => $e,
                'id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении аллергии',
                error: $e->getMessage(),
            );
        }
    }
}
