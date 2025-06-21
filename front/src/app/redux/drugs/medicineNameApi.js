import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {serverPath} from "../serverPath.js";
import {baseQueryWithReauth} from "../auth/customBaseQuery.js";

export const medicineNameApi = createApi({
    reducerPath: 'medicineNameApi',
    tagTypes: ['MedicineName'],
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getMedicinesiesName: build.query({
            query: () => 'medicines-name',
            providesTags: (result) =>
                result && Array.isArray(result)
                    ? [
                        ...result.map(({ id }) => ({ type: 'MedicineName', id })),
                        { type: 'MedicineName', id: 'LIST' },
                    ]
                    : [{ type: 'MedicineName', id: 'LIST' }],
        }),
        addMedicines: build.mutation({
            query: (body) => ({
                url: 'medicines-name',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['MedicineName'],
        }),
        getMedicines: build.query({
            query: (id) => `medicines-name/${id}`,
            providesTags: (result, id) => [{ type: 'MedicineName', id }],
        }),
        deleteMedicinesName: build.mutation({
            query: (id) => ({
                url: `medicines-name/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['MedicineName'],
        }),
        updateMedicines: build.mutation({
            query: ({ id, body }) => ({
                url: `medicines-name/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, { id }) => [{ type: 'MedicineName', id }],
        }),
    }),
});

export const { useGetMedicinesiesNameQuery, useAddMedicinesMutation, useDeleteMedicinesNameMutation, useUpdateMedicinesMutation } = medicineNameApi