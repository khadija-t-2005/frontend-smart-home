// Review and Rating types

export interface ReviewDTO {
  id: string;
  productId: string;
  userId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  updatedAt: string;
  userName?: string;
  userAvatar?: string;
}

export interface ProductRatingDTO {
  productId: string;
  averageRating: number; // 0-5
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number; // 1: 10, 2: 5, 3: 15, 4: 20, 5: 50
  };
}

export interface CreateReviewDTO {
  rating: number;
  comment: string;
}

export interface ReviewPageDTO {
  content: ReviewDTO[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
