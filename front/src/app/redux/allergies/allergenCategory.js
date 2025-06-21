import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const allergenCategoryApi = createApi({
    reducerPath: 'AllergenCategoryApi',
    tagTypes: ['AllergenCategory'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getAllergenCategories: build.query({
            query: () => 'allergens-category',
            providesTags: (result) =>
                result && Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'AllergenCategory', id })),
                        { type: 'AllergenCategory', id: 'LIST' },
                    ]
                    : [{ type: 'AllergenCategory', id: 'LIST' }],
        }),
        addAllergyCategory: build.mutation({
            query: (body) => ({
                url: 'allergens-category',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AllergenCategory'],
        }),
        getAllergyCategory: build.query({
            query: (id) => `allergens-category/${id}`,
            providesTags: (result, id) => [{ type: 'AllergenCategory', id }],
        }),
        deleteAllergyCategory: build.mutation({
            query: (id) => ({
                url: `allergens-category/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AllergenCategory'],
        }),
        updateAllergyCategory: build.mutation({
            query: ({ id, body }) => ({
                url: `allergens-category/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'AllergenCategory', id }],
        }),
    }),
});

export const { useGetAllergenCategoriesQuery, useAddAllergyCategoryMutation, useGetAllergyCategoryQuery, useDeleteAllergyCategoryMutation, useUpdateAllergyCategoryMutation  } = allergenCategoryApi