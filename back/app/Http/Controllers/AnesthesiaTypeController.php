<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\AnesthesiaType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

use Symfony\Component\HttpFoundation\Response;
use Exception;


class AnesthesiaTypeController extends Controller
{
    use ApiResponseMainTrait;

    public function createAnesthesiaType(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'anesthesia_name' => ['required', 'string', 'max:255', 'unique:anesthesia_types,anesthesia_name'],
                'anesthesia_description' => ['required', 'string', 'max:500'],
            ], [
                'anesthesia_name.required' => 'Название анестезии обязательно для заполнения',
                'anesthesia_name.string' => 'Название должно быть строкой',
                'anesthesia_name.max' => 'Название не должно превышать 255 символов',
                'anesthesia_name.unique' => 'Тип анестезии с таким названием уже существует',
                'anesthesia_description.required' => 'Описание обязательно для заполнения',
                'anesthesia_description.string' => 'Описание должно быть строкой',
                'anesthesia_description.max' => 'Описание не должно превышать 500 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $anesthesiaType = AnesthesiaType::create([
                'anesthesia_name' => $request->input('anesthesia_name'),
                'anesthesia_description' => $request->input('anesthesia_description'),
            ]);

            return $this->successResponse(
                message: 'Тип анестезии успешно создан',
                data: $anesthesiaType,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании типа анестезии: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании типа анестезии',
                error: $e->getMessage(),
            );
        }
    }

    public function anesthesiaTypesAll(): JsonResponse
    {
        try {
            $anesthesiaTypes = AnesthesiaType::all();

            return $this->successResponse(
                message: 'Список типов анестезии успешно получен',
                data: $anesthesiaTypes,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка типов анестезии: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка типов анестезии',
                error: $e->getMessage(),
            );
        }
    }

    public function anesthesiaTypeUpdate(Request $request, int $anesthesiaTypeId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'anesthesia_name' => ['nullable', 'string', 'max:255', Rule::unique('anesthesia_types')->ignore($anesthesiaTypeId)],
                'anesthesia_description' => ['nullable', 'string', 'max:500'],
            ], [
                'anesthesia_name.string' => 'Название должно быть строкой',
                'anesthesia_name.max' => 'Название не должно превышать 255 символов',
                'anesthesia_name.unique' => 'Тип анестезии с таким названием уже существует',
                'anesthesia_description.string' => 'Описание должно быть строкой',
                'anesthesia_description.max' => 'Описание не должно превышать 500 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $anesthesiaType = AnesthesiaType::find($anesthesiaTypeId);

            if (!$anesthesiaType) {
                return $this->notFoundResponse();
            }

            $updateData = $request->only(['anesthesia_name', 'anesthesia_description']);

            if ((!array_key_exists('anesthesia_name', $updateData) || $updateData['anesthesia_name'] === $anesthesiaType->anesthesia_name) &&
                (!array_key_exists('anesthesia_description', $updateData) || $updateData['anesthesia_description'] === $anesthesiaType->anesthesia_description)) {
                return $this->successResponse(
                    message: 'Данные не изменились',
                    data: $anesthesiaType,
                );
        }

            $updated = $anesthesiaType->update($updateData);
            if (!$updated) {
                throw new Exception('Не удалось обновить тип анестезии');
            }

            $anesthesiaType->refresh();

            return $this->successResponse(
                message: 'Тип анестезии успешно обновлен',
                data: $anesthesiaType,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении типа анестезии: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'anesthesia_type_id' => $anesthesiaTypeId,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении типа анестезии',
                error: $e->getMessage(),
            );
        }
    }

    public function anesthesiaTypeDelete(int $anesthesiaTypeId): JsonResponse
    {
        try {
            $anesthesiaType = AnesthesiaType::find($anesthesiaTypeId);

            if (!$anesthesiaType) {
                return $this->notFoundResponse();
            }

            $anesthesiaType->delete();

            return $this->successResponse(
                message: 'Тип анестезии успешно удален',
                data: $anesthesiaType,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении типа анестезии: ' . $e->getMessage(), [
                'exception' => $e,
                'anesthesia_type_id' => $anesthesiaTypeId,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении типа анестезии',
                error: $e->getMessage(),
            );
        }
    }
}
