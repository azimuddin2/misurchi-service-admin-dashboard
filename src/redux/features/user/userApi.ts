import { IUser, TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<
      TResponse<IUser[]>,
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
          url: `/users?page=${page}&limit=${limit}&${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['User'],
    }),

    getUserById: builder.query<TResponse<IUser>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const { useGetAllUsersQuery, useGetUserByIdQuery } = userApi;
