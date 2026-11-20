import { readCart, writeCart } from "@/lib/store";

export function addToCart(itemId: string, quantity = 1) {
  const cart = readCart();
  const line = cart.find((l) => l.itemId === itemId);
  writeCart(
    line
      ? cart.map((l) => (l.itemId === itemId ? { ...l, quantity: l.quantity + quantity } : l))
      : [...cart, { itemId, quantity }],
  );
}

export function setQuantity(itemId: string, quantity: number) {
  const cart = readCart();
  writeCart(
    quantity <= 0
      ? cart.filter((l) => l.itemId !== itemId)
      : cart.map((l) => (l.itemId === itemId ? { ...l, quantity } : l)),
  );
}

export function removeFromCart(itemId: string) {
  writeCart(readCart().filter((l) => l.itemId !== itemId));
}

export function clearCart() {
  writeCart([]);
}
