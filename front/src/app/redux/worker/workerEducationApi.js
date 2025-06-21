import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";

export const workerEducationsApi = createApi({
    reducerPath: 'workerEducationsApi',
    tagTypes: ['WorkerEducations'],
    baseQuery: fetchBaseQuery({ baseUrl: serverPath }, {
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }),
    endpoints: (build) => ({
        getWorkerEducations: build.query({
            query: () => 'workers-educations',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'WorkerEducations', id })),
                        { type: 'WorkerEducations', id: 'LIST' },
                    ]
                    : [{ type: 'WorkerEducations', id: 'LIST' }],
        }),
        addWorkerEducation: build.mutation({
            query: (body) => ({
                url: 'worker-educations',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['WorkerEducations'],
        }),
        getWorkerEducation: build.query({
            query: (id) => `worker-educations/${id}`,
            providesTags: (result, id) => [{ type: 'WorkerEducations', id }],
        }),

        updateWorkerEducation: build.mutation({
            query: ({ id, body }) => ({
                url: `worker-educations/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'WorkerEducations', id }],
        }),
    }),
});

export const { useGetWorkerEducationsQuery, useAddWorkerEducationMutation, useGetWorkerEducationQuery,  useUpdateWorkerEducationMutation } = workerEducationsApi