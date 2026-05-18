import z from 'zod';

// ✅ unlimited support
const serviceProductMaxSchema = z.union([
  z.number().min(0),
  z.literal('unlimited'),
]);

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
    serviceMax: serviceProductMaxSchema,
    productMax: serviceProductMaxSchema,
    highlightOfferMax: z.number(),
    transactionFee: z.number(),
  }),
  validity: z.enum(['free', '1month', '1year']),
});
