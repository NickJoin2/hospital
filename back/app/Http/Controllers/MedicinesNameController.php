<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\MedicinesName;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class MedicinesNameController extends Controller
{
    use ApiResponseMainTrait;

    public function createMedicinesName(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'medicine_name' => ['required', 'string', 'max:255', 'unique:medicines_names,medicine_name'],
            ], [
                'medicine_name.required' => 'Название препарата обязательно',
                'medicine_name.unique' => 'Препарат с таким названием уже существует',
                'medicine_name.max' => 'Название не должно превышать 255 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $medicine = MedicinesName::create([
                'medicine_name' => $request->input('medicine_name'),
            ]);

            return $this->successResponse(
                message: 'Препарат успешно добавлен',
                data: $medicine,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при добавлении препарата: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при добавлении препарата',
                error: $e->getMessage(),
            );
        }
    }

    public function medicinesNamesAll(): JsonResponse
    {
        try {
            $medicines = MedicinesName::all();

            return $this->successResponse(
                message: 'Список препаратов получен',
                data: $medicines,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка препаратов: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка препаратов',
                error: $e->getMessage(),
            );
        }
    }

    public function medicinesNameUpdate(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'medicine_name' => ['nullable', 'string', 'max:255', Rule::unique('medicines_names')->ignore($id)],
            ], [
                'medicine_name.unique' => 'Препарат с таким названием уже существует',
                'medicine_name.max' => 'Название не должно превышать 255 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $medicine = MedicinesName::find($id);

            if (!$medicine) {
                return $this->notFoundResponse();
            }

            if (!$request->has('medicine_name')) {
                return $this->successResponse(
                    message: 'Данные препарата не изменились',
                    data: $medicine,
                );
            }

            $updated = $medicine->update([
                'medicine_name' => $request->input('medicine_name')
            ]);

            if (!$updated) {
                throw new Exception('Не удалось обновить препарат');
            }

            $medicine->refresh();

            return $this->successResponse(
                message: 'Препарат успешно обновлен',
                data: $medicine,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении препарата: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении препарата',
                error: $e->getMessage(),
            );
        }
    }

    public function medicinesNameDelete(int $id): JsonResponse
    {
        try {
            $medicine = MedicinesName::findOrFail($id);

            $medicine->delete();

            return $this->successResponse(
                message: 'Препарат успешно удален',
                data: $medicine,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении препарата: ' . $e->getMessage(), [
                'exception' => $e,
                'id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении препарата',
                error: $e->getMessage(),
            );
        }
    }
}
