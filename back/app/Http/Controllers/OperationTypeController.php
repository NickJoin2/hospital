<?php

namespace App\Http\Controllers;

use App\Models\OperationType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Exception;
use Illuminate\Http\JsonResponse;
use App\Http\Traits\ApiResponseMainTrait;

class OperationTypeController extends Controller
{
    use ApiResponseMainTrait;

    public function createOperationType(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'operation_type_name' => ['required', 'string', 'max:255', 'unique:operation_types,operation_type_name'],
                'operation_type_description' => ['nullable', 'string', 'max:500'],
            ], [
                'operation_type_name.required' => 'Название типа операции обязательно для заполнения',
                'operation_type_name.string' => 'Название должно быть строкой',
                'operation_type_name.max' => 'Название не должно превышать 255 символов',
                'operation_type_name.unique' => 'Тип операции с таким названием уже существует',
                'operation_type_description.string' => 'Описание должно быть строкой',
                'operation_type_description.max' => 'Описание не должно превышать 500 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $operationType = OperationType::create([
                'operation_type_name' => $request->input('operation_type_name'),
                'operation_type_description' => $request->input('operation_type_description'),
            ]);

            return $this->successResponse(
                message: 'Тип операции успешно создан',
                data: $operationType,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании типа операции: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании типа операции',
                error: $e->getMessage(),
            );
        }
    }

    public function operationTypesAll(): JsonResponse
    {
        try {
            $operationTypes = OperationType::all();

            return $this->successResponse(
                message: 'Список типов операций успешно получен',
                data: $operationTypes,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка типов операций: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка типов операций',
                error: $e->getMessage(),
            );
        }
    }

    public function operationTypeUpdate(Request $request, int $operationTypeId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'operation_type_name' => ['nullable', 'string', 'max:255', Rule::unique('operation_types')->ignore($operationTypeId)],
                'operation_type_description' => ['nullable', 'string', 'max:500'],
            ], [
                'operation_type_name.string' => 'Название должно быть строкой',
                'operation_type_name.max' => 'Название не должно превышать 255 символов',
                'operation_type_name.unique' => 'Тип операции с таким названием уже существует',
                'operation_type_description.string' => 'Описание должно быть строкой',
                'operation_type_description.max' => 'Описание не должно превышать 500 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $operationType = OperationType::find($operationTypeId);

            if (!$operationType) {
                return $this->notFoundResponse();
            }

            $updateData = $request->only(['operation_type_name', 'operation_type_description']);

            if ((!array_key_exists('operation_type_name', $updateData) || $updateData['operation_type_name'] === $operationType->operation_type_name) &&
                (!array_key_exists('operation_type_description', $updateData) || $updateData['operation_type_description'] === $operationType->operation_type_description)) {
                return $this->successResponse(
                    message: 'Данные не изменились',
                    data: $operationType,
                );
        }

            $updated = $operationType->update($updateData);
            if (!$updated) {
                throw new Exception('Не удалось обновить тип операции');
            }

            $operationType->refresh();

            return $this->successResponse(
                message: 'Тип операции успешно обновлен',
                data: $operationType,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении типа операции: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'operation_type_id' => $operationTypeId,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении типа операции',
                error: $e->getMessage(),
            );
        }
    }

    public function operationTypeDelete(int $operationTypeId): JsonResponse
    {
        try {
            $operationType = OperationType::find($operationTypeId);

            if (!$operationType) {
                return $this->notFoundResponse();
            }

            $operationType->delete();

            return $this->successResponse(
                message: 'Тип операции успешно удален',
                data: $operationType,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении типа операции: ' . $e->getMessage(), [
                'exception' => $e,
                'operation_type_id' => $operationTypeId,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении типа операции',
                error: $e->getMessage(),
            );
        }
    }
}
