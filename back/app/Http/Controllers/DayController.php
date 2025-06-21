<?php

namespace App\Http\Controllers;


use App\Http\Traits\ApiResponseMainTrait;
use App\Models\Day;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class DayController extends Controller
{
    use ApiResponseMainTrait;

    public function createDay(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'day_name' => ['required', 'max:255', 'unique:days,day_name'],
            ], [
                'day_name.required' => 'Поле обязательно для заполнения',
                'day_name.unique' => 'Поле с таким названием уже существует',
                'day_name.max' => 'Поле не должно превышать 255 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $day = Day::create([
                'day_name' => $request->input('day_name'),
            ]);

            return $this->successResponse(
                message: 'Запись успешно создана',
                data: $day,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании дня: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании дня',
                error: $e->getMessage(),
            );
        }
    }


    public function dayUpdate(Request $request, int $dayId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'day_name' => ['required', 'string', Rule::unique('days')->ignore($dayId)
                ]],
                [
                    'day_name.required' => 'Поле обязательно для заполнения',
                    'day_name.unique' => 'Поле с таким названием уже существует',
                ]
            );

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $day = Day::find($dayId);

            if (!$day) {
                return $this->notFoundResponse();
            }

            $newName = $request->input('day_name');

            if ($day->day_name === $newName) {
                return $this->successResponse(
                    message: 'Данные не изменились',
                    data: $day,
                );
            }

            $updated = $day->update(['day_name' => $newName]);
            if (!$updated) {
                throw new Exception('Не удалось обновить день');
            }

            $day->refresh();

            return $this->successResponse(
                message: 'День успешно обновлен',
                data: $day,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении дня: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении дня',
                error: $e->getMessage(),
            );
        }
    }


    public function daysAll()
    {
        try {
            $days = Day::all();

            return $this->successResponse(
                message: 'Дни недели успешно полученны',
                data: $days,
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

    public function dayDelete(int $dayId): JsonResponse
    {
        try {
            $day = Day::findOrFail($dayId);

            if (!$day) {
                return $this->notFoundResponse();
            }

            $day->delete();

            return $this->successResponse(
                message: 'День успешно удален',
                data: $day,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении уровня образования: ' . $e->getMessage(), [
                'exception' => $e,
                'dayId' => $dayId,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при создании дня',
                error: $e->getMessage(),
            );
        }
    }

}
