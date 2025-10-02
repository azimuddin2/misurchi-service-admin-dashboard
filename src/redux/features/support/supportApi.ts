import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TSupport } from '@/types/support.type';

const SupportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSupportMessage: builder.mutation<TResponse<TSupport>, Partial<TSupport>>(
      {
        query: (data) => ({
          url: '/supports',
          method: 'POST',
          body: data,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        invalidatesTags: ['Support'],
      },
    ),

    getAllSupportMessage: builder.query<
      TResponse<TSupport[]>,
      {
        page?: number | string;
        limit?: number | string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ page = 1, limit = 10, query }) => {
        const params = new URLSearchParams();

        if (query?.searchTerm) {
          params.append('searchTerm', query.searchTerm.toString());
        }

        if (query?.createdAt) {
          const date = new Date(query.createdAt.toString().slice(0, 10));
          params.append('createdAt', date.toISOString());
        }

        return {
          url: `/supports?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Support'],
    }),

    getSupportMessageById: builder.query<TResponse<TSupport>, string>({
      query: (id) => ({
        url: `/supports/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Support'],
    }),

    updateSupportMessage: builder.mutation<
      TResponse<TSupport>,
      { id: string; data: Partial<TSupport> }
    >({
      query: ({ id, data }) => ({
        url: `/supports/${id}`,
        method: 'PATCH',
        body: data,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Support'],
    }),

    deleteSupportMessage: builder.mutation<TResponse<TSupport>, string>({
      query: (id) => ({
        url: `/supports/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Support'],
    }),
  }),
});

export const {
  useAddSupportMessageMutation,
  useGetAllSupportMessageQuery,
  useGetSupportMessageByIdQuery,
  useUpdateSupportMessageMutation,
  useDeleteSupportMessageMutation,
} = SupportApi;
