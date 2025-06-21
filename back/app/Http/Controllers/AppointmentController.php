<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\Appointment;
use App\Models\AppointmentStatus;
use App\Models\Day;
use App\Models\Schedules;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class AppointmentController extends Controller
{
    use ApiResponseMainTrait;

    public function createAppointment(Request $request): JsonResponse
    {
        try {
            // Получаем дату и время из запроса
            $appointmentDate = $request->input('appointment_date_at');
            $appointmentTime = $request->input('appointment_time_at');

            // Парсим полное время для работы с ним
            $fullDateTime = Carbon::createFromFormat('Y-m-d H:i', "$appointmentDate $appointmentTime");

            // Валидация данных
            $validator = Validator::make($request->all(), [
                'patient_id' => ['required', 'integer', 'exists:patients,id'],
                'doctor_id' => ['required', 'integer', 'exists:users,id'],
                'appointment_date_at' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
                'appointment_time_at' => [
                    'required',
                    'date_format:H:i',
                    function ($attribute, $value, $fail) {
                        $time = strtotime($value);

                        $startOfWorkDay = strtotime('08:00');
                        $endOfWorkDay = strtotime('19:00');

                        if ($time < $startOfWorkDay || $time > $endOfWorkDay) {
                            $fail('Время приема должно быть между 08:00 и 19:00.');
                        }
                    },
                ],
            ], [
                'patient_id.required' => 'ID пациента обязательно',
                'patient_id.exists' => 'Пациент не найден',
                'doctor_id.required' => 'ID врача обязательно',
                'doctor_id.exists' => 'Врач не найден',
                'appointment_date_at.required' => 'Дата приема обязательна',
                'appointment_date_at.after_or_equal' => 'Дата приема не может быть в прошлом',
                'appointment_time_at.required' => 'Время приема обязательно',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(errors: $validator->errors());
            }

            // Проверка: между записями должен быть промежуток минимум 15 минут (до и после)
            $bufferMinutes = 15;
            $apptDateTime = Carbon::createFromFormat('Y-m-d H:i', "$appointmentDate $appointmentTime");
            $timeStart = $apptDateTime->copy()->subMinutes($bufferMinutes);
            $timeEnd = $apptDateTime->copy()->addMinutes($bufferMinutes);

            $conflictingAppointments = Appointment::where('patient_id', $request->patient_id)
                ->whereDate('appointment_date_at', $apptDateTime->toDateString())
                ->whereTime('appointment_time_at', '>=', $timeStart->format('H:i'))
                ->whereTime('appointment_time_at', '<=', $timeEnd->format('H:i'))
                ->exists();

            if ($conflictingAppointments) {
                return $this->validationErrorResponse([
                    'appointment_time_at' => ['Между записями должен быть промежуток не менее 15 минут']
                ]);
            }

            // Проверка: доступно ли это время у врача
            $existingAppointment = Appointment::where([
                ['doctor_id', '=', $request->doctor_id],
                ['appointment_date_at', '=', $appointmentDate],
                ['appointment_time_at', '=', $appointmentTime],
            ])->exists();

            if ($existingAppointment) {
                return $this->validationErrorResponse([
                    'appointment_time_at' => ['Врач уже занят в это время']
                ]);
            }

            // Получаем день недели на русском языке: Понедельник, Вторник и т.д.
            $dayNumber = $fullDateTime->dayOfWeek;

            $daysMap = [
                7 => 'Воскресенье',
                1 => 'Понедельник',
                2 => 'Вторник',
                3 => 'Среда',
                4 => 'Четверг',
                5 => 'Пятница',
                6 => 'Суббота',
            ];

            $dayName = $daysMap[$dayNumber]; // например: "Понедельник"

            // Получаем ID дня недели из таблицы days
            $day = Day::where('day_name', $dayName)->first();

            if (!$day) {
                return $this->validationErrorResponse([
                    'appointment_date_at' => ["День недели {$dayName} не найден"]
                ]);
            }

            // Проверяем график врача
            $schedule = Schedules::where([
                ['doctor_id', '=', $request->doctor_id],
                ['day_id', '=', $day->id],
            ])->first();

            if (!$schedule) {
                return $this->validationErrorResponse([
                    'appointment_date_at' => ["Врач не работает в {$dayName}"]
                ]);
            }

            // Проверка, находится ли время в рабочих часах врача (если они заданы)
            if ($schedule->start_time_at && $schedule->end_time_at) {
                $apptTime = strtotime($appointmentTime);
                $workStart = strtotime($schedule->start_time_at);
                $workEnd = strtotime($schedule->end_time_at);

                if ($apptTime < $workStart || $apptTime > $workEnd) {
                    return $this->validationErrorResponse([
                        'appointment_time_at' => ["Время вне рабочего графика врача ({$schedule->start_time_at} - {$schedule->end_time_at})"]
                    ]);
                }
            }

            // Получение статуса "Запланировано"
            $status = AppointmentStatus::where('appointment_status_name', 'Запланировано')->first();

            if (!$status) {
                return $this->errorResponse(
                    message: 'Невозможно создать прием',
                    error: 'Статус "Запланировано" не найден'
                );
            }

            // Создание записи на прием
            $appointment = Appointment::create([
                'patient_id' => $request->patient_id,
                'doctor_id' => $request->doctor_id,
                'appointment_date_at' => $appointmentDate,
                'appointment_time_at' => $appointmentTime,
                'status_id' => $status->id,
            ]);

            // Загрузка связанных моделей
            $appointment->load(['patient', 'doctor', 'status']);

            return $this->successResponse(
                message: 'Прием успешно создан',
                data: $appointment,
                statusCode: Response::HTTP_CREATED
            );

        } catch (\Exception $e) {
            Log::error('Ошибка при создании приема: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);

            return $this->errorResponse(
                message: 'Ошибка при создании приема',
                error: $e->getMessage()
            );
        }
    }
//    public function createAppointment(Request $request): JsonResponse
//    {
//        try {
//            $validator = Validator::make($request->all(), [
//                'patient_id' => ['required', 'integer', 'exists:patients,id'],
//                'doctor_id' => ['required', 'integer', 'exists:users,id'],
//                'appointment_date_at' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
//                'appointment_time_at' => [
//                    'required',
//                    'date_format:H:i',
//                    function ($attribute, $value, $fail) {
//                        // Преобразуем время в timestamp
//                        $time = strtotime($value);
//
//                        // Определяем начало и конец рабочего дня
//                        $startOfWorkDay = strtotime('08:00');
//                        $endOfWorkDay = strtotime('19:00');
//
//                        if ($time < $startOfWorkDay || $time > $endOfWorkDay) {
//                            $fail('Время приема должно быть между 08:00 и 19:00.');
//                        }
//                    },
//                ],
//            ], [
//                'patient_id.required' => 'ID пациента обязательно',
//                'patient_id.exists' => 'Пациент не найден',
//                'doctor_id.required' => 'ID врача обязательно',
//                'doctor_id.exists' => 'Врач не найден',
//                'appointment_date_at.required' => 'Дата приема обязательна',
//                'appointment_date_at.after_or_equal' => 'Дата приема не может быть в прошлом',
//                'appointment_time_at.required' => 'Время приема обязательно',
//            ]);
//
//            if ($validator->fails()) {
//                return $this->validationErrorResponse(errors: $validator->errors());
//            }
//
//            // Проверка доступности времени у врача
//            $existingAppointment = Appointment::where([
//                ['doctor_id', '=', $request->doctor_id],
//                ['appointment_date_at', '=', $request->appointment_date_at],
//                ['appointment_time_at', '=', $request->appointment_time_at],
//            ])->exists();
//
//            if ($existingAppointment) {
//                return $this->validationErrorResponse([
//                    'appointment_time_at' => ['Врач уже занят в это время']
//                ]);
//            }
//
//            // Получение статуса "Запланировано"
//            $status = AppointmentStatus::where('appointment_status_name', 'Запланировано')->first();
//
//            if (!$status) {
//                return $this->errorResponse(
//                    message: 'Невозможно создать прием',
//                    error: 'Статус "Запланировано" не найден'
//                );
//            }
//
//            // Создание записи на прием
//            $appointment = Appointment::create([
//                'patient_id' => $request->patient_id,
//                'doctor_id' => $request->doctor_id,
//                'appointment_date_at' => $request->appointment_date_at,
//                'appointment_time_at' => $request->appointment_time_at,
//                'status_id' => $status->id,
//            ]);
//
//            // Загрузка связанных моделей
//            $appointment->load(['patient', 'doctor', 'status']);
//
//            return $this->successResponse(
//                message: 'Прием успешно создан',
//                data: $appointment,
//                statusCode: Response::HTTP_CREATED
//            );
//
//        } catch (Exception $e) {
//            Log::error('Ошибка при создании приема: ' . $e->getMessage(), [
//                'exception' => $e,
//                'request_data' => $request->all(),
//            ]);
//
//            return $this->errorResponse(
//                message: 'Ошибка при создании приема',
//                error: $e->getMessage()
//            );
//        }
//    }

    public function appointmentsAll(): JsonResponse
    {
        try {
            $appointments = Appointment::with(['patient', 'doctor', 'status', 'diagnoses'])
                ->where('status_id', 1)
                ->orderBy('appointment_date_at', 'desc')
                ->orderBy('appointment_time_at', 'asc')
                ->get();

            return $this->successResponse(
                message: 'Список запланированных приемов получен',
                data: $appointments,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка приемов: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка приемов',
                error: $e->getMessage(),
            );
        }
    }

    public function appointmentUpdate(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'patient_id' => ['nullable', 'integer', 'exists:patients,id'],
                'doctor_id' => ['nullable', 'integer', 'exists:users,id'],
                'appointment_date_at' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:today'],
                'appointment_time_at' => ['nullable', 'date_format:H:i'],
                'status_id' => ['nullable', 'integer', 'exists:appointment_statuses,id'],
            ], [
                'patient_id.exists' => 'Пациент не найден',
                'doctor_id.exists' => 'Врач не найден',
                'appointment_date_at.after_or_equal' => 'Дата приема не может быть в прошлом',
                'status_id.exists' => 'Статус приема не найден',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $appointment = Appointment::find($id);

            if (!$appointment) {
                return $this->notFoundResponse();
            }

            $updateData = $request->only([
                'patient_id',
                'doctor_id',
                'appointment_time_at',
                'status_id'
            ]);

            if ($request->has('appointment_date_at')) {
                $updateData['appointment_date_at'] = $request->appointment_date_at;
            }

            // Проверка изменений
            if (empty(array_filter($updateData))) {
                return $this->successResponse(
                    message: 'Данные приема не изменились',
                    data: $appointment,
                );
            }

            // Проверка занятости времени врача
            if ($request->has('doctor_id') || $request->has('appointment_date_at') || $request->has('appointment_time_at')) {
                $doctorId = $request->doctor_id ?? $appointment->doctor_id;
                $date = $request->appointment_date_at ?? $appointment->appointment_date_at;
                $time = $request->appointment_time_at ?? $appointment->appointment_time_at;

                $existingAppointment = Appointment::where('doctor_id', $doctorId)
                    ->where('appointment_date_at', $date)
                    ->where('appointment_time_at', $time)
                    ->where('id', '!=', $id)
                    ->exists();

                if ($existingAppointment) {
                    return $this->validationErrorResponse(
                        errors: ['appointment_time_at' => ['Врач уже занят в это время']],
                    );
                }
            }

            $updated = $appointment->update($updateData);

            if (!$updated) {
                throw new Exception('Не удалось обновить прием');
            }

            $appointment->refresh();

            return $this->successResponse(
                message: 'Прием успешно обновлен',
                data: $appointment->load(['patient', 'doctor', 'status']),
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении приема: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении приема',
                error: $e->getMessage(),
            );
        }
    }

    public function appointmentDelete(int $id): JsonResponse
    {
        try {
            $appointment = Appointment::findOrFail($id);

            $appointment->delete();

            return $this->successResponse(
                message: 'Прием успешно удален',
                data: $appointment,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении приема: ' . $e->getMessage(), [
                'exception' => $e,
                'id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении приема',
                error: $e->getMessage(),
            );
        }
    }
}
