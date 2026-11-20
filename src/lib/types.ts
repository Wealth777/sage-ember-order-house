export type Role = "customer" | "staff" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** Demo only: a real backend stores a salted hash, never the password. */
  password: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  description: string;
  /** Key of a bundled photo (see src/data/images.ts) or a full image URL. */
  image: string;
  available: boolean;
  popular: boolean;
  prepMinutes: number;
  calories: number;
  tags: string[];
}

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderLine {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface StatusChange {
  status: OrderStatus;
  at: string;
  byName: string;
  byRole: Role;
}

export type OrderType = "dine-in" | "pickup";

export interface Order {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderLine[];
  total: number;
  status: OrderStatus;
  type: OrderType;
  tableNumber: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  staffId: string | null;
  staffName: string | null;
  history: StatusChange[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  role: Role;
  action: string;
  description: string;
  createdAt: string;
}

export interface CartLine {
  itemId: string;
  quantity: number;
}

export interface DbState {
  version: number;
  users: User[];
  categories: Category[];
  menuItems: MenuItem[];
  orders: Order[];
  activity: ActivityLog[];
  nextOrderNumber: number;
}
