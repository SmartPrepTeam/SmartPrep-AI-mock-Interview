import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '@/api/api-config';
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  endpoints: (builder) => ({
    // Auth Endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: ENDPOINTS.auth.login,
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (credentials) => ({
        url: ENDPOINTS.auth.signup,
        method: 'POST',
        body: credentials,
      }),
    }),
    refresh: builder.query({
      query: () => ({
        url: '/auth/refresh',
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: ENDPOINTS.auth.logout,
        method: 'POST',
      }),
    }),
    uploadResume: builder.mutation({
      // Resume
      query: (formData) => ({
        url: ENDPOINTS.resume.upload,
        body: formData,
        method: 'POST',
      }),
    }),
    createUserProfile: builder.mutation({
      query: ({ user_id, data }) => ({
        url: `${ENDPOINTS.user.profile}/${user_id}`,
        method: 'POST',
        body: data,
      }),
    }),
    updateUserProfile: builder.mutation({
      query: ({ user_id, ...data }) => ({
        url: `${ENDPOINTS.user.profile}/${user_id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getUserProfile: builder.query({
      query: (user_id) => ({
        url: `${ENDPOINTS.user.profile}/${user_id}`,
      }),
    }),
    //  Textual Interviews
    generateQuestions: builder.mutation({
      query: (data) => ({
        url: ENDPOINTS.textual_interview.question_generation,
        method: 'POST',
        body: data,
      }),
    }),
    generateScores: builder.mutation({
      query: ({ question_id, user_id, answers }) => ({
        url: `${ENDPOINTS.textual_interview.score_generation}/${question_id}?user_id=${user_id}`,
        method: 'POST',
        body: {
          answers: answers,
        },
      }),
    }),
    getFeedback: builder.mutation({
      query: ({ question, answer }) => ({
        url: ENDPOINTS.textual_interview.feedback,
        method: 'POST',
        body: {
          question: question,
          answer: answer,
        },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useRefreshQuery,
  useLogoutMutation,
  useUploadResumeMutation,
  useCreateUserProfileMutation,
  useUpdateUserProfileMutation,
  useGetUserProfileQuery,
  useGenerateQuestionsMutation,
  useGenerateScoresMutation,
  useGetFeedbackMutation,
} = apiSlice;
