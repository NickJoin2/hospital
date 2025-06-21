<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\Diagnose;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class DiagnosesController extends Controller
{
    use ApiResponseMainTrait;

    public function createDiagnose(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'appointment_id' => ['required', 'integer', 'exists:appointments,id'],
                'diagnose_name' => ['required', 'string', 'max:255'],
                'diagnose_description' => ['required', 'string', 'max:1000'],
            ], [
                'appointment_id.required' => 'ID приема обязательно',
                'appointment_id.exists' => 'Прием не найден',
                'diagnose_name.required' => 'Название диагноза обязательно',
                'diagnose_name.max' => 'Название диагноза не должно превышать 255 символов',
                'diagnose_description.required' => 'Описание диагноза обязательно',
                'diagnose_description.max' => 'Описание диагноза не должно превышать 1000 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $diagnose = Diagnose::create([
                'appointment_id' => $request->appointment_id,
                'diagnose_name' => $request->diagnose_name,
                'diagnose_description' => $request->diagnose_description,
                'date_diagnosed' => now()->toDateString(),
            ]);

            return $this->successResponse(
                message: 'Диагноз успешно создан',
                data: $diagnose,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании диагноза: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании диагноза',
                error: $e->getMessage(),
            );
        }
    }

    public function diagnosesAll(): JsonResponse
    {
        try {
            $diagnoses = Diagnose::with(['appointment'])->get();

            return $this->successResponse(
                message: 'Список диагнозов получен',
                data: $diagnoses,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка диагнозов: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка диагнозов',
                error: $e->getMessage(),
            );
        }
    }

    public function diagnoseUpdate(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'appointment_id' => ['nullable', 'integer', 'exists:appointments,id'],
                'diagnose_name' => ['nullable', 'string', 'max:255'],
                'diagnose_description' => ['nullable', 'string', 'max:1000'],
                'date_diagnosed' => ['nullable', 'date_format:Y-m-d'],
            ], [
                'appointment_id.exists' => 'Прием не найден',
                'diagnose_name.max' => 'Название диагноза не должно превышать 255 символов',
                'diagnose_description.max' => 'Описание диагноза не должно превышать 1000 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $diagnose = Diagnose::find($id);

            if (!$diagnose) {
                return $this->notFoundResponse();
            }

            $updateData = $request->only([
                'appointment_id',
                'diagnose_name',
                'diagnose_description',
                'date_diagnosed'
            ]);

            if (empty(array_filter($updateData))) {
                return $this->successResponse(
                    message: 'Данные диагноза не изменились',
                    data: $diagnose,
                );
            }

            $updated = $diagnose->update($updateData);

            if (!$updated) {
                throw new Exception('Не удалось обновить диагноз');
            }

            $diagnose->refresh();

            return $this->successResponse(
                message: 'Диагноз успешно обновлен',
                data: $diagnose,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении диагноза: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении диагноза',
                error: $e->getMessage(),
            );
        }
    }

    public function diagnoseDelete(int $id): JsonResponse
    {
        try {
            $diagnose = Diagnose::findOrFail($id);

            $diagnose->delete();

            return $this->successResponse(
                message: 'Диагноз успешно удален',
                data: $diagnose,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении диагноза: ' . $e->getMessage(), [
                'exception' => $e,
                'id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении диагноза',
                error: $e->getMessage(),
            );
        }
    }
}
