import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";

export const workerExperiencesApi = createApi({
    reducerPath: 'workerExperiencesApi',
    tagTypes: ['WorkerExperiences'],
    baseQuery: fetchBaseQuery({ baseUrl: serverPath }, {
        headers: {
            'Content-Type': 'application/json'
        }
    }),
    endpoints: (build) => ({
        getWorkerExperiences: build.query({
            query: () => 'worker-experiences',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'WorkerExperiences', id })),
                        { type: 'WorkerExperiences', id: 'LIST' },
                    ]
                    : [{ type: 'WorkerExperiences', id: 'LIST' }],
        }),
        addWorkerExperience: build.mutation({
            query: (body) => ({
                url: 'worker-experiences',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['WorkerExperiences'],
        }),
        getWorkerExperience: build.query({
            query: (id) => `worker-experiences/${id}`,
            providesTags: (result, id) => [{ type: 'WorkerExperiences', id }],
        }),

        updateWorkerExperience: build.mutation({
            query: ({ id, body }) => ({
                url: `worker-experiences/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'WorkerExperiences', id }],
        }),
    }),
});

export const { useGetWorkerExperiencesQuery, useAddWorkerExperienceMutation, useGetWorkerExperienceQuery,  useUpdateWorkerExperienceMutation } = workerExperiencesApi