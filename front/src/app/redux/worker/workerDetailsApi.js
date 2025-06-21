import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";

export const workerDetailsApi = createApi({
    reducerPath: 'workerDetailsApi',
    tagTypes: ['WorkerDetails'],
    baseQuery: fetchBaseQuery({ baseUrl: serverPath }, {
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }),
    endpoints: (build) => ({
        getWorkerDetails: build.query({
            query: () => 'workers-details',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'WorkerDetails', id })),
                        { type: 'WorkerDetails', id: 'LIST' },
                    ]
                    : [{ type: 'WorkerDetails', id: 'LIST' }],
        }),
        addWorkerDetail: build.mutation({
            query: (body) => ({
                url: 'worker-details',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['WorkerDetails'],
        }),
        getWorkerDetail: build.query({
            query: (id) => `worker-details/${id}`,
            providesTags: (result, id) => [{ type: 'WorkerDetails', id }],
        }),
        deleteWorkerDetail: build.mutation({
            query: (id) => ({
                url: `worker-details/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['WorkerDetails'],
        }),
        updateWorkerDetail: build.mutation({
            query: ({ id, body }) => ({
                url: `worker-details/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'WorkerDetails', id }],
        }),
    }),
});


export const { useGetWorkerDetailsQuery, useAddWorkerDetailMutation, useGetWorkerDetailQuery, useDeleteWorkerDetailMutation, useUpdateWorkerDetailMutation } = workerDetailsApi
