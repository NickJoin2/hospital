<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckEmailVerified
{

    public function handle(Request $request, Closure $next)
    {
        // Проверяем, авторизован ли пользователь и подтверждена ли почта
        if (Auth::check() && !Auth::user()->hasVerifiedEmail()) {
            // Если почта не подтверждена, отправляем сообщение
            return redirect()->route('verification.notice')->with('error', 'Пожалуйста, подтвердите свой email для продолжения.');
        }

        // Если почта подтверждена, пропускаем запрос дальше
        return $next($request);
    }
}
