import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {serverPath, token} from "../serverPath.js";

export const authApi = createApi({
    reducerPath: "authApi",
    tagTypes: ["Auth"],
    baseQuery: fetchBaseQuery({
        baseUrl: serverPath,
        prepareHeaders: (headers, { getState, endpoint }) => {
            const token = localStorage.getItem('access_token');

            headers.set("Accept", "application/json");


            if (token && (endpoint === "register" || endpoint === "logout" || endpoint === "resetPassword")) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    endpoints: (build) => ({
        register: build.mutation({
            query: (body) => ({
                url: "new-user",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: 'Workers', id: 'LIST' }],
        }),
        login: build.mutation({
            query: (body) => ({
                url: "login",
                method: "POST",
                body,
            }),
        }),
        resetPassword: build.mutation({
           query: (body) => ({
               url: "new-password",
               method: "POST",
               body,
           })
        }),
        logout: build.mutation({
            query: () => ({
                url: "logout",
                method: "POST",
            }),
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useResetPasswordMutation,
} = authApi;