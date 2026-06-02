export interface CartItem {
  slug: string;
  title: string;
  price: number;
  hours: number;
  ects: number;
  packEligible: boolean;
  icon: string;
}

export interface CartTotals {
  items: CartItem[];
  packCount: number;
  subtotal: number;
  discount: number;
  total: number;
  packApplied: boolean;
}

const STORAGE_KEY = 'educavocacion_cart';

function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart:updated'));
}

export function addItem(item: CartItem): void {
  const items = getStoredCart();
  if (items.some(i => i.slug === item.slug)) return;
  items.push(item);
  saveCart(items);
}

export function removeItem(slug: string): void {
  saveCart(getStoredCart().filter(i => i.slug !== slug));
}

export function clearCart(): void {
  saveCart([]);
}

export function getItems(): CartItem[] {
  return getStoredCart();
}

export function hasItem(slug: string): boolean {
  return getStoredCart().some(i => i.slug === slug);
}

export function getItemCount(): number {
  return getStoredCart().length;
}

export function getTotals(): CartTotals {
  const items = getStoredCart();
  const packItems = items.filter(i => i.packEligible);
  const nonPackItems = items.filter(i => !i.packEligible);

  const packPairs = Math.floor(packItems.length / 2);
  const packRemainder = packItems.length % 2;

  // Precio normal de todos los items
  const normalTotal =
    nonPackItems.reduce((s, i) => s + i.price, 0) +
    packItems.reduce((s, i) => s + i.price, 0);

  // Precio con pack: pares a 40 €, impar a precio normal
  const packTotal =
    nonPackItems.reduce((s, i) => s + i.price, 0) +
    packPairs * 40 +
    (packRemainder > 0 ? packItems[packItems.length - 1].price : 0);

  const discount = packItems.length >= 2 ? normalTotal - packTotal : 0;

  return {
    items,
    packCount: packItems.length,
    subtotal: normalTotal,
    discount,
    total: packTotal,
    packApplied: packItems.length >= 2,
  };
}
