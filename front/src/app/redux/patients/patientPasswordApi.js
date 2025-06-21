import { createApi } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const patientPasswordApi = createApi({
    reducerPath: 'patientPasswordApi',
    tagTypes: ['PatientPassword'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        addPatientPassword: build.mutation({
            query: (body) => ({
                url: 'patients-password',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Patient'],
        }),
        deletePatientPassword: build.mutation({
            query: (id) => ({
                url: `patients-password/${id}`,
                method: 'DELETE',
            }),
            providesTags: (result, error, id) => [{ type: 'Patient', id }],
        }),
        updatePatientPassword: build.mutation({
            query: ({ id, body }) => ({
                url: `patients-password/${id}`,
                method: 'PUT',
                body,
            }),
            providesTags: (result, error, id) => [{ type: 'Patient', id }],
        }),
    }),
});

export const { useGetPatientsPasswordQuery, useAddPatientPasswordMutation, useDeletePatientPasswordMutation, useUpdatePatientPasswordMutation } = patientPasswordApi