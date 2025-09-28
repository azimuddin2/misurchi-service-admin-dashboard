import { baseApi } from '@/redux/api/baseApi';
import { TResponse } from '@/types';
import { TTerms } from '@/types/terms.type';

const termsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create or update (upsert) terms
    addTerms: builder.mutation<TResponse<TTerms>, Partial<TTerms>>({
      query: (data) => ({
        url: '/terms',
        method: 'POST',
        body: data,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Terms'],
    }),

    // Get single terms
    getTerms: builder.query<TResponse<TTerms>, void>({
      query: () => ({
        url: '/terms',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Terms'],
    }),

    // Soft delete terms
    deleteTerms: builder.mutation<TResponse<TTerms>, void>({
      query: () => ({
        url: '/terms',
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Terms'],
    }),
  }),
});

export const { useAddTermsMutation, useGetTermsQuery, useDeleteTermsMutation } =
  termsApi;
