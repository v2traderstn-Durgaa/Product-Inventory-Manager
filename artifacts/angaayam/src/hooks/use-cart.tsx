import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  weight?: string;
  image?: string;
  slug: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: { id: string; name: string; price: number | string; salePrice?: number | string | null; images?: string[]; slug: string }, quantity: number, weightOption?: { weight: string; price: number }) => void;
  removeItem: (productId: string, weight?: string) => void;
  updateQuantity: (productId: string, quantity: number, weight?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("angaayam_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("angaayam_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (
    product: { id: string; name: string; price: number | string; salePrice?: number | string | null; images?: string[]; slug: string },
    quantity: number,
    weightOption?: { weight: string; price: number }
  ) => {
    setItems(current => {
      const price = weightOption?.price ?? Number(product.salePrice ?? product.price);
      const weight = weightOption?.weight;
      const existingIndex = current.findIndex(i => i.productId === product.id && i.weight === weight);

      if (existingIndex >= 0) {
        const newItems = [...current];
        newItems[existingIndex] = { ...newItems[existingIndex], quantity: newItems[existingIndex].quantity + quantity };
        return newItems;
      }

      return [...current, {
        productId: product.id,
        name: product.name,
        price,
        quantity,
        weight,
        image: product.images?.[0],
        slug: product.slug,
      }];
    });
  };

  const removeItem = (productId: string, weight?: string) => {
    setItems(current => current.filter(i => !(i.productId === productId && i.weight === weight)));
  };

  const updateQuantity = (productId: string, quantity: number, weight?: string) => {
    if (quantity <= 0) {
      removeItem(productId, weight);
      return;
    }
    setItems(current => current.map(i =>
      (i.productId === productId && i.weight === weight) ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => setItems([]);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error("useCart must be used within a CartProvider");
  return context;
}
