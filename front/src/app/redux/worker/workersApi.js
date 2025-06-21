// src/features/workers/workersApi.ts
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";


export const workersApi = createApi({
    reducerPath: 'workersApi',
    tagTypes: ['Workers'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getWorkers: build.query({
            query: () => 'workers',
            providesTags: (result) =>
                result && Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Workers', id })),
                        { type: 'Workers', id: 'LIST' },
                    ]
                    : [{ type: 'Workers', id: 'LIST' }],
        }),
        getWorker: build.query({
            query: (id) => `workers/${id}`,
            providesTags: (result, error, id) => [{ type: 'Workers', id }],
        }),
        addPhotoProfile: build.mutation({
            query: (body) => ({
                url: '/worker/avatar',
                method: 'POST',
                body,
                formData: true,
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Workers', id }],
        }),
        deleteWorker: build.mutation({
            query: (id) => ({
                url: `workers/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Workers'],
        }),
        myWorkerProfile: build.query({
            query: () => ({
                url: "/worker-profile",
                method: 'GET',
            }),
            providesTags: ['Workers'],
        }),
        addExperience: build.mutation({
            query: (body) => ({
                url: 'worker-experiences',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Workers', id: 'LIST' }],
        }),
        deleteExperience: build.mutation({
            query: (id) => ({
                url: `worker-experiences/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Workers', id: 'LIST' }],
        }),
        addEducation: build.mutation({
            query: (body) => ({
                url: 'worker-educations',
                method: 'POST',
                body
            }),
            invalidatesTags: [{ type: 'Workers', id: 'LIST' }],
        }),
        deleteEducation: build.mutation({
            query: (id) => ({
                url: `worker-educations/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Workers', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetWorkersQuery,
    useGetWorkerQuery,
    useMyWorkerProfileQuery,
    useAddEducationMutation,
    useAddExperienceMutation,
    useDeleteExperienceMutation,
    useAddPhotoProfileMutation,
    useDeleteEducationMutation
} = workersApi;