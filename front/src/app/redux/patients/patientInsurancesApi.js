import { createApi } from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const patientInsuranceApi = createApi({
    reducerPath: 'patientInsuranceApi',
    tagTypes: ['PatientInsurance'],
    baseQuery: baseQueryWithReauth,
        endpoints: (build) => ({
            addPatientInsurance: build.mutation({
                query: (body) => ({
                    url: 'patients-insurances',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: (result, error, body) => {
                    // Инвалидируем конкретного пациента по ID
                    return [{ type: 'Patient', id: body.patient_id }];
                },
            }),
        deletePatientInsurance: build.mutation({
            query: (id) => ({
                url: `patients-insurances/${id}`,
                method: 'DELETE',
            }),
            providesTags: (result, error, id) => [{ type: 'Patient', id }],
        }),
        updatePatientInsurance: build.mutation({
            query: ({ id, body }) => ({
                url: `patients-insurances/${id}`,
                method: 'PUT',
                body,
            }),
            providesTags: (result, error, id) => [{ type: 'Patient', id }],
        }),
    }),
});

export const { useGetPatientsInsurancesQuery,useAddPatientInsuranceMutation, useDeletePatientInsuranceMutation, useUpdatePatientInsuranceMutation } = patientInsuranceApi
