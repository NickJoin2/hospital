import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const drugFrequencyApi = createApi({
    reducerPath: "drugFrequencyApi",
    tagTypes: ["DrugFrequency"],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getDrugsFrequency: build.query({
            query: () => "frequency",
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: "DrugFrequency", id })),
                        { type: "DrugFrequency", id: "LIST" },
                    ]
                    : [{ type: "DrugFrequency", id: "LIST" }],
        }),
        addDrugFrequency: build.mutation({
            query: (body) => ({
                url: "frequency",
                method: "POST",
                body,
            }),
            invalidatesTags: ["DrugFrequency"],
        }),
        getDrugFrequency: build.query({
            query: (id) => `frequency/${id}`,
            providesTags: (result, id) => [{ type: "DrugFrequency", id }],
        }),
        deleteDrugFrequency: build.mutation({
            query: (id) => ({
                url: `frequency/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["DrugFrequency"],
        }),
        updateDrugFrequency: build.mutation({
            query: ({ id, body }) => ({
                url: `frequency/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: "DrugFrequency", id }],
        }),
    }),
});

// Export hooks
export const {
    useGetDrugsFrequencyQuery,
    useAddDrugFrequencyMutation,
    useGetDrugFrequencyQuery,
    useDeleteDrugFrequencyMutation,
    useUpdateDrugFrequencyMutation,
} = drugFrequencyApi;

export default drugFrequencyApi;