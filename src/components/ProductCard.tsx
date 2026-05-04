import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import reviewService from '../services/review.service';
import variantService from '../services/variant.service';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    image_url?: string;
    categoryName?: string;
    category_name?: string;
    stockQuantity: number;
    stock_quantity?: number;
  };
  onAddToCart: (id: number) => void;
}

const ROOM_COLORS: Record<string, { bg: string; accent: string }> = {
  'salon':   { bg: '#f0f7f9', accent: '#4a9aaa' },
  'cuisine': { bg: '#fef6ee', accent: '#e07a2f' },
  'chambre': { bg: '#f5f0fb', accent: '#8b5cf6' },
  'entr':    { bg: '#f0faf0', accent: '#16a34a' },
  'salle':   { bg: '#eef8fe', accent: '#0ea5e9' },
  'bureau':  { bg: '#fdfaf0', accent: '#ca8a04' },
  'jardin':  { bg: '#f0faf0', accent: '#15803d' },
  'default': { bg: '#f0f7f9', accent: '#4a9aaa' },
};

function getRoomStyle(categoryName?: string) {
  if (!categoryName) return ROOM_COLORS['default'];
  const c = categoryName.toLowerCase();
  const key = Object.keys(ROOM_COLORS).find(k => c.includes(k));
  return ROOM_COLORS[key ?? 'default'];
}

function getCategoryEmoji(cat: string): string {
  const c = cat.toLowerCase();
  if (c.includes('salon'))   return '🛋️';
  if (c.includes('cuisine')) return '🍳';
  if (c.includes('chambre')) return '🛏️';
  if (c.includes('entr'))    return '🚪';
  if (c.includes('salle'))   return '🚿';
  if (c.includes('bureau'))  return '💼';
  if (c.includes('jardin'))  return '🌿';
  return '📦';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [favorited,  setFavorited]  = useState(false);
  const [adding,     setAdding]     = useState(false);
  const [avgRating,  setAvgRating]  = useState<number | null>(null);
  const [firstImage, setFirstImage] = useState<string | null>(null);

  const style   = getRoomStyle(product.categoryName || product.category_name);
  const stock   = product.stockQuantity ?? product.stock_quantity ?? 0;
  const catName = product.categoryName || product.category_name || '';
  const stars   = Math.round(avgRating ?? 0);

  // Récupère la note moyenne réelle
  useEffect(() => {
    reviewService.getAverageRating(product.id)
      .then(res => setAvgRating(res.data))
      .catch(() => setAvgRating(null));
  }, [product.id]);

  // Récupère la première image du premier variant
  useEffect(() => {
    variantService.getVariants(product.id)
      .then(res => {
        if (res.data.length > 0 && res.data[0].imageUrl) {
          setFirstImage(res.data[0].imageUrl);
        }
      })
      .catch(() => setFirstImage(null));
  }, [product.id]);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    await onAddToCart(product.id);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <Link to={`/products/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#4a9aaa]/40 hover:shadow-xl transition-all duration-300 flex flex-col">

      {/* Zone image */}
      <div className="relative overflow-hidden h-52 flex items-center justify-center"
        style={{ backgroundColor: style.bg }}>

        {firstImage ? (
          <img
            src={firstImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-6xl select-none opacity-50">
            {getCategoryEmoji(catName)}
          </span>
        )}

        {stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Rupture de stock
            </span>
          </div>
        )}

        {catName && (
          <span className="absolute top-3 left-3 bg-white/90 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ color: style.accent }}>
            {catName}
          </span>
        )}

        <button
          onClick={(e) => { e.preventDefault(); setFavorited(!favorited); }}
          className="absolute top-3 right-3 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
        >
          <Heart size={14} className={favorited ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
        </button>
      </div>

      {/* Infos */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-[#1a2f38] text-sm leading-snug mb-1 line-clamp-2 group-hover:text-[#4a9aaa] transition-colors">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Étoiles */}
        <div className="flex items-center gap-1 mb-4">
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={11}
              fill={i <= stars ? style.accent : '#e5e7eb'}
              stroke="none" />
          ))}
          {avgRating !== null && avgRating > 0
            ? <span className="text-xs text-gray-400 ml-1">{avgRating.toFixed(1)}</span>
            : <span className="text-xs text-gray-400 ml-1">Aucun avis</span>
          }
        </div>

        {/* Prix + CTA */}
        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-lg font-black" style={{ color: style.accent }}>
              {product.price.toLocaleString('fr-MA')}
            </span>
            <span className="text-sm text-gray-400 ml-1">DH</span>
          </div>

          <button
            onClick={handleAdd}
            disabled={stock === 0 || adding}
            className="flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            style={{ backgroundColor: adding ? style.accent : '#1a2f38' }}
          >
            <ShoppingCart size={13} />
            {adding ? 'Ajouté ✓' : 'Ajouter'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;