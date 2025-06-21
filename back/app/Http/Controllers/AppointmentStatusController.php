<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\Appointment;
use App\Models\AppointmentStatus;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class AppointmentStatusController extends Controller
{
    use ApiResponseMainTrait;

    public function createAppointmentStatus(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'appointment_status_name' => ['required', 'string', 'max:255', 'unique:appointment_statuses,appointment_status_name'],
                'appointment_status_description' => ['nullable', 'string', 'max:500'],
            ], [
                'appointment_status_name.required' => 'Название статуса приема обязательно для заполнения',
                'appointment_status_name.string' => 'Название должно быть строкой',
                'appointment_status_name.max' => 'Название не должно превышать 255 символов',
                'appointment_status_name.unique' => 'Статус приема с таким названием уже существует',
                'appointment_status_description.string' => 'Описание должно быть строкой',
                'appointment_status_description.max' => 'Описание не должно превышать 500 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $appointmentStatus = AppointmentStatus::create([
                'appointment_status_name' => $request->input('appointment_status_name'),
                'appointment_status_description' => $request->input('appointment_status_description'),
            ]);

            return $this->successResponse(
                message: 'Статус приема успешно создан',
                data: $appointmentStatus,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании статуса приема: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании статуса приема',
                error: $e->getMessage(),
            );
        }
    }

    public function appointmentStatusesAll(): JsonResponse
    {
        try {
            $statuses = AppointmentStatus::all();

            return $this->successResponse(
                message: 'Список статусов приема успешно получен',
                data: $statuses,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка статусов приема: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка статусов приема',
                error: $e->getMessage(),
            );
        }
    }

    public function updateAppointmentStatus(Request $request, int $id): JsonResponse
    {
        try {
            // Валидация входных данных
            $validator = Validator::make($request->all(), [
                'status_id' => [
                    'required',
                    'integer',
                    Rule::exists('appointment_statuses', 'id'),
                ],
            ], [
                'status_id.required' => 'ID статуса обязательно',
                'status_id.integer' => 'ID статуса должно быть числом',
                'status_id.exists' => 'Выбранный статус не существует',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(errors: $validator->errors());
            }

            // Ищем запись на прием
            $appointment = Appointment::find($id);

            if (!$appointment) {
                return $this->notFoundResponse(message: 'Запись на прием не найдена');
            }

            // Проверяем, изменился ли статус
            if ($appointment->status_id === $request->status_id) {
                return $this->successResponse(
                    message: 'Статус не изменился',
                    data: $appointment->load('status')
                );
            }

            // Обновляем статус
            $appointment->status_id = $request->status_id;
            $updated = $appointment->save();

            if (!$updated) {
                throw new Exception('Не удалось обновить статус записи');
            }

            // Возвращаем обновленную запись с загруженным статусом
            return $this->successResponse(
                message: 'Статус успешно изменён',
                data: $appointment->fresh()->load('status')
            );

        } catch (Exception $e) {
            Log::error('Ошибка при изменении статуса записи: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'appointment_id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при изменении статуса записи',
                error: $e->getMessage()
            );
        }
    }

    public function appointmentStatusDelete(int $id): JsonResponse
    {
        try {
            $status = AppointmentStatus::find($id);

            if (!$status) {
                return $this->notFoundResponse();
            }

            $status->delete();

            return $this->successResponse(
                message: 'Статус приема успешно удален',
                data: $status,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении статуса приема: ' . $e->getMessage(), [
                'exception' => $e,
                'status_id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении статуса приема',
                error: $e->getMessage(),
            );
        }
    }
}
