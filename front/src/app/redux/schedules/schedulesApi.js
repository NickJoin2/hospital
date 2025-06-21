import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const schedulesApi = createApi({
    reducerPath: 'schedulesApi',
    tagTypes: ['Schedule'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getSchedules: build.query({
            query: () => 'schedules',
            providesTags: (result) =>
                result && Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Schedule', id })),
                        { type: 'Schedule', id: 'LIST' },
                    ]
                    : [{ type: 'Schedule', id: 'LIST' }],
        }),
        addSchedule: build.mutation({
            query: (body) => ({
                url: 'schedules',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Schedule'],
        }),
        getScheduleProfile: build.query({
            query: () => "schedules-profile",
            invalidatesTags: ['Schedule'],
        }),
        getSchedule: build.query({
            query: (id) => `schedule/${id}`,
            providesTags: (result, id) => [{ type: 'Schedule', id }],
        }),
        deleteSchedule: build.mutation({
            query: (id) => ({
                url: `schedules/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Schedule'],
        }),
        updateSchedule: build.mutation({
            query: ({ id, body }) => ({
                url: `schedules/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'Schedule', id }],
        }),
    }),
});

export const { useGetSchedulesQuery, useAddScheduleMutation, useGetScheduleProfileQuery ,useGetScheduleQuery, useDeleteScheduleMutation, useUpdateScheduleMutation } = schedulesApi