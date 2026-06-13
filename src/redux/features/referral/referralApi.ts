import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';

const referralApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllVendorReferralStats: builder.query<
      TResponse<any[]>,
      {
        page?: number | string;
        limit?: number | string;
        searchTerm?: string;
        month?: string;
      }
    >({
      query: ({ page = 1, limit = 10, searchTerm, month }) => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (month) params.append('month', month);
        return {
          url: `/referral/admin/all-vendors?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['Referral'],
    }),

    getVendorReferralDetail: builder.query<
      TResponse<any[]>,
      {
        vendorId: string;
        page?: number | string;
        limit?: number | string;
      }
    >({
      query: ({ vendorId, page = 1, limit = 10 }) => ({
        url: `/referral/admin/vendor-detail/${vendorId}?page=${page}&limit=${limit}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Referral'],
    }),
  }),
});

export const {
  useGetAllVendorReferralStatsQuery,
  useGetVendorReferralDetailQuery,
} = referralApi;
