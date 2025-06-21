import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const severityApi = createApi({
    reducerPath: 'severityApi',
    tagTypes: ['Severity'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getSeverities: build.query({
            query: () => 'severity',
            providesTags: (result) =>
                result && Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Severity', id })),
                        { type: 'Severity', id: 'LIST' },
                    ]
                    : [{ type: 'Severity', id: 'LIST' }],
        }),
        addSeverity: build.mutation({
            query: (body) => ({
                url: 'severity',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Severity'],
        }),
        getSeverity: build.query({
            query: (id) => `severity/${id}`,
            providesTags: (result, id) => [{ type: 'Severity', id }],
        }),
        deleteSeverity: build.mutation({
            query: (id) => ({
                url: `severity/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Severity'],
        }),
        updateSeverity: build.mutation({
            query: ({ id, body }) => ({
                url: `severity/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'Severity', id }],
        }),
    }),
});

export const { useGetSeveritiesQuery, useAddSeverityMutation, useGetSeverityQuery, useDeleteSeverityMutation, useUpdateSeverityMutation } = severityApi