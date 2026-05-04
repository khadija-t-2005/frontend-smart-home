import api from '../middleware/axios.interceptor';

export interface ProductVariantDTO {
  id: number;
  productId: number;
  color: string;
  colorHex: string;
  imageUrl: string;
  stockQuantity: number;
}

const variantService = {
  // GET /api/products/:productId/variants
  getVariants: (productId: number) =>
    api.get<ProductVariantDTO[]>(`/products/${productId}/variants`),
};

export default variantService;