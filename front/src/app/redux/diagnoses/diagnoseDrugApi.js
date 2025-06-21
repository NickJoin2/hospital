import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";

export const diagnoseDrugApi = createApi({
    reducerPath: 'DiagnoseDrugApi',
    tagTypes: ['DiagnoseDrug'],
    baseQuery: fetchBaseQuery({ baseUrl: serverPath,
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
    }),
    endpoints: (build) => ({
        getDiagnoseDrugs: build.query({
            query: () => 'diagnose-drug',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'DiagnoseDrug', id })),
                        { type: 'DiagnoseDrug', id: 'LIST' },
                    ]
                    : [{ type: 'DiagnoseDrug', id: 'LIST' }],
        }),
        addDiagnoseDrug: build.mutation({
            query: (body) => ({
                url: 'diagnose-drug',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['DiagnoseDrug'],
        }),
        getDiagnoseDrug: build.query({
            query: (id) => `diagnose-drug/${id}`,
            providesTags: (result, id) => [{ type: 'DiagnoseDrug', id }],
        }),
        deleteDiagnoseDrug: build.mutation({
            query: (id) => ({
                url: `diagnose-drug/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['DiagnoseDrug'],
        }),
        updateDiagnoseDrug: build.mutation({
            query: ({ id, body }) => ({
                url: `diagnose-drug/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'DiagnoseDrug', id }],
        }),
    }),
});

export const { useGetDiagnoseDrugsQuery, useAddDiagnoseDrugMutation, useGetDiagnoseDrugQuery, useDeleteDiagnoseDrugMutation, useUpdateDiagnoseDrugMutation } = diagnoseDrugApi