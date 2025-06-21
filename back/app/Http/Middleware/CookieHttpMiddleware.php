<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenBlacklistedException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class CookieHttpMiddleware
{

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->cookie('accessToken');

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Токен не предоставлен'
            ], 401);
        }

        try {
            $user = JWTAuth::setToken($token)->authenticate();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Пользователь не найден'
                ], 401);
            }

            $request->merge(['user' => $user]);
            auth('api')->setUser($user);

            return $next($request);

        } catch (TokenExpiredException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Срок действия токена истек'
            ], 401);

        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при проверке токена'
            ], 401);
        }
    }
}
