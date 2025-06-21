import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const appointmentStatusApi = createApi({
    reducerPath: 'appointmentStatusApi',
    tagTypes: ['AppointmentStatus'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getAppointmentStatuses:  build.query({
            query: () => 'appointment-status',
            providesTags: (result) =>
                result && Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'AppointmentStatus', id })),
                        { type: 'AppointmentStatus', id: 'LIST' },
                    ]
                    : [{ type: 'AppointmentStatus', id: 'LIST' }],
        }),
        addAppointmentStatus: build.mutation({
            query: (body) => ({
                url: 'appointment-status',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AppointmentStatus'],
        }),
        getAppointmentStatus: build.query({
            query: (id) => `drug-format/${id}`,
            providesTags: (result, id) => [{ type: 'AppointmentStatus', id }],
        }),
        deleteAppointmentStatus: build.mutation({
            query: (id) => ({
                url: `appointment-status/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AppointmentStatus'],
        }),
        updateAppointmentStatus: build.mutation({
            query: ({ id, body }) => ({
                url: `appointment-status/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'AppointmentStatus', id }],
        }),
    }),
});

export const { useGetAppointmentStatusesQuery,useAddAppointmentStatusMutation,useGetAppointmentStatusQuery,useDeleteAppointmentStatusMutation, useUpdateAppointmentStatusMutation  } = appointmentStatusApi