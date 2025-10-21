import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TPayment, TSubPayment } from '@/types/payment.type';

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubPayment: builder.query<
      TResponse<TSubPayment[]>,
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
          url: `/sub-payments?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Payment'],
    }),

    getAllPaymentCommission: builder.query<
      TResponse<TPayment[]>,
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
          url: `/payments/admin-commission?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Payment'],
    }),
  }),
});

export const { useGetAllSubPaymentQuery, useGetAllPaymentCommissionQuery } =
  paymentApi;
