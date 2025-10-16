import z from 'zod';

// ✅ Validation Schema
export const createPlanValidationSchema = z.object({
  name: z
    .string({ required_error: 'Plan name is required' })
    .min(3, 'Plan name must be at least 3 characters'),
  cost: z.number().min(0, 'Cost cannot be negative'),
  description: z
    .string({ required_error: 'Description is required' })
    .min(3, 'Plan description must be at least 12 characters'),
  features: z.object({
    teamMembers: z.boolean(),
    sharedCalendar: z.boolean(),
    taskHub: z.boolean(),
    grantPermissionAccess: z.boolean(),
  }),
  limits: z.object({
    serviceMax: z.number(),
    productMax: z.number(),
    highlightOfferMax: z.number(),
    transactionFee: z.number(),
  }),

  // ✅ validity as enum (not object)
  validity: z.enum(['free', '1month', '1year']),
});
