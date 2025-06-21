import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { serverPath } from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const appointmentApi = createApi({
    reducerPath: 'appointmentApi',
    tagTypes: ['Appointment'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getAppointments: build.query({
            query: () => "appointments",
            providesTags: (result) =>
                result && Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: "Appointment", id })),
                        { type: "Appointment", id: "LIST" },
                    ]
                    : [{ type: "Appointment", id: "LIST" }],
        }),

        addAppointment: build.mutation({
            query: (body) => ({
                url: "appointments",
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { patient_id }) => [
                { type: "Appointment", id: "LIST" },
                { type: "Patient", id: patient_id },
            ],
        }),

        getAppointment: build.query({
            query: (id) => `appointments/${id}`,
            providesTags: (result, error, id) => [{ type: "Appointment", id }],
        }),

        updateAppointment: build.mutation({
            query: ({ id, body }) => ({
                url: `appointments/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { patient_id }) => [
                { type: "Appointment", id: result?.id },
                { type: "Patient", id: patient_id }, // ❗ Инвалидируем кэш пациента
            ],
        }),

        deleteAppointment: build.mutation({
            query: (id) => ({
                url: `appointments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Appointment", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetAppointmentsQuery,
    useAddAppointmentMutation,
    useGetAppointmentQuery,
    useDeleteAppointmentMutation,
    useUpdateAppointmentMutation,
} = appointmentApi;