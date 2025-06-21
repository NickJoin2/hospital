import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const allergyAllergenApi = createApi({
    reducerPath: 'AllergyNameApi',
    tagTypes: ['AllergyAllergen'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getAllergiesAllergen: build.query({
            query: () => 'allergens',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'AllergyAllergen', id })),
                        { type: 'AllergyAllergen', id: 'LIST' },
                    ]
                    : [{ type: 'AllergyAllergen', id: 'LIST' }],
        }),
        addAllergyAllergen: build.mutation({
            query: (body) => ({
                url: 'allergens',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AllergyAllergen'],
        }),
        getAllergyAllergen: build.query({
            query: (id) => `allergens/${id}`,
            providesTags: (result, id) => [{ type: 'AllergyAllergen', id }],
        }),
        deleteAllergyAllergen: build.mutation({
            query: (id) => ({
                url: `allergens/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AllergyAllergen'],
        }),
        updateAllergyAllergen: build.mutation({
            query: ({ id, body }) => ({
                url: `allergens/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'AllergyAllergen', id }],
        }),
    }),
});

export const { useGetAllergiesAllergenQuery, useAddAllergyAllergenMutation, useGetAllergyAllergenQuery, useDeleteAllergyAllergenMutation, useUpdateAllergyAllergenMutation } = allergyAllergenApi