import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const diagnoseApi = createApi({
    reducerPath: 'DiagnoseApi',
    tagTypes: ['Diagnose'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getDiagnoses: build.query({
            query: () => 'diagnoses',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Diagnose', id })),
                        { type: 'Diagnose', id: 'LIST' },
                    ]
                    : [{ type: 'Diagnose', id: 'LIST' }],
        }),
        addDiagnose: build.mutation({
            query: (body) => ({
                url: 'diagnoses',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Diagnose'],
        }),
        getDiagnose: build.query({
            query: (id) => `diagnose/${id}`,
            providesTags: (result, id) => [{ type: 'Diagnose', id }],
        }),
        deleteDiagnose: build.mutation({
            query: (id) => ({
                url: `diagnoses/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Diagnose'],
        }),
        updateDiagnose: build.mutation({
            query: ({ id, body }) => ({
                url: `diagnoses/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'Diagnose', id }],
        }),
    }),
});

export const { useGetDiagnosesDQuery, useAddDiagnoseMutation, useGetDiagnoseQuery, useDeleteDiagnoseMutation, useUpdateDiagnoseMutation } = diagnoseApi