import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const rolesApi = createApi({
    reducerPath: 'rolesApi',
    tagTypes: ['Roles'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getRoles: build.query({
            query: () => '/roles',
            providesTags: (result) =>
                result && Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'Roles', id })),
                        { type: 'Roles', id: 'LIST' },
                    ]
                    : [{ type: 'Roles', id: 'LIST' }],
        }),
        addRoles: build.mutation({
            query: (body) => ({
                url: 'roles',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Roles'],
        }),
        getRole: build.query({
            query: (id) => `roles/${id}`,
            providesTags: (result, id) => [{ type: 'Roles', id }],
        }),
        deleteRole: build.mutation({
            query: (id) => ({
                url: `roles/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Roles'],
        }),
        updateRole: build.mutation({
            query: ({ id, body }) => ({
                url: `roles/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'Roles', id }],
        }),
    }),
});

export const {useGetRolesQuery, useAddRolesMutation, useGetRoleQuery, useDeleteRoleMutation, useUpdateRoleMutation} = rolesApi;
