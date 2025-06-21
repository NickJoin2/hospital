<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\Schedules;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class SchedulesController extends Controller
{
    use ApiResponseMainTrait;

    public function createSchedule(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'start_time_at' => ['required', 'date_format:H:i'],
                'end_time_at' => ['required', 'date_format:H:i', 'after:start_time_at'],
                'day_id' => ['required', 'integer', 'exists:days,id'],
                'doctor_id' => ['required', 'integer', 'exists:users,id'],
                'room' => ['required', 'integer'],
            ], [
                'start_time_at.required' => 'Время начала обязательно',
                'start_time_at.date_format' => 'Неверный формат времени начала',
                'end_time_at.required' => 'Время окончания обязательно',
                'end_time_at.date_format' => 'Неверный формат времени окончания',
                'end_time_at.after' => 'Время окончания должно быть после времени начала',
                'day_id.required' => 'День недели обязателен',
                'day_id.exists' => 'День недели не найден',
                'doctor_id.required' => 'Врач обязателен',
                'doctor_id.exists' => 'Врач не найден',
                'room.required' => 'Кабинет обязателен',
                'room.integer' => 'Номер кабинета должен быть числом',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $startTime = Carbon::createFromFormat('H:i', $request->input('start_time_at'));
            $endTime = Carbon::createFromFormat('H:i', $request->input('end_time_at'));

            if ($endTime->diffInHours($startTime) > 8) {
                return $this->validationErrorResponse(
                    errors: ['end_time_at' => ['Рабочее время не может превышать 8 часов']],

                );
            }

            $existingSchedule = Schedules::where('doctor_id', $request->doctor_id)
                ->where('day_id', $request->day_id)
                ->exists();

            if ($existingSchedule) {
                return $this->validationErrorResponse(
                    errors: ['day_id' => ['У врача уже есть расписание на этот день']],
                );
            }

            $schedule = Schedules::create([
                'start_time_at' => $request->start_time_at,
                'end_time_at' => $request->end_time_at,
                'day_id' => $request->day_id,
                'doctor_id' => $request->doctor_id,
                'room' => $request->room,
            ]);

            return $this->successResponse(
                message: 'Расписание успешно создано',
                data: $schedule->load(['day', 'doctor']),
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании расписания: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании расписания',
                error: $e->getMessage(),
            );
        }
    }

    public function schedulesAll(): JsonResponse
    {
        try {
            $schedules = Schedules::with(['day', 'doctor'])
                ->orderBy(
                    User::select('middle_name')
                        ->whereColumn('users.id', 'schedules.doctor_id'),
                    'asc'
                )
                ->get();

            return $this->successResponse(
                message: 'Список расписаний получен',
                data: $schedules,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка расписаний: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка расписаний',
                error: $e->getMessage(),
            );
        }
    }

    public function scheduleProfile(): JsonResponse
    {
        try {
            $auth = Auth::user();

            $profileSchedule = Schedules::where('doctor_id', $auth->id)
                ->with(['day', 'doctor'])
                ->get();

            return $this->successResponse(
                message: 'Расписание врача получено',
                data: $profileSchedule,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении расписания врача: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении расписания врача',
                error: $e->getMessage(),
            );
        }
    }

    public function scheduleUpdate(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'start_time_at' => ['nullable', 'date_format:H:i'],
                'end_time_at' => ['nullable', 'date_format:H:i', 'after:start_time_at'],
                'day_id' => ['nullable', 'integer', 'exists:days,id'],
                'doctor_id' => ['nullable', 'integer', 'exists:users,id'],
                'room' => ['nullable', 'integer'],
            ], [
                'end_time_at.after' => 'Время окончания должно быть после времени начала',
                'day_id.exists' => 'День недели не найден',
                'doctor_id.exists' => 'Врач не найден',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $schedule = Schedules::find($id);

            if (!$schedule) {
                return $this->notFoundResponse();
            }

            $updateData = $request->only([
                'start_time_at',
                'end_time_at',
                'day_id',
                'doctor_id',
                'room'
            ]);

            if (empty(array_filter($updateData))) {
                return $this->successResponse(
                    message: 'Данные расписания не изменились',
                    data: $schedule,
                );
            }

            if ($request->has('start_time_at') && $request->has('end_time_at')) {
                $startTime = Carbon::createFromFormat('H:i', $request->start_time_at);
                $endTime = Carbon::createFromFormat('H:i', $request->end_time_at);

                if ($endTime->diffInHours($startTime) > 8) {
                    return $this->validationErrorResponse(
                        errors: ['end_time_at' => ['Рабочее время не может превышать 8 часов']],
                    );
                }
            }

            $updated = $schedule->update($updateData);

            if (!$updated) {
                throw new Exception('Не удалось обновить расписание');
            }

            $schedule->refresh();

            return $this->successResponse(
                message: 'Расписание успешно обновлено',
                data: $schedule->load(['day', 'doctor']),
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении расписания: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении расписания',
                error: $e->getMessage(),
            );
        }
    }

    public function scheduleDelete(int $id): JsonResponse
    {
        try {
            $schedule = Schedules::findOrFail($id);

            $schedule->delete();

            return $this->successResponse(
                message: 'Расписание успешно удалено',
                data: $schedule,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении расписания: ' . $e->getMessage(), [
                'exception' => $e,
                'id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении расписания',
                error: $e->getMessage(),
            );
        }
    }
}
