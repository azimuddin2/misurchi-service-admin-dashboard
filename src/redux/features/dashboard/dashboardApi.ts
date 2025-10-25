import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TAdminDashboardStats } from '@/types/dashboard.type';

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboardStats: builder.query<TResponse<TAdminDashboardStats>, any>({
      query: () => ({
        url: `/dashboard/admin-stats`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Dashboard'],
    }),

    getAdminUserOverviewChart: builder.query<TResponse<any>, { year?: number }>(
      {
        query: ({ year }) => ({
          url: `/dashboard/admin-user-overview?year=${year}`,
          method: 'GET',
          credentials: 'include',
        }),
        providesTags: ['Dashboard'],
      },
    ),

    getAdminEarningOverviewChart: builder.query<
      TResponse<any>,
      { year?: number }
    >({
      query: ({ year }) => ({
        url: `/dashboard/admin-earning-overview?year=${year}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetAdminDashboardStatsQuery,
  useGetAdminUserOverviewChartQuery,
  useGetAdminEarningOverviewChartQuery,
} = dashboardApi;
