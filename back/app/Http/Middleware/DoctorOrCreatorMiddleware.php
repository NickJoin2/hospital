<?php

namespace App\Http\Middleware;

use App\Models\Patient;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class DoctorOrCreatorMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth('api')->user();

        if (!$user) {
            Log::warning('Unauthenticated access attempt', [
                'route' => $request->route()?->getName(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Требуется авторизация'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $isChiefDoctor = $user->role && $user->role->role_name === 'главный врач';

        if (!$isChiefDoctor) {
            $id = $request->route('id');


            if ($id) {
                $model = Patient::find($id);

                if (!$model) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Запись не найдена'
                    ], Response::HTTP_NOT_FOUND);
                }

                if ($model->created_id !== $user->id) {
                    Log::warning('Forbidden access attempt', [
                        'user_id' => $user->id,
                        'user_role' => $user->role ? $user->role->role_name : 'none',
                        'required_condition' => 'chief doctor or record creator',
                        'route' => $request->route()?->getName(),
                    ]);

                    return response()->json([
                        'success' => false,
                        'message' => 'Доступ запрещен. Вы не являетесь главным врачом или создателем записи.'
                    ], Response::HTTP_FORBIDDEN);
                }
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Необходим идентификатор записи'
                ], Response::HTTP_BAD_REQUEST);
            }
        }

        return $next($request);
    }
}
