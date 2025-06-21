<?php

namespace App\Http\Controllers;

use App\Http\Traits\ApiResponseMainTrait;
use App\Models\Role;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class RolesController extends Controller
{
    use ApiResponseMainTrait;

    public function createRole(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'role_name' => ['required', 'string', 'max:255', 'unique:roles,role_name']
            ], [
                'role_name.required' => 'Название роли обязательно',
                'role_name.unique' => 'Роль с таким названием уже существует',
                'role_name.max' => 'Название роли не должно превышать 255 символов'
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $role = Role::create([
                'role_name' => $request->input('role_name')
            ]);

            return $this->successResponse(
                message: 'Роль успешно создана',
                data: $role,
                statusCode: Response::HTTP_CREATED
            );

        } catch (Exception $e) {
            Log::error('Ошибка при создании роли: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);
            return $this->errorResponse(
                message: 'Ошибка при создании роли',
                error: $e->getMessage(),
            );
        }
    }

    public function rolesAll(): JsonResponse
    {
        try {
            $roles = Role::all();

            return $this->successResponse(
                message: 'Список ролей получен',
                data: $roles,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при получении списка ролей: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при получении списка ролей',
                error: $e->getMessage(),
            );
        }
    }

    public function roleUpdate(Request $request, int $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'role_name' => ['required', 'string', 'max:255', Rule::unique('roles')->ignore($id)]
            ], [
                'role_name.required' => 'Название роли обязательно',
                'role_name.unique' => 'Роль с таким названием уже существует',
                'role_name.max' => 'Название роли не должно превышать 255 символов'
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $role = Role::find($id);

            if (!$role) {
                return $this->notFoundResponse();
            }

            // Проверяем, изменилось ли название роли
            if ($role->role_name === $request->input('role_name')) {
                return $this->successResponse(
                    message: 'Данные роли не изменились',
                    data: $role,
                );
            }

            $updated = $role->update(['role_name' => $request->input('role_name')]);

            if (!$updated) {
                throw new Exception('Не удалось обновить роль');
            }

            $role->refresh();

            return $this->successResponse(
                message: 'Роль успешно обновлена',
                data: $role,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при обновлении роли: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all(),
                'role_id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при обновлении роли',
                error: $e->getMessage(),
            );
        }
    }

    public function roleDelete(int $id): JsonResponse
    {
        try {
            $role = Role::findOrFail($id);

            if ($role->users()->exists()) {
                return $this->validationErrorResponse(
                    errors: ['role' => ['Невозможно удалить роль, так как она назначена пользователям']],
                );
            }

            $role->delete();

            return $this->successResponse(
                message: 'Роль успешно удалена',
                data: $role,
            );

        } catch (Exception $e) {
            Log::error('Ошибка при удалении роли: ' . $e->getMessage(), [
                'exception' => $e,
                'role_id' => $id,
            ]);

            return $this->errorResponse(
                message: 'Ошибка при удалении роли',
                error: $e->getMessage(),
            );
        }
    }
}
