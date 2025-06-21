import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const weekdayApi = createApi({
    reducerPath: 'weekdayApi',
    tagTypes: ['Weekday'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getWeekdays: build.query({
            query: () => 'days',
            providesTags: (result) =>
                result && Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Weekday', id })),
                        { type: 'Weekday', id: 'LIST' },
                    ]
                    : [{ type: 'Weekday', id: 'LIST' }],
        }),
        addWeekday: build.mutation({
            query: (body) => ({
                url: 'days',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Weekday'],
        }),
        getWeekday: build.query({
            query: (id) => `days/${id}`,
            providesTags: (result, id) => [{ type: 'Weekday', id }],
        }),
        deleteWeekday: build.mutation({
            query: (id) => ({
                url: `days/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Weekday'],
        }),
        updateWeekday: build.mutation({
            query: ({ id, body }) => ({
                url: `days/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'Weekday', id }],
        }),
    }),
});

export const { useGetWeekdaysQuery, useAddWeekdayMutation, useGetWeekdayQuery, useDeleteWeekdayMutation, useUpdateWeekdayMutation } = weekdayApi