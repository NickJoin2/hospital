<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\AllergensCategory;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class AllergensCategoryController extends Controller
{
    use ApiResponseMainTrait;

    public function createAllergensCategory(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'allergen_category_name' => ['required', 'string', 'max:255', 'unique:allergens_categories,allergen_category_name'],
                'allergen_category_description' => ['nullable', 'string', 'max:500'],
            ], [
                'allergen_category_name.required' => 'Название категории аллергенов обязательно для заполнения',
                'allergen_category_name.string' => 'Название должно быть строкой',
                'allergen_category_name.max' => 'Название не должно превышать 255 символов',
                'allergen_category_name.unique' => 'Категория аллергенов с таким названием уже существует',
                'allergen_category_description.string' => 'Описание должно быть строкой',
                'allergen_category_description.max' => 'Описание не должно превышать 500 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $allergenCategory = AllergensCategory::create([
                'allergen_category_name' => $request->input('allergen_category_name'),
                'allergen_category_description' => $request->input('allergen_category_description'),
            ]);

            return $this->successResponse(
                message: 'Категория аллергенов успешно создана',
                data: $allergenCategory,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании категории аллергенов: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании категории аллергенов',
                error: $e->getMessage(),
            );
        }
    }

    public function allergensCategoriesAll(): JsonResponse
    {
        try {
            $categories = AllergensCategory::all();

            return $this->successResponse(
                message: 'Список категорий аллергенов успешно получен',
                data: $categories,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка категорий аллергенов: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка категорий аллергенов',
                error: $e->getMessage(),
            );
        }
    }

    public function allergensCategoryUpdate(Request $request, int $categoryId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'allergen_category_name' => ['nullable', 'string', 'max:255', Rule::unique('allergens_categories')->ignore($categoryId)],
                'allergen_category_description' => ['nullable', 'string', 'max:500'],
            ], [
                'allergen_category_name.string' => 'Название должно быть строкой',
                'allergen_category_name.max' => 'Название не должно превышать 255 символов',
                'allergen_category_name.unique' => 'Категория аллергенов с таким названием уже существует',
                'allergen_category_description.string' => 'Описание должно быть строкой',
                'allergen_category_description.max' => 'Описание не должно превышать 500 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $category = AllergensCategory::find($categoryId);

            if (!$category) {
                return $this->notFoundResponse();
            }

            $updateData = $request->only(['allergen_category_name', 'allergen_category_description']);

            if ((!array_key_exists('allergen_category_name', $updateData) || $updateData['allergen_category_name'] === $category->allergen_category_name) &&
                (!array_key_exists('allergen_category_description', $updateData) || $updateData['allergen_category_description'] === $category->allergen_category_description)) {
                return $this->successResponse(
                    message: 'Данные не изменились',
                    data: $category,
                );
        }

            $updated = $category->update($updateData);
            if (!$updated) {
                throw new Exception('Не удалось обновить категорию аллергенов');
            }

            $category->refresh();

            return $this->successResponse(
                message: 'Категория аллергенов успешно обновлена',
                data: $category,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении категории аллергенов: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'category_id' => $categoryId,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении категории аллергенов',
                error: $e->getMessage(),
            );
        }
    }

    public function allergensCategoryDelete(int $categoryId): JsonResponse
    {
        try {
            $category = AllergensCategory::find($categoryId);

            if (!$category) {
                return $this->notFoundResponse();
            }

            $category->delete();

            return $this->successResponse(
                message: 'Категория аллергенов успешно удалена',
                data: $category,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении категории аллергенов: ' . $e->getMessage(), [
                'exception' => $e,
                'category_id' => $categoryId,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении категории аллергенов',
                error: $e->getMessage(),
            );
        }
    }
}
