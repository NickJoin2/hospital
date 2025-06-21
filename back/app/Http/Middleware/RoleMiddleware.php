<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role): Response
    {
        $user = auth('api')->user();

        if (!$user) {
            Log::warning('Unauthenticated role check attempt', [
                'required_role' => $role,
                'route' => $request->route()?->getName(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Требуется авторизация'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Check role directly instead of using hasRole()
        if (!$user->role || $user->role->role_name !== $role) {
            Log::warning('Forbidden role check attempt', [
                'user_id' => $user->id,
                'user_role' => $user->role ? $user->role->role_name : 'none',
                'required_role' => $role,
                'route' => $request->route()?->getName(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Доступ запрещен. Недостаточно прав.'
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
