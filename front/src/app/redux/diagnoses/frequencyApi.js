import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const frequencyApi = createApi({
    reducerPath: 'frequencyApi',
    tagTypes: ['Frequency'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getFrequencies: build.query({
            query: () => `frequency`,
            providesTags: (result) =>
                result && Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Frequency', id })),
                        { type: 'Frequency', id: 'LIST' },
                    ]
                    : [{ type: 'Frequency', id: 'LIST' }],
        }),
        addFrequency: build.mutation({
            query: (body) => ({
                url: `frequency`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Frequency'],
        }),
        deleteFrequency: build.mutation({
            query: (id) => ({
                url: `frequency/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Frequency'],
        }),
        updateFrequency: build.mutation({
            query: ({ id, body }) => ({
                url: `frequency/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'Frequency', id }],
        }),
    }),
});

export const { useGetFrequenciesQuery, useAddFrequencyMutation, useGetFrequencyQuery, useDeleteFrequencyMutation, useUpdateFrequencyMutation } = frequencyApi