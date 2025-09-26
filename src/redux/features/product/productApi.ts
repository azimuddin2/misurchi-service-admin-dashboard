import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TProduct } from '@/types/product.type';

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProductsByUser: builder.query<
      TResponse<TProduct[]>,
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
          url: `/products?vendor=${vendorId}&page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Product'],
    }),

    getProductById: builder.query<TResponse<TProduct>, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Product'],
    }),
  }),
});

export const { useGetAllProductsByUserQuery, useGetProductByIdQuery } =
  productApi;
