import { TResponse } from '@/types';
import { baseApi } from '../../api/baseApi';
import { TSubscriptionPlan } from '@/types/subscription.type';

const subscriptionPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSubscriptionPlan: builder.mutation<
      TResponse<TSubscriptionPlan>,
      Partial<any>
    >({
      query: (planData) => ({
        url: '/plans',
        method: 'POST',
        body: planData,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['SubscriptionPlan'],
    }),

    getAllSubscriptionPlans: builder.query<TResponse<TSubscriptionPlan[]>, {}>({
      query: () => ({
        url: `/plans`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['SubscriptionPlan'],
    }),

    getSubscriptionPlanById: builder.query<
      TResponse<TSubscriptionPlan>,
      string
    >({
      query: (id) => ({
        url: `/plans/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['SubscriptionPlan'],
    }),

    updateSubscriptionPlan: builder.mutation<
      TResponse<TSubscriptionPlan>,
      { id: string; data: Partial<TSubscriptionPlan> }
    >({
      query: ({ id, data }) => ({
        url: `/plans/${id}`,
        method: 'PATCH',
        body: data,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['SubscriptionPlan'],
    }),

    deleteSubscriptionPlan: builder.mutation<
      TResponse<TSubscriptionPlan>,
      string
    >({
      query: (id) => ({
        url: `/plans/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['SubscriptionPlan'],
    }),
  }),
});

export const {
  useAddSubscriptionPlanMutation,
  useGetAllSubscriptionPlansQuery,
  useGetSubscriptionPlanByIdQuery,
  useUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
} = subscriptionPlanApi;
