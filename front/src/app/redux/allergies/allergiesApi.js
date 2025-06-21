import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const allergiesApi = createApi({
    reducerPath: 'AllergiesApi',
    tagTypes: ['Allergies'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getAllergies: build.query({
            query: () => 'allergies',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Allergies', id })),
                        { type: 'Allergies', id: 'LIST' },
                    ]
                    : [{ type: 'Allergies', id: 'LIST' }],
        }),

        getAllergy: build.query({
            query: (id) => `allergies/${id}`,
            providesTags: (result, id) => [{ type: 'Allergies', id }],
        }),

        updateAllergy: build.mutation({
            query: ({ id, body }) => ({
                url: `allergies/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'Allergies', id }],
        }),
    }),
});

export const { useGetAllergiesQuery,  useGetAllergyQuery, useDeleteAllergyMutation, useUpdateAllergyMutation,  } = allergiesApi