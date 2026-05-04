import api from '../middleware/axios.interceptor';

export interface CartItemDTO {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  variantId?: number;
  variantColor?: string;
  variantImageUrl?: string;
}

export interface CartDTO {
  id: number;
  userId: number;
  items: CartItemDTO[];
}

export interface AddToCartDTO {
  productId: number;
  variantId?: number;
  quantity: number;
}

const cartService = {
  getCart: (userId: number) =>
    api.get<CartDTO>(`/cart/${userId}`),

  // ✅ Accepte maintenant variantId
  addToCart: (userId: number, productId: number, quantity: number, variantId?: number) =>
    api.post<CartDTO>(`/cart/${userId}/add`, { productId, variantId, quantity } as AddToCartDTO),

  removeItem: (cartItemId: number) =>
    api.delete(`/cart/item/${cartItemId}`),

  clearCart: (userId: number) =>
    api.delete(`/cart/${userId}/clear`),
};

export default cartService;