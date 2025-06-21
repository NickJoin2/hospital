<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class VerificationController extends Controller
{
    public function verify(Request $request, $tokenId, $hash)
    {
        // Найдите токен по ID
        $user = User::findOrFail($tokenId);

        // Получите связанного пользователя

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Проверьте валидность хеша
        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['error' => 'Invalid verification link'], 403);
        }

        // Проверьте, был ли email уже подтвержден
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified'], 200);
        }

        // Подтвердите email
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // Верните успешный ответ
        return response()->json(['message' => 'Email successfully verified'], 200);
    }

    public function resend(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified'], 400);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification email resent']);
    }
}
