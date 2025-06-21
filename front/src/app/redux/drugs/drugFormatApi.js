import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";

export const drugFormatApi = createApi({
    reducerPath: 'drugFormatApi',
    tagTypes: ['DrugFormat'],
    baseQuery: fetchBaseQuery({ baseUrl: serverPath,
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
    }),
    endpoints: (build) => ({
        getDrugsFormat: build.query({
            query: () => 'drug-format',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'DrugFormat', id })),
                        { type: 'DrugFormat', id: 'LIST' },
                    ]
                    : [{ type: 'DrugFormat', id: 'LIST' }],
        }),
        addDrugFormat: build.mutation({
            query: (body) => ({
                url: 'drug-format',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['DrugFormat'],
        }),
        getDrugFormat: build.query({
            query: (id) => `drug-format/${id}`,
            providesTags: (result, id) => [{ type: 'DrugFormat', id }],
        }),
        deleteDrugFormat: build.mutation({
            query: (id) => ({
                url: `drug-format/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['DrugFormat'],
        }),
        updateDrugFormat: build.mutation({
            query: ({ id, body }) => ({
                url: `drug-format/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'DrugFormat', id }],
        }),
    }),
});

export const { useGetDrugsFormatQuery, useAddDrugFormatMutation, useGetDrugFormatQuery, useDeleteDrugFormatMutation, useUpdateDrugFormatMutation } = drugFormatApi