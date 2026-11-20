/**
 * Sample data for the demo. Everything here is replaceable: when a real backend
 * is connected, these seeds go away and the services read from the API instead.
 */
import type {
  ActivityLog,
  Category,
  DbState,
  MenuItem,
  Order,
  OrderLine,
  OrderStatus,
  Role,
  StatusChange,
  User,
} from "@/lib/types";
import { STATUS_FLOW } from "@/lib/order-workflow";
import { RESTAURANT } from "@/lib/config";

export const DB_VERSION = 1;
export const DEMO_PASSWORD = "demo1234";

export const DEMO_ACCOUNTS: { role: Role; email: string; label: string; blurb: string }[] = [
  { role: "customer", email: "ada@example.com", label: "Customer", blurb: "Browse, order and track" },
  { role: "staff", email: "kunle@sageember.com", label: "Staff", blurb: "Run the kitchen queue" },
  { role: "admin", email: "ngozi@sageember.com", label: "Admin", blurb: "Oversee the business" },
];

const categories: Category[] = [
  { id: "cat-starters", name: "Starters", description: "Small plates to share" },
  { id: "cat-grill", name: "From the Grill", description: "Wood-fired over open flame" },
  { id: "cat-mains", name: "Mains", description: "Hearty signature plates" },
  { id: "cat-pasta", name: "Pasta", description: "Made fresh every morning" },
  { id: "cat-salads", name: "Salads & Bowls", description: "Bright, seasonal greens" },
  { id: "cat-desserts", name: "Desserts", description: "A sweet finish" },
  { id: "cat-drinks", name: "Drinks", description: "Pressed, brewed and poured" },
];

export const SEED_MENU_ITEMS: MenuItem[] = [
  { id: "m-calamari", name: "Crispy Calamari", categoryId: "cat-starters", price: 7500, image: "calamari", description: "Lightly dusted squid, flash-fried and served with lemon and a smoked garlic aioli.", available: true, popular: true, prepMinutes: 12, calories: 420, tags: ["Seafood", "Shareable"] },
  { id: "m-burrata", name: "Burrata & Heirloom Tomato", categoryId: "cat-starters", price: 9000, image: "burrata", description: "Creamy burrata over heirloom tomatoes, torn basil, cold-pressed olive oil and flaky salt.", available: true, popular: false, prepMinutes: 8, calories: 380, tags: ["Vegetarian"] },
  { id: "m-skewers", name: "Spiced Beef Skewers", categoryId: "cat-grill", price: 8500, image: "skewers", description: "Char-grilled beef in a smoky pepper rub, with pickled red onion and fresh tomato.", available: true, popular: true, prepMinutes: 15, calories: 510, tags: ["Spicy", "Gluten free"] },
  { id: "m-ribeye", name: "Ribeye & Chimichurri", categoryId: "cat-grill", price: 28000, image: "ribeye", description: "300g grass-fed ribeye, fire-roasted vegetables and a punchy herb chimichurri.", available: true, popular: true, prepMinutes: 25, calories: 890, tags: ["Signature", "Gluten free"] },
  { id: "m-burger", name: "Ember Smash Burger", categoryId: "cat-grill", price: 12500, image: "burger", description: "Two smashed beef patties, aged cheddar, house pickles and brioche, with hand-cut fries.", available: true, popular: true, prepMinutes: 15, calories: 1050, tags: ["Comfort"] },
  { id: "m-chicken", name: "Herb-Roasted Half Chicken", categoryId: "cat-mains", price: 16500, image: "chicken", description: "Free-range chicken brined overnight, roasted with rosemary and served with crushed potatoes.", available: true, popular: false, prepMinutes: 22, calories: 780, tags: ["Gluten free"] },
  { id: "m-salmon", name: "Pan-Seared Salmon", categoryId: "cat-mains", price: 22000, image: "salmon", description: "Crisp-skinned salmon fillet, charred asparagus and a lemon brown-butter sauce.", available: true, popular: true, prepMinutes: 18, calories: 640, tags: ["Seafood", "Gluten free"] },
  { id: "m-tagliatelle", name: "Truffle Mushroom Tagliatelle", categoryId: "cat-pasta", price: 14500, image: "tagliatelle", description: "Fresh egg tagliatelle, wild mushrooms, black truffle cream and aged parmesan.", available: true, popular: false, prepMinutes: 16, calories: 720, tags: ["Vegetarian"] },
  { id: "m-linguine", name: "Garlic Prawn Linguine", categoryId: "cat-pasta", price: 15500, image: "linguine", description: "Tiger prawns, chilli, garlic, blistered cherry tomatoes and parsley over linguine.", available: true, popular: true, prepMinutes: 16, calories: 690, tags: ["Seafood", "Spicy"] },
  { id: "m-caesar", name: "Grilled Chicken Caesar", categoryId: "cat-salads", price: 9500, image: "caesar", description: "Crisp romaine, grilled chicken, sourdough croutons and our anchovy-parmesan dressing.", available: true, popular: false, prepMinutes: 10, calories: 560, tags: [] },
  { id: "m-quinoa", name: "Green Goddess Quinoa Bowl", categoryId: "cat-salads", price: 8500, image: "quinoa", description: "Tri-colour quinoa, avocado, roasted chickpeas, kale slaw and tahini dressing.", available: true, popular: false, prepMinutes: 10, calories: 520, tags: ["Vegan", "Gluten free"] },
  { id: "m-lava", name: "Molten Chocolate Cake", categoryId: "cat-desserts", price: 6500, image: "lava-cake", description: "Dark chocolate cake with a molten centre, vanilla bean ice cream and raspberries.", available: true, popular: true, prepMinutes: 12, calories: 610, tags: ["Vegetarian"] },
  { id: "m-cheesecake", name: "Vanilla Bean Cheesecake", categoryId: "cat-desserts", price: 5500, image: "cheesecake", description: "Baked New York cheesecake on a brown-butter biscuit base with wild berry compote.", available: true, popular: false, prepMinutes: 5, calories: 540, tags: ["Vegetarian"] },
  { id: "m-lemonade", name: "Fresh Mint Lemonade", categoryId: "cat-drinks", price: 3000, image: "lemonade", description: "Hand-pressed lemons, garden mint and a touch of cane sugar over ice.", available: true, popular: false, prepMinutes: 3, calories: 120, tags: ["Vegan"] },
  { id: "m-hibiscus", name: "Iced Hibiscus Tea", categoryId: "cat-drinks", price: 2500, image: "hibiscus", description: "Chilled zobo-style hibiscus brew with orange, ginger and clove.", available: true, popular: true, prepMinutes: 3, calories: 90, tags: ["Vegan"] },
];

const DAY = 86_400_000;
const MIN = 60_000;

/** Small deterministic random generator so the sample data is stable. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function createSeed(now = Date.now()): DbState {
  const iso = (t: number) => new Date(t).toISOString();
  const rand = rng(42);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)] as T;

  const users: User[] = [
    { id: "u-admin", name: "Ngozi Williams", email: "ngozi@sageember.com", phone: "+234 803 555 0101", password: DEMO_PASSWORD, role: "admin", active: true, createdAt: iso(now - 120 * DAY) },
    { id: "u-staff-1", name: "Kunle Adebayo", email: "kunle@sageember.com", phone: "+234 803 555 0112", password: DEMO_PASSWORD, role: "staff", active: true, createdAt: iso(now - 90 * DAY) },
    { id: "u-staff-2", name: "Fatima Bello", email: "fatima@sageember.com", phone: "+234 803 555 0123", password: DEMO_PASSWORD, role: "staff", active: true, createdAt: iso(now - 64 * DAY) },
    { id: "u-staff-3", name: "James Okoro", email: "james@sageember.com", phone: "+234 803 555 0134", password: DEMO_PASSWORD, role: "staff", active: false, createdAt: iso(now - 40 * DAY) },
    { id: "u-cust-1", name: "Ada Nwosu", email: "ada@example.com", phone: "+234 809 555 0201", password: DEMO_PASSWORD, role: "customer", active: true, createdAt: iso(now - 30 * DAY) },
    { id: "u-cust-2", name: "David Mensah", email: "david@example.com", phone: "+234 809 555 0202", password: DEMO_PASSWORD, role: "customer", active: true, createdAt: iso(now - 26 * DAY) },
    { id: "u-cust-3", name: "Sarah Johnson", email: "sarah@example.com", phone: "+234 809 555 0203", password: DEMO_PASSWORD, role: "customer", active: true, createdAt: iso(now - 21 * DAY) },
    { id: "u-cust-4", name: "Ibrahim Musa", email: "ibrahim@example.com", phone: "+234 809 555 0204", password: DEMO_PASSWORD, role: "customer", active: true, createdAt: iso(now - 15 * DAY) },
    { id: "u-cust-5", name: "Grace Okafor", email: "grace@example.com", phone: "+234 809 555 0205", password: DEMO_PASSWORD, role: "customer", active: true, createdAt: iso(now - 9 * DAY) },
    { id: "u-cust-6", name: "Michael Chen", email: "michael@example.com", phone: "+234 809 555 0206", password: DEMO_PASSWORD, role: "customer", active: true, createdAt: iso(now - 4 * DAY) },
  ];
  const customers = users.filter((u) => u.role === "customer");
  const activeStaff = users.filter((u) => u.role === "staff" && u.active);

  const orders: Order[] = [];
  const activity: ActivityLog[] = [];
  let num = 1001;
  let logId = 1;
  const log = (u: User, action: string, description: string, at: number) =>
    activity.push({ id: `log-${logId++}`, userId: u.id, userName: u.name, role: u.role, action, description, createdAt: iso(at) });

  for (const c of customers) log(c, "Registered", `${c.name} created a customer account`, Date.parse(c.createdAt));
  for (const s of users.filter((u) => u.role === "staff"))
    log(users[0]!, "Staff account created", `Added ${s.name} to the team`, Date.parse(s.createdAt));

  // Live orders at the top of the queue, then a week of history.
  const live: { status: OrderStatus; minsAgo: number }[] = [
    { status: "pending", minsAgo: 2 },
    { status: "pending", minsAgo: 6 },
    { status: "confirmed", minsAgo: 11 },
    { status: "preparing", minsAgo: 17 },
    { status: "preparing", minsAgo: 24 },
    { status: "ready", minsAgo: 31 },
  ];
  const plan: { status: OrderStatus; at: number }[] = live.map((l) => ({ status: l.status, at: now - l.minsAgo * MIN }));
  for (let d = 0; d < 7; d++) {
    const count = 4 + Math.floor(rand() * 5);
    for (let i = 0; i < count; i++) {
      const at = now - d * DAY - (45 + Math.floor(rand() * 600)) * MIN;
      plan.push({ status: rand() < 0.1 ? "cancelled" : "completed", at });
    }
  }
  plan.sort((a, b) => a.at - b.at);

  for (const p of plan) {
    const customer = pick(customers);
    const staff = pick(activeStaff);
    const lineCount = 1 + Math.floor(rand() * 3);
    const lines: OrderLine[] = [];
    for (let i = 0; i < lineCount; i++) {
      const item = pick(SEED_MENU_ITEMS);
      const existing = lines.find((l) => l.itemId === item.id);
      if (existing) existing.quantity += 1;
      else lines.push({ itemId: item.id, name: item.name, price: item.price, quantity: 1 + Math.floor(rand() * 2), image: item.image });
    }
    const total = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    const code = `${RESTAURANT.shortCode}-${num++}`;
    const type = rand() < 0.55 ? "dine-in" : "pickup";

    const history: StatusChange[] = [{ status: "pending", at: iso(p.at), byName: customer.name, byRole: "customer" }];
    log(customer, "Order placed", `Placed order ${code} (${lines.length} item${lines.length > 1 ? "s" : ""})`, p.at);
    let t = p.at;
    if (p.status === "cancelled") {
      t += 4 * MIN;
      history.push({ status: "cancelled", at: iso(t), byName: customer.name, byRole: "customer" });
      log(customer, "Order cancelled", `Cancelled order ${code}`, t);
    } else {
      const target = STATUS_FLOW.indexOf(p.status);
      for (let i = 1; i <= target; i++) {
        t += (i === 1 ? 2 : 6 + Math.floor(rand() * 8)) * MIN;
        const s = STATUS_FLOW[i]!;
        history.push({ status: s, at: iso(Math.min(t, now - MIN)), byName: staff.name, byRole: "staff" });
        log(staff, i === 1 ? "Order accepted" : "Status updated", i === 1 ? `Accepted order ${code}` : `Moved ${code} to ${s}`, Math.min(t, now - MIN));
      }
    }
    const accepted = p.status !== "pending" && p.status !== "cancelled";
    orders.push({
      id: `o-${num - 1}`,
      code,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      items: lines,
      total,
      status: p.status,
      type,
      tableNumber: type === "dine-in" ? String(1 + Math.floor(rand() * 14)) : "",
      notes: rand() < 0.25 ? pick(["No onions, please", "Extra sauce on the side", "Celebrating a birthday!", "Allergic to nuts"]) : "",
      createdAt: iso(p.at),
      updatedAt: history[history.length - 1]!.at,
      staffId: accepted ? staff.id : null,
      staffName: accepted ? staff.name : null,
      history,
    });
  }

  const admin = users[0]!;
  log(admin, "Menu item updated", "Updated price of Ribeye & Chimichurri", now - 2 * DAY);
  log(admin, "Menu item created", "Added Iced Hibiscus Tea to Drinks", now - 3 * DAY);
  log(admin, "Staff account deactivated", "Deactivated James Okoro", now - 5 * DAY);

  activity.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  orders.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  return { version: DB_VERSION, users, categories, menuItems: SEED_MENU_ITEMS, orders, activity, nextOrderNumber: num };
}
