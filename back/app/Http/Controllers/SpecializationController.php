<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\Specialization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
class SpecializationController extends Controller
{
    use ApiResponseMainTrait;

    public function createSpecialization(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'specialization_code' => ['required', 'string', 'max:50'],
                'specialization_name' => ['required', 'string', 'max:255', 'unique:specializations,specialization_name'],
            ], [
                'specialization_code.required' => 'Код специализации обязателен для заполнения',
                'specialization_code.string' => 'Код специализации должен быть строкой',
                'specialization_code.max' => 'Код специализации не должен превышать 50 символов',
                'specialization_name.required' => 'Название специализации обязательно для заполнения',
                'specialization_name.string' => 'Название специализации должно быть строкой',
                'specialization_name.max' => 'Название специализации не должно превышать 255 символов',
                'specialization_name.unique' => 'Специализация с таким названием уже существует',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $specialization = Specialization::create([
                'specialization_code' => $request->input('specialization_code'),
                'specialization_name' => $request->input('specialization_name'),
            ]);

            return $this->successResponse(
                message: 'Специализация успешно создана',
                data: $specialization,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании специализации: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании специализации',
                error: $e->getMessage(),
            );
        }
    }

    public function specializationsAll(): JsonResponse
    {
        try {
            $specializations = Specialization::all();

            return $this->successResponse(
                message: 'Список специализаций успешно получен',
                data: $specializations,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка специализаций: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка специализаций',
                error: $e->getMessage(),
            );
        }
    }

    public function specializationUpdate(Request $request, int $specializationId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'specialization_code' => ['nullable', 'string', 'max:50'],
                'specialization_name' => ['nullable', 'string', 'max:255', Rule::unique('specializations')->ignore($specializationId)],
            ], [
                'specialization_code.string' => 'Код специализации должен быть строкой',
                'specialization_code.max' => 'Код специализации не должен превышать 50 символов',
                'specialization_name.string' => 'Название специализации должно быть строкой',
                'specialization_name.max' => 'Название специализации не должно превышать 255 символов',
                'specialization_name.unique' => 'Специализация с таким названием уже существует',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $specialization = Specialization::find($specializationId);

            if (!$specialization) {
                return $this->notFoundResponse();
            }

            $updateData = $request->only(['specialization_code', 'specialization_name']);

            if ((!array_key_exists('specialization_code', $updateData) || $updateData['specialization_code'] === $specialization->specialization_code) &&
                (!array_key_exists('specialization_name', $updateData) || $updateData['specialization_name'] === $specialization->specialization_name)) {
                return $this->successResponse(
                    message: 'Данные не изменились',
                    data: $specialization,
                );
            }

            $updated = $specialization->update($updateData);
            if (!$updated) {
                throw new Exception('Не удалось обновить специализацию');
            }

            $specialization->refresh();

            return $this->successResponse(
                message: 'Специализация успешно обновлена',
                data: $specialization,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении специализации: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'specialization_id' => $specializationId,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении специализации',
                error: $e->getMessage(),
            );
        }
    }

    public function specializationDelete(int $specializationId): JsonResponse
    {
        try {
            $specialization = Specialization::find($specializationId);

            if (!$specialization) {
                return $this->notFoundResponse();
            }

            $specialization->delete();

            return $this->successResponse(
                message: 'Специализация успешно удалена',
                data: $specialization,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении специализации: ' . $e->getMessage(), [
                'exception' => $e,
                'specialization_id' => $specializationId,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении специализации',
                error: $e->getMessage(),
            );
        }
    }
}
