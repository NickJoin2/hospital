<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Http\Traits\ApiResponseMainTrait;
use App\Models\RefreshToken;
use App\Models\User;

use Symfony\Component\HttpFoundation\Response;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    use ApiResponseMainTrait;


    public function newUser(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'first_name' => ['required', 'string', 'max:100'],
                'middle_name' => ['required', 'string', 'max:100'],
                'last_name' => ['required', 'string', 'max:100'],
                'email' => ['required', 'email', 'unique:users,email'],
                'phone' => ['required', 'string', 'regex:/^\+?[0-9\s\-\(\)]{7,20}$/'],
                'department_id' => ['required', 'integer', 'exists:departments,id'],
                'role_id' => ['required', 'integer', 'exists:roles,id'],
            ], [
                'first_name.required' => 'Поле "Имя" обязательно для заполнения',
                'first_name.string' => 'Поле "Имя" должно быть строкой',
                'first_name.max' => 'Поле "Имя" не должно превышать 100 символов',

                'middle_name.required' => 'Поле "Отчество" обязательно для заполнения',
                'middle_name.string' => 'Поле "Отчество" должно быть строкой',
                'middle_name.max' => 'Поле "Отчество" не должно превышать 100 символов',

                'last_name.required' => 'Поле "Фамилия" обязательно для заполнения',
                'last_name.string' => 'Поле "Фамилия" должно быть строкой',
                'last_name.max' => 'Поле "Фамилия" не должно превышать 100 символов',

                'email.required' => 'Поле "Email" обязательно для заполнения',
                'email.email' => 'Введите корректный email адрес',
                'email.unique' => 'Пользователь с таким email уже существует',

                'phone.required' => 'Поле "Телефон" обязательно для заполнения',
                'phone.string' => 'Поле "Телефон" должно быть строкой',
                'phone.regex' => 'Введите корректный номер телефона',

                'department_id.required' => 'Поле "Отдел" обязательно для заполнения',
                'department_id.integer' => 'Неверный формат отдела',
                'department_id.exists' => 'Указанный отдел не существует',

                'role_id.required' => 'Поле "Роль" обязательно для заполнения',
                'role_id.integer' => 'Неверный формат роли',
                'role_id.exists' => 'Указанная роль не существует',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse(
                    errors: $validator->errors(),
                );
            }

            $creditedAt = now()->timezone('Europe/Moscow');

            $user = User::create([
                'first_name' => $request->input('first_name'),
                'middle_name' => $request->input('middle_name'),
                'last_name' => $request->input('last_name'),
                'email' => $request->input('email'),
                'phone' => $request->input('phone'),
                'department_id' => $request->input('department_id'),
                'role_id' => $request->input('role_id'),
                'credited_at' => $creditedAt,
            ]);

            $user->load(['department', 'role']);

            return $this->successResponse(
                message: 'Пользователь успешно создан',
                data: new UserResource($user),
                statusCode: 201
            );
        } catch (Exception $e) {
            Log::error('Неожиданная ошибка при создании пользователя', [
                'exception' => $e,
                'request_data' => $request->all(),
            ]);

            return $this->errorResponse(
                message: 'Внутренняя ошибка сервера при создании пользователя',
                error: 'Server error',
                statusCode: 500
            );
        }
    }

    public function resetPassword(Request $request)
    {
        // Валидация входящих данных (включая старый и новый пароль)
        $validator = Validator::make($request->all(), [
            'oldPassword' => ['required', 'string'],
            'newPassword' => ['required', 'string', 'min:6'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Неверные данные',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user = Auth::user('api');

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Пользователь не найден'
            ], Response::HTTP_NOT_FOUND);
        }

        // Проверяем, совпадает ли введённый старый пароль с хэшем в БД
        if (!Hash::check($request->oldPassword, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Текущий пароль указан неверно'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Обновляем пароль
        $user->password = Hash::make($request->newPassword);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Пароль успешно изменён'
        ]);
    }

    public function checkEmailVerificationStatusByEmail(Request $request)
    {
        $email = $request->input('email');

        if (!$email) {
            return response()->json(['message' => 'Email is required'], 400);
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json([
            'message' => $user->hasVerifiedEmail() ? 'Email is verified' : 'Email is not verified',
            'verified' => $user->hasVerifiedEmail()
        ]);
    }

    public function login(Request $request)
    {
        // Валидация данных
        $validator = Validator::make($request->all(), [
            'verify' => ['required'],
            'password' => ['required', 'string', 'min:6'],
        ], [
            'required' => 'Поле :attribute обязательно к заполнению',
            'string' => 'Поле :attribute должно быть строкой',
            'min' => 'Поле :attribute должно быть не менее :min символов'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Неверные данные',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Поиск пользователя по email или телефону
        $user = User::with(['role', 'department'])
            ->where('email', $request->verify)
            ->orWhere('phone', $request->verify)
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Неверные учетные данные',
                'errors' => [
                    'verify' => ['Пользователь не найден']
                ]
            ], Response::HTTP_UNAUTHORIZED);
        }

        if (!$user->hasVerifiedEmail()) {
            $user->sendEmailVerificationNotification();
            return response()->json([
                'success' => false,
                'message' => 'Подтвердите свой email чтобы продолжить',
                'errors' => [
                    'verify' => ['Email не подтверждён']
                ]
            ], Response::HTTP_FORBIDDEN);
        }

        if (!$user->password) {
            return $this->setUserPassword($user, $request->password);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Неверный пароль',
                'errors' => [
                    'password' => ['Неверный пароль']
                ]
            ], Response::HTTP_UNAUTHORIZED);
        }

        return $this->generateUserTokens($user);
    }

    protected function setUserPassword(User $user, string $password)
    {
        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'Подтвердите свой email перед установкой пароля'
            ], Response::HTTP_FORBIDDEN);
        }

        $user->password = Hash::make($password);
        $user->save();

        return $this->generateUserTokens($user);
    }

    protected function generateUserTokens(User $user)
    {
        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'Email не подтвержден'
            ], Response::HTTP_FORBIDDEN);
        }

        try {
            $userData = [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role->role_name,
                'department' => $user->department->department_name,
            ];

            $accessToken = auth('api')->claims([
                ...$userData,
                'token_type' => 'access',
            ])->setTTL(config('jwt.ttl'))->login($user);

            $refreshJti = (string)\Illuminate\Support\Str::uuid();
            $refreshToken = auth('api')->claims([
                'token_type' => 'refresh',
                'user_id' => $user->id,
                'jti' => $refreshJti
            ])->setTTL(config('jwt.refresh_ttl'))->login($user);

            $tokenFingerprint = hash('sha256', $refreshToken);

            $user->refreshTokens()->create([
                'token' => $tokenFingerprint,
                'expires_at' => now()->addMinutes(config('jwt.refresh_ttl')), // минутный TTL!
                'jti' => $refreshJti
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Успешный вход',
                'data' => [
                    'user' => $userData,
                    'access_token' => $accessToken,
                    'refresh_token' => $refreshToken,
                    'token_type' => 'bearer',
                    'expires_in' => auth('api')->factory()->getTTL() * 60
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Token generation error', ['user_id' => $user->id, 'error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Ошибка при создании токена',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->input('refresh_token') ?? $request->query('refresh_token');

        if (!$refreshToken) {
            return response()->json(['message' => 'Refresh token is required'], 400);
        }

        try {
            $payload = \Tymon\JWTAuth\Facades\JWTAuth::setToken($refreshToken)->getPayload();

            if ($payload->get('token_type') !== 'refresh') {
                return response()->json(['message' => 'Invalid token type'], 401);
            }

            $jti = $payload->get('jti');
            $userId = $payload->get('user_id');

            if (!$jti || !$userId) {
                return response()->json(['message' => 'Missing token claims'], 401);
            }

            $fingerprint = hash('sha256', $refreshToken);

            $storedToken = \App\Models\RefreshToken::with('user')
                ->where('token', $fingerprint)
                ->where('jti', $jti)
                ->where('expires_at', '>', now())
                ->first();

            if (!$storedToken || !$storedToken->user || $storedToken->user->id != $userId) {
                return response()->json(['message' => 'Invalid refresh token'], 401);
            }

            $storedToken->delete();

            return $this->generateUserTokens($storedToken->user);

        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['message' => 'Invalid token structure'], 401);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token processing error',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function logout()
    {
        try {

            $user = auth('api')->user();


            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Пользователь не аутентифицирован'
                ], 401);
            }
            auth('api')->logout();

            $user->refreshTokens()->delete();

            return response()->json(['message' => 'Successfully logged out']);
        } catch (JWTException $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Sorry, the user cannot be logged out'
            ], 500);
        }
    }

}
