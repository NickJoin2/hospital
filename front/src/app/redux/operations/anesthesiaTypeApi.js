import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const anesthesiaTypeApi = createApi({
    reducerPath: 'anesthesiaTypeApi',
    tagTypes: ['AnesthesiaType'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getAnesthesiaTypes: build.query({
            query: () => 'anesthesia-type',
            providesTags: (result) =>
                result && Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'AnesthesiaType', id })),
                        { type: 'AnesthesiaType', id: 'LIST' },
                    ]
                    : [{ type: 'AnesthesiaType', id: 'LIST' }],
        }),
        addAnesthesiaType: build.mutation({
            query: (body) => ({
                url: 'anesthesia-type',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AnesthesiaType'],
        }),
        getAnesthesiaType: build.query({
            query: (id) => `anesthesia-type/${id}`,
            providesTags: (result, id) => [{ type: 'AnesthesiaType', id }],
        }),
        deleteAnesthesiaType: build.mutation({
            query: (id) => ({
                url: `anesthesia-type/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AnesthesiaType'],
        }),
        updateAnesthesiaType: build.mutation({
            query: ({ id, body }) => ({
                url: `anesthesia-type/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'AnesthesiaType', id }],
        }),
    }),
});

export const {useGetAnesthesiaTypesQuery,useAddAnesthesiaTypeMutation, useGetAnesthesiaTypeQuery, useDeleteAnesthesiaTypeMutation, useUpdateAnesthesiaTypeMutation } = anesthesiaTypeApi