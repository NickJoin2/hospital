// src/features/auth/customBaseQuery.js

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// === ЭКСПОРТИРУЕМ baseQuery ===
export const baseQuery = fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api",
    prepareHeaders: (headers, api) => {
        headers.set("Accept", "application/json");

        const token = localStorage.getItem('access_token');

        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }

        return headers;
    },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    console.warn("result", result);
    console.warn("status", result?.error?.status);

    if (result?.error && [401, '401'].includes(result.error.status)) {
        console.warn('❌ Получили 401 — начинаем процесс refresh');

        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
            console.warn('🚫 Нет refresh_token в localStorage');
            return result;
        }

        try {
            console.log('🔄 Отправляем запрос на /refresh...');

            const refreshResult = await baseQuery(
                {
                    url: "/refresh",
                    method: "POST",
                    body: { refresh_token: refreshToken },
                },
                api,
                extraOptions
            );

            console.log('✅ Ответ от /refresh:', refreshResult);

            if (refreshResult?.data?.data) {
                const {
                    access_token,
                    refresh_token
                } = refreshResult.data.data;

                localStorage.setItem("access_token", access_token);
                localStorage.setItem("refresh_token", refresh_token);

                console.log('🔁 Повторяем исходный запрос...');
                result = await baseQuery(args, api, extraOptions); // повторяем запрос
            } else {
                console.error('🚫 Не удалось обновить токены', refreshResult.error);
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
            }
        } catch (error) {
            console.error("🚨 Ошибка при обновлении токена:", error);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        }
    }

    return result;
};