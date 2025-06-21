import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";

export const drugStorageApi = createApi({
    reducerPath: 'drugStorageApi',
    tagTypes: ['DrugStorage'],
    baseQuery: fetchBaseQuery({ baseUrl: serverPath,
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
    }),
    endpoints: (build) => ({
        getDrugsStorage: build.query({
            query: () => 'drug-storage',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'DrugStorage', id })),
                        { type: 'DrugStorage', id: 'LIST' },
                    ]
                    : [{ type: 'DrugStorage', id: 'LIST' }],
        }),
        addDrugStorage: build.mutation({
            query: (body) => ({
                url: 'drug-storage',
                method: 'POST',
                body,
                credentials: 'include',
            }),
            invalidatesTags: ['DrugStorage'],
        }),
        getDrugStorage: build.query({
            query: (id) => `drug-storage/${id}`,
            providesTags: (result, id) => [{ type: 'DrugStorage', id }],
        }),
        deleteDrugStorage: build.mutation({
            query: (id) => ({
                url: `drug-storage/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['DrugStorage'],
        }),
        updateDrugStorage: build.mutation({
            query: ({ id, body }) => ({
                url: `drug-storage/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'DrugStorage', id }],
        }),
    }),
});

export const { useGetDrugsStorageQuery, useAddDrugStorageMutation, useGetDrugStorageQuery, useDeleteDrugStorageMutation, useUpdateDrugStorageMutation } = drugStorageApi