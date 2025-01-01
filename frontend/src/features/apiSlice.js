import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  endpoints: (builder) => ({
    // Auth Endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (credentials) => ({
        url: '/auth/signup',
        method: 'POST',
        body: credentials,
      }),
      refresh: builder.query({
        query: () => ({
          url: '/auth/refresh',
        }),
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    uploadResume: builder.mutation({
      // Resume
      query: (file) => ({
        url: '/resume/upload',
        body: file,
        method: 'POST',
      }),
    }),
    createUserProfile: builder.mutation({
      query: ({ user_id, ...data }) => ({
        url: `/user/profile/${user_id}`,
        method: 'POST',
        body: data,
      }),
    }),
    updateUserProfile: builder.mutation({
      query: ({ user_id, ...data }) => ({
        url: `/user/profile/${user_id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getUserProfile: builder.query({
      query: (user_id) => ({
        url: `/user/profile/${user_id}`,
      }),
    }),
  }),
});

export {useLoginMutation,useSignupMutation,useRefreshQuery,useLogoutMutation,useUploadResumeMutation,useCreateUserProfileMutation,useUpdateUserProfileMutation,useGetUserProfileQuery} from apiSlice;