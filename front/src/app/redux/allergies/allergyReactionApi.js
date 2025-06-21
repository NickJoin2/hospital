import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";

export const allergyReactionApi = createApi({
    reducerPath: 'AllergyReactionApi',
    tagTypes: ['AllergyReaction'],
    baseQuery: fetchBaseQuery({ baseUrl: serverPath,
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
    }),
    endpoints: (build) => ({
        getAllergiesReaction: build.query({
            query: () => 'allergy-reaction',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'AllergyReaction', id })),
                        { type: 'AllergyReaction', id: 'LIST' },
                    ]
                    : [{ type: 'AllergyReaction', id: 'LIST' }],
        }),
        addAllergyReaction: build.mutation({
            query: (body) => ({
                url: 'allergy-reaction',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AllergyReaction'],
        }),
        getAllergyReaction: build.query({
            query: (id) => `allergy-reaction/${id}`,
            providesTags: (result, id) => [{ type: 'AllergyReaction', id }],
        }),
        deleteAllergyReaction: build.mutation({
            query: (id) => ({
                url: `allergy-reaction/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AllergyReaction'],
        }),
        updateAllergyReaction: build.mutation({
            query: ({ id, body }) => ({
                url: `allergy-reaction/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'AllergyReaction', id }],
        }),
    }),
});

export const { useGetAllergiesReactionQuery, useAddAllergyReactionMutation, useGetAllergyReactionQuery, useDeleteAllergyReactionMutation, useUpdateAllergyReactionMutation } = allergyReactionApi