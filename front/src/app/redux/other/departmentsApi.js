import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const departmentsApi = createApi({
    reducerPath: 'departmentApi',
    tagTypes: ['Department'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getDepartments: build.query({
            query: () => 'departments',
            providesTags: (result) =>
                result && Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Departments', id })),
                        { type: 'Departments', id: 'LIST' },
                    ]
                    : [{ type: 'Departments', id: 'LIST' }],
        }),
        addDepartment: build.mutation({
            query: (body) => ({
                url: 'departments',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Departments'],
        }),
        getDepartment: build.query({
            query: (id) => `departments/${id}`,
            providesTags: (result, id) => [{ type: 'Departments', id }],
        }),
        deleteDepartment: build.mutation({
            query: (id) => ({
                url: `departments/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Departments'],
        }),
        updateDepartment: build.mutation({
            query: ({ id, body }) => ({
                url: `departments/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'Departments', id }],
        }),
    }),
});

export const {useGetDepartmentsQuery, useAddDepartmentMutation, useGetDepartmentQuery,useDeleteDepartmentMutation, useUpdateDepartmentMutation } = departmentsApi
