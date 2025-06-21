<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\WorkerEducation;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class WorkerEducationController extends Controller
{
    use ApiResponseMainTrait;

    public function createWorkerEducation(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'year_start' => ['required', 'date_format:Y-m-d'],
                'year_end' => ['required', 'date_format:Y-m-d', 'after_or_equal:year_start'],
                'specialization_id' => ['required', 'integer', 'exists:specializations,id'],
                'is_not_finished' => ['sometimes', 'boolean'],
                'educational_institution' => ['required', 'string', 'max:255'],
                'education_level_id' => ['required', 'integer', 'exists:education_levels,id'],
            ], [
                'year_start.required' => 'Дата начала обучения обязательна',
                'year_start.date_format' => 'Неверный формат даты начала (YYYY-MM-DD)',
                'year_end.required' => 'Дата окончания обучения обязательна',
                'year_end.date_format' => 'Неверный формат даты окончания (YYYY-MM-DD)',
                'year_end.after_or_equal' => 'Дата окончания должна быть позже или равна дате начала',
                'specialization_id.required' => 'Специализация обязательна',
                'specialization_id.exists' => 'Указанная специализация не существует',
                'educational_institution.required' => 'Название учебного заведения обязательно',
                'educational_institution.max' => 'Название не должно превышать 255 символов',
                'education_level_id.required' => 'Уровень образования обязателен',
                'education_level_id.exists' => 'Указанный уровень образования не существует',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $worker = Auth::user();

            $education = WorkerEducation::create([
                'year_start' => $request->input('year_start'),
                'year_end' => $request->input('year_end'),
                'specialization_id' => $request->input('specialization_id'),
                'is_not_finished' => $request->input('is_not_finished', false),
                'educational_institution' => $request->input('educational_institution'),
                'education_level_id' => $request->input('education_level_id'),
                'worker_id' => $worker->id,
            ]);

            return $this->successResponse(
                message: 'Образование успешно добавлено',
                data: $education,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при добавлении образования: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'user_id' => Auth::id(),
            ]);

            return $this->errorResponse(
                message: 'Ошибка при добавлении образования',
                error: $e->getMessage(),
            );
        }
    }

    public function workerEducationsAll(): JsonResponse
    {
        try {
            $educations = WorkerEducation::all();

            return $this->successResponse(
                message: 'Список образований успешно получен',
                data: $educations,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка образований: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка образований',
                error: $e->getMessage(),
            );
        }
    }

    public function workerEducationUpdate(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'year_start' => ['nullable', 'date_format:Y-m-d'],
                'year_end' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:year_start'],
                'specialization_id' => ['nullable', 'integer', 'exists:specializations,id'],
                'is_not_finished' => ['nullable', 'boolean'],
                'educational_institution' => ['nullable', 'string', 'max:255'],
                'education_level_id' => ['nullable', 'integer', 'exists:education_levels,id'],
            ], [
                'year_start.date_format' => 'Неверный формат даты начала (YYYY-MM-DD)',
                'year_end.date_format' => 'Неверный формат даты окончания (YYYY-MM-DD)',
                'year_end.after_or_equal' => 'Дата окончания должна быть позже или равна дате начала',
                'specialization_id.exists' => 'Указанная специализация не существует',
                'educational_institution.max' => 'Название не должно превышать 255 символов',
                'education_level_id.exists' => 'Указанный уровень образования не существует',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $education = WorkerEducation::find($id);

            if (!$education) {
                return $this->notFoundResponse();
            }

            // Проверка прав доступа
            if (Auth::id() !== $education->worker_id && !Auth::user()->isAdmin()) {
                return $this->forbiddenResponse();
            }

            $updateData = $request->only([
                'specialization_id',
                'is_not_finished',
                'educational_institution',
                'education_level_id'
            ]);

            // Обработка дат
            if ($request->has('year_start')) {
                $updateData['year_start'] = $request->input('year_start');
            }
            if ($request->has('year_end')) {
                $updateData['year_end'] = $request->input('year_end');
            }

            // Проверка на изменения
            $hasChanges = false;
            foreach ($updateData as $key => $value) {
                if ($education->$key != $value) {
                    $hasChanges = true;
                    break;
                }
            }

            if (!$hasChanges) {
                return $this->successResponse(
                    message: 'Данные не изменились',
                    data: $education,
                );
            }

            $updated = $education->update($updateData);
            if (!$updated) {
                throw new Exception('Не удалось обновить данные об образовании');
            }

            $education->refresh();

            return $this->successResponse(
                message: 'Данные об образовании успешно обновлены',
                data: $education,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении образования: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'education_id' => $id,
                'user_id' => Auth::id(),
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении образования',
                error: $e->getMessage(),
            );
        }
    }

    public function workerEducationDelete(int $id): JsonResponse
    {
        try {
            $education = WorkerEducation::find($id);

            if (!$education) {
                return $this->notFoundResponse();
            }

            // Проверка прав доступа
            if (Auth::id() !== $education->worker_id && !Auth::user()->isAdmin()) {
                return $this->forbiddenResponse();
            }

            $education->delete();

            return $this->successResponse(
                message: 'Данные об образовании успешно удалены',
                data: $education,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении образования: ' . $e->getMessage(), [
                'exception' => $e,
                'education_id' => $id,
                'user_id' => Auth::id(),
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении образования',
                error: $e->getMessage(),
            );
        }
    }
}
