<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\Allergen;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class AllergenController extends Controller
{
    use ApiResponseMainTrait;

    public function createAllergen(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'allergen_name' => ['required', 'string', 'max:255',],
                'allergen_category_name_id' => ['required', 'integer', 'exists:allergens_categories,id'],
            ], [
                'allergen_name.required' => 'Название аллергена обязательно',
                'allergen_name.unique' => 'Такой аллерген уже существует',
                'allergen_name.max' => 'Название не должно превышать 255 символов',
                'allergen_category_name_id.required' => 'Категория аллергена обязательна',
                'allergen_category_name_id.exists' => 'Категория аллергена не найдена',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $allergen = Allergen::create([
                'allergen_name' => $request->input('allergen_name'),
                'allergen_category_name_id' => $request->input('allergen_category_name_id'),
            ]);

            return $this->successResponse(
                message: 'Аллерген успешно создан',
                data: $allergen,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании аллергена: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании аллергена',
                error: $e->getMessage(),
            );
        }
    }

    public function allergensAll(): JsonResponse
    {
        try {
            $allergens = Allergen::all();

            return $this->successResponse(
                message: 'Список аллергенов получен',
                data: $allergens,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка аллергенов: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка аллергенов',
                error: $e->getMessage(),
            );
        }
    }

    public function allergenUpdate(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'allergen_name' => ['nullable', 'string', 'max:255', Rule::unique('allergens')->ignore($id)],
                'allergen_category_name_id' => ['nullable', 'integer', 'exists:allergen_categories,id'],
            ], [
                'allergen_name.unique' => 'Такой аллерген уже существует',
                'allergen_name.max' => 'Название не должно превышать 255 символов',
                'allergen_category_name_id.exists' => 'Категория аллергена не найдена',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $allergen = Allergen::find($id);

            if (!$allergen) {
                return $this->notFoundResponse();
            }

            $updateData = $request->only(['allergen_name', 'allergen_category_name_id']);

            // Проверяем, были ли вообще переданы данные для обновления
            if (empty(array_filter($updateData))) {
                return $this->successResponse(
                    message: 'Данные аллергена не изменились',
                    data: $allergen,
                );
            }

            $updated = $allergen->update($updateData);

            if (!$updated) {
                throw new Exception('Не удалось обновить аллерген');
            }

            $allergen->refresh();

            return $this->successResponse(
                message: 'Аллерген успешно обновлен',
                data: $allergen,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении аллергена: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении аллергена',
                error: $e->getMessage(),
            );
        }
    }

    public function allergenDelete(int $id): JsonResponse
    {
        try {
            $allergen = Allergen::findOrFail($id);

            $allergen->delete();

            return $this->successResponse(
                message: 'Аллерген успешно удален',
                data: $allergen,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении аллергена: ' . $e->getMessage(), [
                'exception' => $e,
                'id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении аллергена',
                error: $e->getMessage(),
            );
        }
    }
}
