import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const patientApi = createApi({
    reducerPath: "patientApi",
    tagTypes: ["Patient"],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getPatients: build.query({
            query: () => "patients",
            transformResponse: (response) => {
                return Array.isArray(response) ? response : response.data || [];
            },
            providesTags: (result) =>
                result && Array.isArray(result)
                    ? [...result.map(({ id }) => ({ type: "Patient", id })), { type: "Patient", id: "LIST" }]
                    : [{ type: "Patient", id: "LIST" }],
        }),
        addPatient: build.mutation({
            query: (body) => ({
                url: 'patients',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Patient'],
        }),
        addPatientPhoto: build.mutation({
            query: ({ body, id }) => ({
                url: `/patients/${id}/avatar`,
                method: 'POST',
                body,
                formData: true,
            }),
            invalidatesTags: (result, error, { id }) =>
                [{ type: 'Patient', id }],
        }),
        getPatient: build.query({
            query: (id) => `patients/${id}`,
            providesTags: (result, error, id) => [{ type: 'Patient', id }],
        }),
        deletePatient: build.mutation({
            query: (id) => ({
                url: `patients/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Patient'],
        }),
        addOperation: build.mutation({
            query: (body) => ({
                url: 'operations',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Patient'],
        }),
        deleteOperation: build.mutation({
            query: (id) => ({
                url: `operations/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Patient'],
        }),
        addAllergy: build.mutation({
            query: (body) => ({
                url: 'allergy',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Patient'],
        }),
        deleteAllergy: build.mutation({
            query: (id) => ({
                url: `allergy/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Patient'],
        }),
        deleteInsurance: build.mutation({
            query: (id) => ({
                url: `/patients-insurances/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Patient'],
        }),
        addPatientInsurance: build.mutation({
            query: (body) => ({
                url: 'patients-insurances',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Patient'],
        }),
        addDiagnoseMedication: build.mutation({
            query: ({body, id}) => ({
                url: `/diagnoses/${id}/medications`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Patient'],
        }),
        updatePatient: build.mutation({
            query: ({ id, body }) => ({
                url: `patients/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Patient', id },
                { type: 'Patient', id: 'LIST' }
            ],
        }),
        updatePatientFio: build.mutation({
            query: ({ id, body }) => ({
                url: `patients/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Patient', id },
                { type: 'Patient', id: 'LIST' }
            ],
        }),
        appointmentStatus: build.mutation({
            query: ({ id, status_id }) => ({
                url: `/appointments/${id}/status`,
                method: 'PUT',
                body: { status_id },
            }),
            invalidatesTags: ['Patient'],
        }),
    }),
});

export const { useGetPatientsQuery,useAddDiagnoseMedicationMutation, useUpdatePatientFioMutation, useAppointmentStatusMutation, useAddPatientInsuranceMutation, useDeleteInsuranceMutation, useAddPatientPhotoMutation,useAddOperationMutation, useAddPatientMutation, useDeleteAllergyMutation, useGetPatientQuery,     useDeleteOperationMutation, useDeletePatientMutation, useAddAllergyMutation, useUpdatePatientMutation } = patientApi