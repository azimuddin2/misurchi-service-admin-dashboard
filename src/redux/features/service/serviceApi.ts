import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TService } from '@/types/service.type';

const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServicesByUser: builder.query<
      TResponse<TService[]>,
      {
        vendorId: string;
        page?: number | string;
        limit?: number | string;
        query?: Record<string, string | string[] | undefined>;
      }
    >({
      query: ({ vendorId, page = 1, limit = 10, query }) => {
        const params = new URLSearchParams();

        if (query?.price) {
          params.append('minPrice', '0');
          params.append('maxPrice', query.price.toString());
        }

        if (query?.category) {
          params.append('category', query.category.toString());
        }

        if (query?.searchTerm) {
          params.append('searchTerm', query.searchTerm.toString());
        }

        if (query?.createdAt) {
          const date = new Date(query.createdAt.toString().slice(0, 10));
          params.append('createdAt', date.toISOString());
        }

        return {
          url: `/services?vendor=${vendorId}&page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Service'],
    }),

    getServiceById: builder.query<TResponse<TService>, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Service'],
    }),
  }),
});

export const { useGetAllServicesByUserQuery, useGetServiceByIdQuery } =
  serviceApi;
