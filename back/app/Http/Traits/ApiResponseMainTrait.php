<?php

namespace App\Http\Traits;

use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

trait ApiResponseMainTrait
{
    /**
     * Успешный ответ
     */
    protected function successResponse(
        string $message,
        mixed $data = null,
        int $statusCode = Response::HTTP_OK
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    /**
     * Ответ с ошибкой 500
     */
    protected function errorResponse(
        string $message,
        mixed $error = null,
        int $statusCode = Response::HTTP_INTERNAL_SERVER_ERROR
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $error,
        ], $statusCode);
    }

    /**
     * Ответ "Не найдено" (404)
     */
    protected function notFoundResponse(string $message = 'Запись не найдена'): JsonResponse
    {
        return $this->errorResponse($message, null, Response::HTTP_NOT_FOUND);
    }

    /**
     * Ответ "Ошибка валидации" (422)
     */
    protected function validationErrorResponse(
        mixed $errors,
        string $message = 'Ошибка валидации'
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}


