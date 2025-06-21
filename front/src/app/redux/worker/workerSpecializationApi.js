import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { serverPath } from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

// Создание API для работы с данными о специализациях работников
export const workerSpecializationApi = createApi({
    reducerPath: "workerSpecializationApi",
    tagTypes: ["WorkerSpecialization"],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getWorkerSpecializations: build.query({
            query: () => "specializations", // Убедитесь, что эндпоинт правильный
            providesTags: (result) =>
                Array.isArray(result) && result.length > 0
                    ? [
                        ...result.map(({ id }) => ({ type: "WorkerSpecialization", id })),
                        { type: "WorkerSpecialization", id: "LIST" },
                    ]
                    : [{ type: "WorkerSpecialization", id: "LIST" }],
        }),

        // Добавление новой специализации
        addWorkerSpecialization: build.mutation({
            query: (body) => ({
                url: "specializations",
                method: "POST",
                body,
            }),
            invalidatesTags: ["WorkerSpecialization"], // Инвалидируем все теги для актуализации списка
        }),

        // Получение информации о конкретной специализации по ID
        getWorkerSpecialization: build.query({
            query: (id) => `worker-experiences/${id}`,
            providesTags: (result, id) => [{ type: "WorkerSpecialization", id }],
        }),

        // Удаление специализации по ID
        deleteWorkerSpecialization: build.mutation({
            query: (id) => ({
                url: `specializations/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["WorkerSpecialization"], // Инвалидируем теги для актуализации списка
        }),

        // Обновление специализации по ID
        updateWorkerSpecialization: build.mutation({
            query: ({ id, body }) => ({
                url: `specializations/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: "WorkerSpecialization", id }],
        }),
    }),
});

// Экспорт хуков для использования в компонентах
export const {
    useGetWorkerSpecializationsQuery,
    useAddWorkerSpecializationMutation,
    useGetWorkerSpecializationQuery,
    useDeleteWorkerSpecializationMutation,
    useUpdateWorkerSpecializationMutation,
} = workerSpecializationApi;
