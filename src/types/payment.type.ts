import { TBooking } from './booking.type';
import { TOrder } from './order.type';
import { TSubscriptionPlan } from './subscription.type';
import { IUser, TVendorUser } from './user.type';

// Subscription Payment
export type TSubPayment = {
  _id: string;
  user: IUser;
  vendor: TVendorUser;
  plan: TSubscriptionPlan;
  subscription?: string;
  durationType: 'monthly' | 'yearly';
  amount: number;
  tranId: string;
  isPaid: boolean;
  paidAt: Date;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

//  Payment
export type TStatus = 'pending' | 'paid' | 'refunded';

export type TDeliveryStatus = 'pending' | 'ongoing' | 'shipped' | 'delivered';

export enum PAYMENT_MODEL_TYPE {
  Order = 'Order',
  Booking = 'Booking',
}

export type TPayment = {
  _id: string;
  user: IUser;
  vendor: TVendorUser;

  modelType: string;
  reference: TOrder | TBooking;

  status: TStatus;

  deliveryStatus?: TDeliveryStatus;

  trnId: string;
  adminAmount: number;
  vendorAmount: number;
  paymentIntentId: string;
  price: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
