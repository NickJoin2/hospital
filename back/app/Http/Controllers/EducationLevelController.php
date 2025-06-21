<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\EducationLevel;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class EducationLevelController extends Controller
{
    use ApiResponseMainTrait;

    public function createEducationLevel(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'level_name' => ['required', 'max:255', 'unique:education_levels,level_name'],
            ], [
                'level_name.required' => 'Поле обязательно для заполнения',
                'level_name.unique' => 'Поле с таким названием уже существует',
                'level_name.max' => 'Поле не должно превышать 255 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $educationLevel = EducationLevel::create([
                'level_name' => $request->input('level_name'),
            ]);

            return $this->successResponse(
                message: 'Уровень образования успешно создан',
                data: $educationLevel,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании уровня образования: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании уровня образования',
                error: $e->getMessage(),
            );
        }
    }

    public function educationLevelsAll(): JsonResponse
    {
        try {
            $educationLevels = EducationLevel::all();

            return $this->successResponse(
                message: 'Список уровней образования успешно получен',
                data: $educationLevels,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении уровней образования: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении уровней образования',
                error: $e->getMessage(),
            );
        }
    }

    public function educationLevelUpdate(Request $request, int $educationLevelId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'level_name' => ['required', 'string', 'max:255', Rule::unique('education_levels')->ignore($educationLevelId)]
            ], [
                'level_name.required' => 'Поле обязательно для заполнения',
                'level_name.unique' => 'Поле с таким названием уже существует',
                'level_name.max' => 'Поле не должно превышать 255 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $educationLevel = EducationLevel::find($educationLevelId);

            if (!$educationLevel) {
                return $this->notFoundResponse();
            }

            $newName = $request->input('level_name');

            if ($educationLevel->level_name === $newName) {
                return $this->successResponse(
                    message: 'Данные не изменились',
                    data: $educationLevel,
                );
            }

            $updated = $educationLevel->update(['level_name' => $newName]);
            if (!$updated) {
                throw new Exception('Не удалось обновить уровень образования');
            }

            $educationLevel->refresh();

            return $this->successResponse(
                message: 'Уровень образования успешно обновлен',
                data: $educationLevel,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении уровня образования: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении уровня образования',
                error: $e->getMessage(),
            );
        }
    }

    public function educationLevelDelete(int $educationLevelId): JsonResponse
    {
        try {
            $educationLevel = EducationLevel::findOrFail($educationLevelId);

            $educationLevel->delete();

            return $this->successResponse(
                message: 'Уровень образования успешно удален',
                data: $educationLevel,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении уровня образования: ' . $e->getMessage(), [
                'exception' => $e,
                'education_level_id' => $educationLevelId,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении уровня образования',
                error: $e->getMessage(),
            );
        }
    }
}
