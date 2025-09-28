import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TPolicy } from '@/types/policy.type';

const policyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create or update (upsert) policy
    addPolicy: builder.mutation<TResponse<TPolicy>, Partial<TPolicy>>({
      query: (data) => ({
        url: '/policy',
        method: 'POST',
        body: data,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Policy'],
    }),

    // Get single policy
    getPolicy: builder.query<TResponse<TPolicy>, void>({
      query: () => ({
        url: '/policy',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Policy'],
    }),

    // Soft delete policy
    deletePolicy: builder.mutation<TResponse<TPolicy>, void>({
      query: () => ({
        url: '/policy',
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Policy'],
    }),
  }),
});

export const {
  useAddPolicyMutation,
  useGetPolicyQuery,
  useDeletePolicyMutation,
} = policyApi;
