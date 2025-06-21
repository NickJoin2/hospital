<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\WorkerExperience;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class WorkerExperiencesController extends Controller
{
    use ApiResponseMainTrait;

    public function createWorkerExperience(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'date_start' => ['required', 'date_format:Y-m-d'],
                'date_end' => ['required', 'date_format:Y-m-d', 'after_or_equal:date_start'],
                'post' => ['required', 'string', 'max:255'],
                'duties' => ['required', 'string', 'max:1000'],
                'company' => ['required', 'string', 'max:255'],
            ], [
                'date_start.required' => 'Дата начала обязательна для заполнения',
                'date_start.date_format' => 'Неверный формат даты начала (требуется YYYY-MM-DD)',
                'date_end.required' => 'Дата окончания обязательна для заполнения',
                'date_end.date_format' => 'Неверный формат даты окончания (требуется YYYY-MM-DD)',
                'date_end.after_or_equal' => 'Дата окончания должна быть позже или равна дате начала',
                'post.required' => 'Должность обязательна для заполнения',
                'post.max' => 'Должность не должна превышать 255 символов',
                'duties.required' => 'Обязанности обязательны для заполнения',
                'duties.max' => 'Описание обязанностей не должно превышать 1000 символов',
                'company.required' => 'Название компании обязательно для заполнения',
                'company.max' => 'Название компании не должно превышать 255 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $worker = Auth::user();

            $experience = WorkerExperience::create([
                'date_start' => $request->input('date_start'),
                'date_end' => $request->input('date_end'),
                'post' => $request->input('post'),
                'duties' => $request->input('duties'),
                'company' => $request->input('company'),
                'worker_id' => $worker->id,
            ]);

            return $this->successResponse(
                message: 'Опыт работы успешно добавлен',
                data: $experience,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при добавлении опыта работы: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'user_id' => Auth::id(),
            ]);

            return $this->errorResponse(
                message: 'Ошибка при добавлении опыта работы',
                error: $e->getMessage(),
            );
        }
    }

    public function workerExperiencesAll(): JsonResponse
    {
        try {
            $experiences = WorkerExperience::all();

            return $this->successResponse(
                message: 'Список опыта работы успешно получен',
                data: $experiences,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка опыта работы: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка опыта работы',
                error: $e->getMessage(),
            );
        }
    }

    public function workerExperienceUpdate(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'date_start' => ['nullable', 'date_format:Y-m-d'],
                'date_end' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:date_start'],
                'post' => ['nullable', 'string', 'max:255'],
                'duties' => ['nullable', 'string', 'max:1000'],
                'company' => ['nullable', 'string', 'max:255'],
            ], [
                'date_start.date_format' => 'Неверный формат даты начала (требуется YYYY-MM-DD)',
                'date_end.date_format' => 'Неверный формат даты окончания (требуется YYYY-MM-DD)',
                'date_end.after_or_equal' => 'Дата окончания должна быть позже или равна дате начала',
                'post.max' => 'Должность не должна превышать 255 символов',
                'duties.max' => 'Описание обязанностей не должно превышать 1000 символов',
                'company.max' => 'Название компании не должно превышать 255 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $experience = WorkerExperience::find($id);

            if (!$experience) {
                return $this->notFoundResponse();
            }

            // Проверка прав доступа (только владелец или админ может редактировать)
            if (Auth::id() !== $experience->worker_id && !Auth::user()->isAdmin()) {
                return $this->forbiddenResponse();
            }

            $updateData = $request->only(['post', 'duties', 'company']);

            // Обработка дат
            if ($request->has('date_start')) {
                $updateData['date_start'] = $request->input('date_start');
            }
            if ($request->has('date_end')) {
                $updateData['date_end'] = $request->input('date_end');
            }

            // Проверка на изменения
            $hasChanges = false;
            foreach ($updateData as $key => $value) {
                if ($experience->$key != $value) {
                    $hasChanges = true;
                    break;
                }
            }

            if (!$hasChanges) {
                return $this->successResponse(
                    message: 'Данные не изменились',
                    data: $experience,
                );
            }

            $updated = $experience->update($updateData);
            if (!$updated) {
                throw new Exception('Не удалось обновить опыт работы');
            }

            $experience->refresh();

            return $this->successResponse(
                message: 'Опыт работы успешно обновлен',
                data: $experience,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении опыта работы: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'experience_id' => $id,
                'user_id' => Auth::id(),
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении опыта работы',
                error: $e->getMessage(),
            );
        }
    }

    public function workerExperienceDelete(int $id): JsonResponse
    {
        try {
            $experience = WorkerExperience::find($id);

            if (!$experience) {
                return $this->notFoundResponse();
            }

            // Проверка прав доступа (только владелец или админ может удалять)
            if (Auth::id() !== $experience->worker_id && !Auth::user()->isAdmin()) {
                return $this->forbiddenResponse();
            }

            $experience->delete();

            return $this->successResponse(
                message: 'Опыт работы успешно удален',
                data: $experience,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении опыта работы: ' . $e->getMessage(), [
                'exception' => $e,
                'experience_id' => $id,
                'user_id' => Auth::id(),
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении опыта работы',
                error: $e->getMessage(),
            );
        }
    }
}
