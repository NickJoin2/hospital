<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\Severity;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class SeverityController extends Controller
{
    use ApiResponseMainTrait;

    public function createSeverity(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'severity_name' => ['required', 'string', 'max:255', 'unique:severities,severity_name'],
                'severity_description' => ['nullable', 'string', 'max:500'],
            ], [
                'severity_name.required' => 'Название степени тяжести обязательно для заполнения',
                'severity_name.string' => 'Название должно быть строкой',
                'severity_name.max' => 'Название не должно превышать 255 символов',
                'severity_name.unique' => 'Степень тяжести с таким названием уже существует',
                'severity_description.string' => 'Описание должно быть строкой',
                'severity_description.max' => 'Описание не должно превышать 500 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $severity = Severity::create([
                'severity_name' => $request->input('severity_name'),
                'severity_description' => $request->input('severity_description'),
            ]);

            return $this->successResponse(
                message: 'Степень тяжести успешно создана',
                data: $severity,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании степени тяжести: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании степени тяжести',
                error: $e->getMessage(),
            );
        }
    }

    public function severitiesAll(): JsonResponse
    {
        try {
            $severities = Severity::all();

            return $this->successResponse(
                message: 'Список степеней тяжести успешно получен',
                data: $severities,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка степеней тяжести: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка степеней тяжести',
                error: $e->getMessage(),
            );
        }
    }

    public function severityUpdate(Request $request, int $severityId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'severity_name' => ['nullable', 'string', 'max:255', Rule::unique('severities')->ignore($severityId)],
                'severity_description' => ['nullable', 'string', 'max:500'],
            ], [
                'severity_name.string' => 'Название должно быть строкой',
                'severity_name.max' => 'Название не должно превышать 255 символов',
                'severity_name.unique' => 'Степень тяжести с таким названием уже существует',
                'severity_description.string' => 'Описание должно быть строкой',
                'severity_description.max' => 'Описание не должно превышать 500 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $severity = Severity::find($severityId);

            if (!$severity) {
                return $this->notFoundResponse();
            }

            $updateData = $request->only(['severity_name', 'severity_description']);

            if ((!array_key_exists('severity_name', $updateData) || $updateData['severity_name'] === $severity->severity_name) &&
                (!array_key_exists('severity_description', $updateData) || $updateData['severity_description'] === $severity->severity_description)) {
                return $this->successResponse(
                    message: 'Данные не изменились',
                    data: $severity,
                );
        }

            $updated = $severity->update($updateData);
            if (!$updated) {
                throw new Exception('Не удалось обновить степень тяжести');
            }

            $severity->refresh();

            return $this->successResponse(
                message: 'Степень тяжести успешно обновлена',
                data: $severity,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении степени тяжести: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'severity_id' => $severityId,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении степени тяжести',
                error: $e->getMessage(),
            );
        }
    }

    public function severityDelete(int $severityId): JsonResponse
    {
        try {
            $severity = Severity::find($severityId);

            if (!$severity) {
                return $this->notFoundResponse();
            }

            $severity->delete();

            return $this->successResponse(
                message: 'Степень тяжести успешно удалена',
                data: $severity,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении степени тяжести: ' . $e->getMessage(), [
                'exception' => $e,
                'severity_id' => $severityId,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении степени тяжести',
                error: $e->getMessage(),
            );
        }
    }
}
