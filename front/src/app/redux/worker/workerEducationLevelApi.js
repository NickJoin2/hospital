import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { serverPath } from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

// Создание API для работы с уровнями образования работников
export const workerEducationLevelsApi = createApi({
    reducerPath: "workerEducationLevelsApi",
    tagTypes: ["WorkerEducationLevels"],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getWorkerEducationLevels: build.query({
            query: () => "education-level", // Убедитесь, что эндпоинт правильный
            providesTags: (result) =>
                Array.isArray(result) && result.length > 0
                    ? [
                        ...result.map(({ id }) => ({ type: "WorkerEducationLevels", id })),
                        { type: "WorkerEducationLevels", id: "LIST" },
                    ]
                    : [{ type: "WorkerEducationLevels", id: "LIST" }],
        }),

        // Добавление нового уровня образования
        addWorkerEducationLevel: build.mutation({
            query: (body) => ({
                url: "education-level",
                method: "POST",
                body,
            }),
            invalidatesTags: ["WorkerEducationLevels"], // Инвалидируем все теги для актуализации списка
        }),

        // Получение конкретного уровня образования по ID
        getWorkerEducationLevel: build.query({
            query: (id) => `education-level/${id}`,
            providesTags: (result, id) => [{ type: "WorkerEducationLevels", id }],
        }),

        // Удаление уровня образования по ID
        deleteWorkerEducationLevel: build.mutation({
            query: (id) => ({
                url: `education-level/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["WorkerEducationLevels"], // Инвалидируем все теги для актуализации списка
        }),

        // Обновление уровня образования по ID
        updateWorkerEducationLevel: build.mutation({
            query: ({ id, body }) => ({
                url: `education-level/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: "WorkerEducationLevels", id }],
        }),
    }),
});

// Экспорт хуков для использования в компонентах
export const {
    useGetWorkerEducationLevelsQuery,
    useAddWorkerEducationLevelMutation,
    useGetWorkerEducationLevelQuery,
    useDeleteWorkerEducationLevelMutation,
    useUpdateWorkerEducationLevelMutation,
} = workerEducationLevelsApi;
