<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\Frequency;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class FrequencyController extends Controller
{
    use ApiResponseMainTrait;

    public function createFrequency(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'frequencies_name' => ['required', 'string', 'max:255', 'unique:frequencies,frequencies_name'],
                'frequency_description' => ['nullable', 'string', 'max:1000'],
            ], [
                'frequencies_name.required' => 'Название частоты обязательно',
                'frequencies_name.unique' => 'Частота с таким названием уже существует',
                'frequencies_name.max' => 'Название не должно превышать 255 символов',
                'frequency_description.max' => 'Описание не должно превышать 1000 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $frequency = Frequency::create([
                'frequencies_name' => $request->input('frequencies_name'),
                'frequency_description' => $request->input('frequency_description'),
            ]);

            return $this->successResponse(
                message: 'Частота успешно создана',
                data: $frequency,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании частоты: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании частоты',
                error: $e->getMessage(),
            );
        }
    }

    public function frequenciesAll(): JsonResponse
    {
        try {
            $frequencies = Frequency::all();

            return $this->successResponse(
                message: 'Список частот получен',
                data: $frequencies,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка частот: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка частот',
                error: $e->getMessage(),
            );
        }
    }

    public function frequencyUpdate(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'frequencies_name' => ['nullable', 'string', 'max:255', Rule::unique('frequencies')->ignore($id)],
                'frequency_description' => ['nullable', 'string', 'max:1000'],
            ], [
                'frequencies_name.unique' => 'Частота с таким названием уже существует',
                'frequencies_name.max' => 'Название не должно превышать 255 символов',
                'frequency_description.max' => 'Описание не должно превышать 1000 символов',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $frequency = Frequency::find($id);

            if (!$frequency) {
                return $this->notFoundResponse();
            }

            $updateData = $request->only(['frequencies_name', 'frequency_description']);

            if (empty(array_filter($updateData))) {
                return $this->successResponse(
                    message: 'Данные частоты не изменились',
                    data: $frequency,
                );
            }

            $updated = $frequency->update($updateData);

            if (!$updated) {
                throw new Exception('Не удалось обновить частоту');
            }

            $frequency->refresh();

            return $this->successResponse(
                message: 'Частота успешно обновлена',
                data: $frequency,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении частоты: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении частоты',
                error: $e->getMessage(),
            );
        }
    }

    public function frequencyDelete(int $id): JsonResponse
    {
        try {
            $frequency = Frequency::findOrFail($id);

            $frequency->delete();

            return $this->successResponse(
                message: 'Частота успешно удалена',
                data: $frequency,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении частоты: ' . $e->getMessage(), [
                'exception' => $e,
                'id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении частоты',
                error: $e->getMessage(),
            );
        }
    }
}
