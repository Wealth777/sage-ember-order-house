import { readDb, writeDb } from "@/lib/store";
import type { Category, MenuItem, User } from "@/lib/types";
import { withLog } from "./activity";

const id = (p: string) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export type MenuItemInput = Omit<MenuItem, "id">;

function validateItem(input: MenuItemInput) {
  if (!input.name.trim()) throw new Error("Please give the dish a name.");
  if (!(input.price > 0)) throw new Error("Price must be greater than zero.");
  if (!input.categoryId) throw new Error("Please choose a category.");
}

export function createMenuItem(admin: User, input: MenuItemInput) {
  validateItem(input);
  const item: MenuItem = { ...input, id: id("m"), name: input.name.trim() };
  writeDb((d) => ({
    ...d,
    menuItems: [...d.menuItems, item],
    activity: withLog(d, admin, "Menu item created", `Added ${item.name} to the menu`),
  }));
  return item;
}

export function updateMenuItem(admin: User, itemId: string, input: MenuItemInput) {
  validateItem(input);
  writeDb((d) => ({
    ...d,
    menuItems: d.menuItems.map((m) => (m.id === itemId ? { ...input, id: itemId, name: input.name.trim() } : m)),
    activity: withLog(d, admin, "Menu item updated", `Updated ${input.name.trim()}`),
  }));
}

export function setItemAvailability(admin: User, itemId: string, available: boolean) {
  const item = readDb().menuItems.find((m) => m.id === itemId);
  if (!item) return;
  writeDb((d) => ({
    ...d,
    menuItems: d.menuItems.map((m) => (m.id === itemId ? { ...m, available } : m)),
    activity: withLog(d, admin, "Menu item updated", `Marked ${item.name} as ${available ? "available" : "sold out"}`),
  }));
}

export function deleteMenuItem(admin: User, itemId: string) {
  const item = readDb().menuItems.find((m) => m.id === itemId);
  if (!item) return;
  writeDb((d) => ({
    ...d,
    menuItems: d.menuItems.filter((m) => m.id !== itemId),
    activity: withLog(d, admin, "Menu item deleted", `Removed ${item.name} from the menu`),
  }));
}

export function saveCategory(admin: User, input: { id?: string; name: string; description: string }) {
  const name = input.name.trim();
  if (!name) throw new Error("Please give the category a name.");
  const db = readDb();
  if (db.categories.some((c) => c.name.toLowerCase() === name.toLowerCase() && c.id !== input.id)) {
    throw new Error("A category with this name already exists.");
  }
  if (input.id) {
    const existingId = input.id;
    writeDb((d) => ({
      ...d,
      categories: d.categories.map((c) => (c.id === existingId ? { ...c, name, description: input.description.trim() } : c)),
      activity: withLog(d, admin, "Category updated", `Updated category ${name}`),
    }));
  } else {
    const cat: Category = { id: id("cat"), name, description: input.description.trim() };
    writeDb((d) => ({
      ...d,
      categories: [...d.categories, cat],
      activity: withLog(d, admin, "Category created", `Added category ${name}`),
    }));
  }
}

export function deleteCategory(admin: User, categoryId: string) {
  const db = readDb();
  const cat = db.categories.find((c) => c.id === categoryId);
  if (!cat) return;
  const count = db.menuItems.filter((m) => m.categoryId === categoryId).length;
  if (count > 0) throw new Error(`Move or remove the ${count} dish${count > 1 ? "es" : ""} in ${cat.name} first.`);
  writeDb((d) => ({
    ...d,
    categories: d.categories.filter((c) => c.id !== categoryId),
    activity: withLog(d, admin, "Category deleted", `Removed category ${cat.name}`),
  }));
}
