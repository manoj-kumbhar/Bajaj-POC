export interface OrderItem {
  productId: string; // ObjectId as string
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentInfo {
  method: string; // e.g., 'Credit Card' | 'UPI'
  status: string; // e.g., 'Paid'
  transactionId: string;
}

export interface Order {
  _id: string; // ObjectId as string
  userId: string; // ObjectId as string
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  payment: PaymentInfo;
  orderStatus: string; // default 'Pending' | 'Shipped' etc.
  totalAmount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}


