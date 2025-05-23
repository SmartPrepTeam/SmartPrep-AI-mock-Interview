import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENDPOINTS } from '@/api/api-config';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { logout, setToken } from './authSlice';
import { RootState } from '@/redux/store';
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Retrieve token from sessionStorage or state
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, store, extraOptions) => {
  let result = await baseQuery(args, store, extraOptions);

  if (result.error && result.error.status === 401) {
    // Handle token refresh logic
    const refreshResult = await baseQuery(
      { url: ENDPOINTS.auth.refresh, method: 'POST' },
      store,
      extraOptions
    );

    if (refreshResult.data) {
      const newToken = (refreshResult.data as any).access_token;
      store.dispatch(setToken(newToken));
      result = await baseQuery(args, store, extraOptions);
    } else {
      store.dispatch(logout());
    }
  }

  return result;
};
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
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
    getRecentInterviews: builder.query({
      query: ({ user_id, page }) => ({
        url: `/interviews/${user_id}?page=${page}`,
      }),
    }),
    getScoresForVideos: builder.mutation({
      query: ({ question_id, user_id, answers }) => ({
        url: `${ENDPOINTS.video_interview.score_generation}/${question_id}?user_id=${user_id}`,
        method: 'POST',
        body: {
          answers: answers,
        },
      }),
    }),
    deleteIncompleteInterview: builder.mutation({
      query: ({ question_id, user_id }) => ({
        url: `${ENDPOINTS.video_interview.incomplete_interview}/${question_id}`,
        method: 'DELETE',
        params: { user_id },
      }),
    }),
    // Endpoints for deleting frames
    deleteQuestionFrames: builder.mutation({
      query: ({ interview_id, question_no, user_id }) => ({
        url: `${ENDPOINTS.video_interview.frames.question}/${interview_id}/${user_id}/${question_no}`,
        method: 'DELETE',
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
  useDeleteIncompleteInterviewMutation,
  useGetScoresForVideosMutation,
  useGetFeedbackMutation,
  useGetRecentInterviewsQuery,
  useDeleteQuestionFramesMutation,
} = apiSlice;
