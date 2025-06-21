<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\Operation;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class OperationController extends Controller
{
    use ApiResponseMainTrait;

    public function createOperation(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'operation_date_at' => ['required', 'date_format:Y-m-d', 'before_or_equal:today'],
                'patient_id' => ['required', 'integer', 'exists:patients,id'],
                'operation_type_id' => ['required', 'integer', 'exists:operation_types,id'],
                'anesthesia_type_id' => ['required', 'integer', 'exists:anesthesia_types,id'],
                'complication' => ['required', 'string', 'max:1000'],
                'post_op_care' => ['required', 'string', 'max:1000'],
                'notes' => ['required', 'string', 'max:1000'],
            ], [
                'operation_date_at.required' => 'Дата операции обязательна',
                'operation_date_at.before_or_equal' => 'Дата операции не может быть в будущем',
                'patient_id.required' => 'ID пациента обязательно',
                'patient_id.exists' => 'Пациент не найден',
                'operation_type_id.required' => 'Тип операции обязателен',
                'operation_type_id.exists' => 'Тип операции не найден',
                'anesthesia_type_id.required' => 'Тип анестезии обязателен',
                'anesthesia_type_id.exists' => 'Тип анестезии не найден',
                'complication.required' => 'Поле осложнений обязательно',
                'post_op_care.required' => 'Поле послеоперационного ухода обязательно',
                'notes.required' => 'Поле примечаний обязательно',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $operationDate = Carbon::createFromFormat('Y-m-d', $request->input('operation_date_at'));

            $operation = Operation::create([
                'operation_date_at' => $operationDate,
                'patient_id' => $request->input('patient_id'),
                'operation_type_id' => $request->input('operation_type_id'),
                'anesthesia_type_id' => $request->input('anesthesia_type_id'),
                'complication' => $request->input('complication'),
                'post_op_care' => $request->input('post_op_care'),
                'notes' => $request->input('notes'),
            ]);

            return $this->successResponse(
                message: 'Операция успешно создана',
                data: $operation,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании операции: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании операции',
                error: $e->getMessage(),
            );
        }
    }

    public function operationsAll(): JsonResponse
    {
        try {
            $operations = Operation::all();

            return $this->successResponse(
                message: 'Список операций получен',
                data: $operations,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка операций: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка операций',
                error: $e->getMessage(),
            );
        }
    }

    public function operationUpdate(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'operation_date_at' => ['nullable', 'date_format:Y-m-d', 'before_or_equal:today'],
                'patient_id' => ['nullable', 'integer', 'exists:patients,id'],
                'operation_type_id' => ['nullable', 'integer', 'exists:operation_types,id'],
                'anesthesia_type_id' => ['nullable', 'integer', 'exists:anesthesia_types,id'],
                'complication' => ['nullable', 'string', 'max:1000'],
                'post_op_care' => ['nullable', 'string', 'max:1000'],
                'notes' => ['nullable', 'string', 'max:1000'],
            ], [
                'operation_date_at.before_or_equal' => 'Дата операции не может быть в будущем',
                'patient_id.exists' => 'Пациент не найден',
                'operation_type_id.exists' => 'Тип операции не найден',
                'anesthesia_type_id.exists' => 'Тип анестезии не найден',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $operation = Operation::find($id);

            if (!$operation) {
                return $this->notFoundResponse();
            }

            $updateData = $request->only([
                'patient_id',
                'operation_type_id',
                'anesthesia_type_id',
                'complication',
                'post_op_care',
                'notes'
            ]);

            if ($request->has('operation_date_at')) {
                $updateData['operation_date_at'] = Carbon::createFromFormat('Y-m-d', $request->input('operation_date_at'));
            }

            $updated = $operation->update($updateData);

            if (!$updated) {
                throw new Exception('Не удалось обновить данные операции');
            }

            $operation->refresh();

            return $this->successResponse(
                message: 'Данные операции успешно обновлены',
                data: $operation,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении операции: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении операции',
                error: $e->getMessage(),
            );
        }
    }

    public function operationDelete(int $id): JsonResponse
    {
        try {
            $operation = Operation::findOrFail($id);

            $operation->delete();

            return $this->successResponse(
                message: 'Операция успешно удалена',
                data: $operation,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении операции: ' . $e->getMessage(), [
                'exception' => $e,
                'id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении операции',
                error: $e->getMessage(),
            );
        }
    }
}
