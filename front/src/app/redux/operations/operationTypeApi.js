import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const operationTypeApi = createApi({
    reducerPath: 'operationTypeApi',
    tagTypes: ['OperationType'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getOperationTypes: build.query({
            query: () => 'operation-types',
            providesTags: (result) =>
                result && Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'OperationType', id })),
                        { type: 'OperationType', id: 'LIST' },
                    ]
                    : [{ type: 'OperationType', id: 'LIST' }],
        }),
        addOperationType: build.mutation({
            query: (body) => ({
                url: 'operation-types',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['OperationType'],
        }),
        getOperationType: build.query({
            query: (id) => `operation-types/${id}`,
            providesTags: (result, id) => [{ type: 'OperationType', id }],
        }),
        deleteOperationType: build.mutation({
            query: (id) => ({
                url: `operation-types/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['OperationType'],
        }),
        updateOperationType: build.mutation({
            query: ({ id, body }) => ({
                url: `operation-types/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'OperationType', id }],
        }),
    }),
});

export const {useGetOperationTypesQuery, useAddOperationTypeMutation, useGetOperationTypeQuery, useDeleteOperationTypeMutation, useUpdateOperationTypeMutation} = operationTypeApi;
