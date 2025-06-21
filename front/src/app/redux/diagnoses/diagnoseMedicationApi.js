import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";

export const diagnoseMedicationApi = createApi({
    reducerPath: 'diagnoseMedicationApi',
    tagTypes: ['DiagnoseMedication'],
    baseQuery: fetchBaseQuery({ baseUrl: serverPath,
        prepareHeaders: (headers, { getState, endpoint }) => {
            const token = localStorage.getItem('access_token');

            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    endpoints: (build) => ({
        getDiagnoseMedications: build.query({
            query: (id) => `/diagnoses/${id}/medications`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'DiagnoseMedication', id })),
                        { type: 'DiagnoseMedication', id: 'LIST' },
                    ]
                    : [{ type: 'DiagnoseMedication', id: 'LIST' }],
        }),

        deleteDiagnoseMedication: build.mutation({
            query: (id) => ({
                url: `/diagnoses/medications/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['DiagnoseMedication'],
        }),
        updateDiagnoseMedication: build.mutation({
            query: ({ id, body }) => ({
                url: `/diagnoses/medications/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'DiagnoseMedication', id }],
        }),
    }),
});

export const { useGetDiagnoseMedicationsQuery, useGetDiagnoseMedicationQuery, useDeleteDiagnoseMedicationMutation, useUpdateDiagnoseMedicationMutation } = diagnoseMedicationApi