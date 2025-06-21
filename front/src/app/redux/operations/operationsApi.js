import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const operationApi = createApi({
    reducerPath: 'operationApi',
    tagTypes: ['Operations', 'Patient'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getOperations: build.query({
            query: () => 'operations',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({id}) => ({type: 'Operations', id})),
                        {type: 'Operations', id: 'LIST'},
                    ]
                    : [{type: 'Operations', id: 'LIST'}],
        }),

        getOperation: build.query({
            query: (id) => `operations/${id}`,
            providesTags: (result, id) => [{type: 'Operations', id}],
        }),
        updateOperation: build.mutation({
            query: ({id, body}) => ({
                url: `operations/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, {id}) => [{type: 'Operations', id}],
        }),
    }),
});

export const {
    useGetOperationsQuery,
    useGetOperationTypeQuery,

    useUpdateOperationMutation
} = operationApi
