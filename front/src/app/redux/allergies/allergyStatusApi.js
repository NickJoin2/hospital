import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";

export const allergyStatusApi = createApi({
    reducerPath: 'AllergyStatusApi',
    tagTypes: ['AllergyStatus'],
    baseQuery: fetchBaseQuery({ baseUrl: serverPath,
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
    }),
    endpoints: (build) => ({
        getAllergiesStatus: build.query({
            query: () => 'allergy-status',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'AllergyStatus', id })),
                        { type: 'AllergyStatus', id: 'LIST' },
                    ]
                    : [{ type: 'AllergyStatus', id: 'LIST' }],
        }),
        addAllergyStatus: build.mutation({
            query: (body) => ({
                url: 'allergy-status',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AllergyStatus'],
        }),
        getAllergyStatus: build.query({
            query: (id) => `allergy-status/${id}`,
            providesTags: (result, id) => [{ type: 'AllergyStatus', id }],
        }),
        deleteAllergyStatus: build.mutation({
            query: (id) => ({
                url: `allergy-status/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AllergyStatus'],
        }),
        updateAllergyStatus: build.mutation({
            query: ({ id, body }) => ({
                url: `allergy-status/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'AllergyStatus', id }],
        }),
    }),
});

export const { useGetAllergiesStatusQuery, useAddAllergyStatusMutation, useGetAllergyStatusQuery, useDeleteAllergyStatusMutation, useUpdateAllergyStatusMutation } = allergyStatusApi