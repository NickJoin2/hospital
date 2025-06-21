<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use Illuminate\Validation\Rule;
use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;
use Exception;

class DepartmentController extends Controller
{
    use ApiResponseMainTrait;

    public function createDepartment(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'department_name' => ['required', 'max:255', 'unique:departments,department_name'],
                'department_description' => ['nullable', 'string'],
            ], [
                'department_name.required' => 'Название отдела обязательно для заполнения',
                'department_name.unique' => 'Отдел с таким названием уже существует',
                'department_name.max' => 'Название отдела не должно превышать 255 символов',
                'department_description.string' => 'Описание должно быть строкой',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $department = Department::create([
                'department_name' => $request->input('department_name'),
                'department_description' => $request->input('department_description'),
            ]);

            return $this->successResponse(
                message: 'Отдел успешно создан',
                data: $department,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании отдела: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании отдела',
                error: $e->getMessage(),
            );
        }
    }

    public function departmentsAll(): JsonResponse
    {
        try {
            $departments = Department::all();

            return $this->successResponse(
                message: 'Список отделов успешно получен',
                data: $departments,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка отделов: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка отделов',
                error: $e->getMessage(),
            );
        }
    }

    public function departmentUpdate(Request $request, int $departmentId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'department_name' => ['nullable', 'string', 'max:255', Rule::unique('departments')->ignore($departmentId)],
                'department_description' => ['nullable', 'string'],
            ], [
                'department_name.string' => 'Название отдела должно быть строкой',
                'department_name.max' => 'Название отдела не должно превышать 255 символов',
                'department_name.unique' => 'Отдел с таким названием уже существует',
                'department_description.string' => 'Описание должно быть строкой',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $department = Department::find($departmentId);

            if (!$department) {
                return $this->notFoundResponse();
            }

            $updateData = $request->only(['department_name', 'department_description']);

            // Проверяем, изменились ли данные
            if ($updateData['department_name'] === $department->department_name &&
                $updateData['department_description'] === $department->department_description) {
                return $this->successResponse(
                    message: 'Данные не изменились',
                    data: $department,
                );
            }

            $updated = $department->update($updateData);
            if (!$updated) {
                throw new Exception('Не удалось обновить отдел');
            }

            $department->refresh();

            return $this->successResponse(
                message: 'Отдел успешно обновлен',
                data: $department,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении отдела: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'department_id' => $departmentId,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении отдела',
                error: $e->getMessage(),
            );
        }
    }

    public function departmentDelete(int $departmentId): JsonResponse
    {
        try {
            $department = Department::find($departmentId);

            if (!$department) {
                return $this->notFoundResponse();
            }

            $department->delete();

            return $this->successResponse(
                message: 'Отдел успешно удален',
                data: $department,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении отдела: ' . $e->getMessage(), [
                'exception' => $e,
                'department_id' => $departmentId,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении отдела',
                error: $e->getMessage(),
            );
        }
    }
}
