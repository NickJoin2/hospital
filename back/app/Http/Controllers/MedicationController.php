<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\Diagnose;
use App\Models\DiagnoseMedication;
use App\Models\Medication;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class MedicationController extends Controller
{
    use ApiResponseMainTrait;

    public function createMedication(Request $request, int $diagnoseId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'medicine_name_id' => ['required', 'integer', 'exists:medicines_names,id'],
                'dosage' => ['required', 'string', 'max:255'],
                'start_date_at' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
                'end_date_at' => ['required', 'date_format:Y-m-d', 'after_or_equal:start_date_at'],
                'frequency_id' => ['required', 'integer', 'exists:frequencies,id'],
            ], [
                'medicine_name_id.required' => 'Препарат обязателен',
                'medicine_name_id.exists' => 'Препарат не найден',
                'dosage.required' => 'Дозировка обязательна',
                'dosage.max' => 'Дозировка не должна превышать 255 символов',
                'start_date_at.required' => 'Дата начала обязательна',
                'start_date_at.after_or_equal' => 'Дата начала не может быть в прошлом',
                'end_date_at.required' => 'Дата окончания обязательна',
                'end_date_at.after_or_equal' => 'Дата окончания должна быть после даты начала',
                'frequency_id.required' => 'Частота приема обязательна',
                'frequency_id.exists' => 'Частота приема не найдена',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            // Проверяем существование диагноза
            if (!Diagnose::find($diagnoseId)) {
                return $this->notFoundResponse('Диагноз не найден');
            }

            $medication = Medication::create([
                'medicine_name_id' => $request->medicine_name_id,
                'dosage' => $request->dosage,
                'start_date_at' => $request->start_date_at,
                'end_date_at' => $request->end_date_at,
                'frequency_id' => $request->frequency_id,
            ]);

            DiagnoseMedication::create([
                'diagnose_id' => $diagnoseId,
                'medication_id' => $medication->id,
            ]);

            return $this->successResponse(
                message: 'Медикамент успешно назначен',
                data: $medication->load(['medicineName', 'frequency']),
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при назначении медикамента: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'diagnose_id' => $diagnoseId,
            ]);
            return $this->errorResponse(
                message: 'Ошибка при назначении медикамента',
                error: $e->getMessage(),
            );
        }
    }

    public function medicationsAll(int $diagnoseId): JsonResponse
    {
        try {
            // Проверяем существование диагноза
            if (!Diagnose::find($diagnoseId)) {
                return $this->notFoundResponse('Диагноз не найден');
            }

            $medications = Medication::whereHas('diagnoses', function($query) use ($diagnoseId) {
                $query->where('diagnose_id', $diagnoseId);
            })
                ->with(['medicineName', 'frequency'])
                ->get();

            return $this->successResponse(
                message: 'Список медикаментов получен',
                data: $medications,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка медикаментов: ' . $e->getMessage(), [
                'exception' => $e,
                'diagnose_id' => $diagnoseId,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка медикаментов',
                error: $e->getMessage(),
            );
        }
    }

    public function medicationUpdate(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'medicine_name_id' => ['nullable', 'integer', 'exists:medicines_names,id'],
                'dosage' => ['nullable', 'string', 'max:255'],
                'start_date_at' => ['nullable', 'date_format:Y-m-d'],
                'end_date_at' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:start_date_at'],
                'frequency_id' => ['nullable', 'integer', 'exists:frequencies,id'],
            ], [
                'medicine_name_id.exists' => 'Препарат не найден',
                'dosage.max' => 'Дозировка не должна превышать 255 символов',
                'end_date_at.after_or_equal' => 'Дата окончания должна быть после даты начала',
                'frequency_id.exists' => 'Частота приема не найдена',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $medication = Medication::find($id);

            if (!$medication) {
                return $this->notFoundResponse('Медикамент не найден');
            }

            $updateData = $request->only([
                'medicine_name_id',
                'dosage',
                'frequency_id',
                'start_date_at',
                'end_date_at'
            ]);

            if (empty(array_filter($updateData))) {
                return $this->successResponse(
                    message: 'Данные медикамента не изменились',
                    data: $medication,
                );
            }

            $updated = $medication->update($updateData);

            if (!$updated) {
                throw new Exception('Не удалось обновить медикамент');
            }

            $medication->refresh();

            return $this->successResponse(
                message: 'Медикамент успешно обновлен',
                data: $medication->load(['medicineName', 'frequency']),
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении медикамента: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'medication_id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении медикамента',
                error: $e->getMessage(),
            );
        }
    }

    public function medicationDelete(int $id): JsonResponse
    {
        try {
            $medication = Medication::findOrFail($id);

            // Удаляем связь с диагнозом перед удалением медикамента
            DiagnoseMedication::where('medication_id', $id)->delete();

            $medication->delete();

            return $this->successResponse(
                message: 'Медикамент успешно удален',
                data: $medication,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении медикамента: ' . $e->getMessage(), [
                'exception' => $e,
                'medication_id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении медикамента',
                error: $e->getMessage(),
            );
        }
    }
}
