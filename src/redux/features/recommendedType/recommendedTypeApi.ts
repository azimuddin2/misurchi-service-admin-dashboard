import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TRecommendedType } from '@/types/recommended.type';

const RecommendedTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addRecommendedType: builder.mutation<
      TResponse<TRecommendedType>,
      Partial<TRecommendedType>
    >({
      query: (data) => ({
        url: '/recommended-type',
        method: 'POST',
        body: data,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['RecommendedType'],
    }),

    getAllRecommendedType: builder.query<
      TResponse<TRecommendedType[]>,
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
          url: `/recommended-type?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['RecommendedType'],
    }),

    getRecommendedTypeById: builder.query<TResponse<TRecommendedType>, string>({
      query: (id) => ({
        url: `/recommended-type/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['RecommendedType'],
    }),

    updateRecommendedType: builder.mutation<
      TResponse<TRecommendedType>,
      { id: string; data: Partial<TRecommendedType> }
    >({
      query: ({ id, data }) => ({
        url: `/recommended-type/${id}`,
        method: 'PATCH',
        body: data,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['RecommendedType'],
    }),

    deleteRecommendedType: builder.mutation<
      TResponse<TRecommendedType>,
      string
    >({
      query: (id) => ({
        url: `/recommended-type/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['RecommendedType'],
    }),
  }),
});

export const {
  useAddRecommendedTypeMutation,
  useGetAllRecommendedTypeQuery,
  useGetRecommendedTypeByIdQuery,
  useUpdateRecommendedTypeMutation,
  useDeleteRecommendedTypeMutation,
} = RecommendedTypeApi;
