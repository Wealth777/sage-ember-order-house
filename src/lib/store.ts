/**
 * Demo data store. Data lives in the browser (localStorage) so the prototype
 * works with no server. Every tab shares the same data and updates live, while
 * each tab keeps its own signed-in user (sessionStorage) — so you can be a
 * customer in one tab and staff in another.
 *
 * To move to a real backend, replace the functions in src/services/* with API
 * calls; components only talk to those services and the hooks below.
 */
import { useSyncExternalStore } from "react";
import { createSeed, DB_VERSION } from "@/data/mock-data";
import type { CartLine, DbState } from "./types";

const DB_KEY = "se-demo-db";
const CART_KEY = "se-demo-cart";
const SESSION_KEY = "se-demo-session";

const isBrowser = typeof window !== "undefined";
const listeners = new Set<() => void>();
let seedCache: DbState | null = null;
let dbCache: DbState | null = null;
let cartCache: CartLine[] | null = null;
let sessionCache: string | null | undefined;
let storageBound = false;

const EMPTY_CART: CartLine[] = [];

function seed() {
  return (seedCache ??= createSeed());
}

function emit() {
  for (const l of listeners) l();
}

function bindStorage() {
  if (storageBound || !isBrowser) return;
  storageBound = true;
  window.addEventListener("storage", (e) => {
    if (e.key === DB_KEY) dbCache = null;
    else if (e.key === CART_KEY) cartCache = null;
    else if (e.key === null) {
      dbCache = null;
      cartCache = null;
    } else return;
    emit();
  });
}

export function subscribe(listener: () => void) {
  bindStorage();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function readDb(): DbState {
  if (!isBrowser) return seed();
  if (dbCache) return dbCache;
  try {
    const raw = localStorage.getItem(DB_KEY);
    const parsed = raw ? (JSON.parse(raw) as DbState) : null;
    if (parsed && parsed.version === DB_VERSION) {
      dbCache = parsed;
      return parsed;
    }
  } catch {
    // fall through to a fresh seed
  }
  dbCache = createSeed();
  localStorage.setItem(DB_KEY, JSON.stringify(dbCache));
  return dbCache;
}

export function writeDb(update: (db: DbState) => DbState) {
  const next = update(readDb());
  dbCache = next;
  localStorage.setItem(DB_KEY, JSON.stringify(next));
  emit();
}

export function readCart(): CartLine[] {
  if (!isBrowser) return EMPTY_CART;
  if (cartCache) return cartCache;
  try {
    cartCache = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]") as CartLine[];
  } catch {
    cartCache = [];
  }
  return cartCache;
}

export function writeCart(next: CartLine[]) {
  cartCache = next;
  localStorage.setItem(CART_KEY, JSON.stringify(next));
  emit();
}

export function readSession(): string | null {
  if (!isBrowser) return null;
  if (sessionCache === undefined) sessionCache = sessionStorage.getItem(SESSION_KEY);
  return sessionCache;
}

export function writeSession(userId: string | null) {
  sessionCache = userId;
  if (userId) sessionStorage.setItem(SESSION_KEY, userId);
  else sessionStorage.removeItem(SESSION_KEY);
  emit();
}

/** Wipe all demo changes and start again from the sample data. */
export function resetDemo() {
  localStorage.removeItem(DB_KEY);
  localStorage.removeItem(CART_KEY);
  dbCache = null;
  cartCache = null;
  writeSession(null);
}

// ---- React hooks ----

export function useDb(): DbState {
  return useSyncExternalStore(subscribe, readDb, seed);
}

export function useCartLines(): CartLine[] {
  return useSyncExternalStore(subscribe, readCart, () => EMPTY_CART);
}

export function useSessionUserId(): string | null {
  return useSyncExternalStore(subscribe, readSession, () => null);
}

const noop = () => () => {};
/** False during server render and hydration, true afterwards. */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
