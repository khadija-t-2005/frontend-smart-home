import api from '../middleware/axios.interceptor';

export interface ReviewCreateDTO {
  productId: number;
  userId: number;
  username: string;
  comment: string;
  rating: number;
}

export interface ReviewResponseDTO {
  id: string;
  productId: number;
  userId: number;
  username: string;
  comment: string;
  rating: number;
  createdAt: string;
}

const reviewService = {
  // GET /api/reviews/product/:productId
  getByProduct: (productId: number) =>
    api.get<ReviewResponseDTO[]>(`/reviews/product/${productId}`),

  // GET /api/reviews/product/:productId/rating
  getAverageRating: (productId: number) =>
    api.get<number>(`/reviews/product/${productId}/rating`),

  // POST /api/reviews
  create: (dto: ReviewCreateDTO) =>
    api.post<ReviewResponseDTO>('/reviews', dto),

  // DELETE /api/reviews/:id
  delete: (id: string) =>
    api.delete(`/reviews/${id}`),
};

export default reviewService;