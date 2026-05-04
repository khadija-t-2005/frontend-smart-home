import { useState, useEffect } from 'react';
import { getImageSrc } from '../utils/imageHelper';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import productService from '../services/product.service';
import cartService from '../services/cart.service';
import variantService from '../services/variant.service';
import reviewService from '../services/review.service';
import type { ReviewResponseDTO } from '../services/review.service';
import type { ProductVariantDTO } from '../services/variant.service';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import {
  ArrowLeft, ShoppingCart, Star, Heart, Minus, Plus,
  Shield, Truck, RefreshCw, Check
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user    = useAuthStore((s) => s.user);
  const setCart = useCartStore((s) => s.setCart);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantDTO | null>(null);
  const [quantity,  setQuantity]  = useState(1);
  const [adding,    setAdding]    = useState(false);
  const [added,     setAdded]     = useState(false);
  const [favorited,    setFavorited]    = useState(false);
  const [reviewText,   setReviewText]   = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting,   setSubmitting]   = useState(false);
  const [reviewError,  setReviewError]  = useState('');

  // ── Produit ──
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await productService.getById(Number(id));
      return res.data;
    },
  });

  // ── Variants ──
  const { data: variants = [] } = useQuery({
    queryKey: ['variants', id],
    queryFn: async () => {
      const res = await variantService.getVariants(Number(id));
      return res.data;
    },
  });

  // Sélectionne le premier variant automatiquement
  useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]);
    }
  }, [variants]);

  // ── Reviews ──
  const { data: reviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const res = await reviewService.getByProduct(Number(id));
      return res.data;
    },
  });

  const { data: avgRating = 0 } = useQuery({
    queryKey: ['rating', id],
    queryFn: async () => {
      const res = await reviewService.getAverageRating(Number(id));
      return res.data;
    },
  });

  const handleSubmitReview = async () => {
    if (!user) { navigate('/login'); return; }
    if (!reviewText.trim()) { setReviewError('Veuillez écrire un commentaire'); return; }
    setSubmitting(true);
    setReviewError('');
    try {
      await reviewService.create({
        productId: Number(id),
        userId: Number(user.id),
        username: user.email.split('@')[0],
        comment: reviewText,
        rating: reviewRating,
      });
      setReviewText('');
      setReviewRating(5);
      refetchReviews();
    } catch {
      setReviewError('Erreur lors de la publication');
    } finally {
      setSubmitting(false);
    }
  };

  const currentImage = selectedVariant?.imageUrl || product?.imageUrl;
  const currentStock = selectedVariant?.stockQuantity ?? product?.stockQuantity ?? 0;

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    try {
      const res = await cartService.addToCart(
        Number(user.id),
        Number(id),
        quantity,
        selectedVariant?.id  // ✅ envoie le variantId choisi
      );
      setCart(res.data);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      alert("Erreur lors de l'ajout au panier");
    } finally {
      setAdding(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#f4f7f8]">
      <Navbar />
      <div className="flex justify-center items-center h-96">
        <div className="w-12 h-12 border-4 border-[#4a9aaa] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-[#f4f7f8]">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-[#1a2f38]/50 text-lg">Produit introuvable</p>
        <Link to="/products" className="text-[#4a9aaa] font-semibold hover:underline">
          Retour aux produits
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7f8]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-[#4a9aaa] transition">Accueil</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#4a9aaa] transition">Produits</Link>
          <span>/</span>
          <span className="text-[#1a2f38] font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#1a2f38]/60 hover:text-[#4a9aaa] transition mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

          {/* ── COLONNE GAUCHE : Images ── */}
          <div className="space-y-4">
            {/* Image principale */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-50 h-96 flex items-center justify-center">
              {currentImage ? (
                <img
                  src={getImageSrc(currentImage)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              ) : (
                <span className="text-6xl">📦</span>
              )}
              <button
                onClick={() => setFavorited(!favorited)}
                className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:scale-110 transition-all"
              >
                <Heart size={18} className={favorited ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
              </button>
              {selectedVariant && (
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: selectedVariant.colorHex }} />
                  <span className="text-xs font-semibold text-[#1a2f38]">{selectedVariant.color}</span>
                </div>
              )}
            </div>

            {/* Miniatures couleurs */}
            {variants.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`relative rounded-xl overflow-hidden h-24 border-2 transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-[#4a9aaa] shadow-md scale-95'
                        : 'border-gray-200 hover:border-[#4a9aaa]/50'
                    }`}
                  >
                    {v.imageUrl ? (
                      <img src={getImageSrc(v.imageUrl)} alt={v.color}
                        className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: v.colorHex + '33' }}>
                        <div className="w-8 h-8 rounded-full border-2 border-white shadow"
                          style={{ backgroundColor: v.colorHex }} />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-black/40 text-white text-[10px] font-bold text-center py-1">
                      {v.color}
                    </div>
                    {selectedVariant?.id === v.id && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#4a9aaa] rounded-full flex items-center justify-center">
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── COLONNE DROITE : Infos + Actions ── */}
          <div className="flex flex-col">
            {/* Catégorie */}
            {product.categoryName && (
              <span className="text-xs font-bold tracking-widest text-[#4a9aaa] uppercase mb-3">
                {product.categoryName}
              </span>
            )}

            {/* Nom */}
            <h1 className="text-3xl font-black text-[#1a2f38] leading-tight mb-4">
              {product.name}
            </h1>

            {/* Étoiles */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#4a9aaa" stroke="none" />)}
              </div>
              <span className="text-sm text-gray-400">(24 avis)</span>
            </div>

            {/* Prix */}
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black text-[#4a9aaa]">
                {product.price.toLocaleString('fr-MA')}
              </span>
              <span className="text-lg text-gray-400">DH</span>
            </div>

            {/* Description */}
            <p className="text-[#1a2f38]/65 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Sélection couleur */}
            {variants.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-bold text-[#1a2f38] mb-3">
                  Couleur : <span className="text-[#4a9aaa]">{selectedVariant?.color}</span>
                </p>
                <div className="flex gap-3 flex-wrap">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      title={v.color}
                      className={`w-9 h-9 rounded-full border-4 transition-all hover:scale-110 ${
                        selectedVariant?.id === v.id
                          ? 'border-[#4a9aaa] scale-110 shadow-lg'
                          : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: v.colorHex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantité */}
            <div className="mb-6">
              <p className="text-sm font-bold text-[#1a2f38] mb-3">Quantité</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-[#1a2f38] hover:bg-gray-50 transition"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-6 py-3 font-black text-[#1a2f38] text-lg border-x border-gray-200 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="px-4 py-3 text-[#1a2f38] hover:bg-gray-50 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-gray-400">
                  {currentStock > 0
                    ? `${currentStock} disponible${currentStock > 1 ? 's' : ''}`
                    : 'Rupture de stock'}
                </span>
              </div>
            </div>

            {/* Bouton Ajouter */}
            <button
              onClick={handleAddToCart}
              disabled={currentStock === 0 || adding}
              className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-white text-base transition-all ${
                added
                  ? 'bg-green-500'
                  : currentStock === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#1a2f38] hover:bg-[#4a9aaa] active:scale-95'
              }`}
            >
              {added ? (
                <><Check size={20} /> Ajouté au panier !</>
              ) : adding ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><ShoppingCart size={20} />
                  {currentStock === 0 ? 'Rupture de stock' : `Ajouter au panier · ${(product.price * quantity).toLocaleString('fr-MA')} DH`}
                </>
              )}
            </button>

            {/* Garanties */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
              {[
                { icon: Truck,     label: 'Livraison 24h',    sub: 'Dès 500 DH' },
                { icon: Shield,    label: 'Garantie 2 ans',   sub: 'Pièces & main d\'œuvre' },
                { icon: RefreshCw, label: 'Retour 30 jours',  sub: 'Sans condition' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1.5">
                  <div className="w-10 h-10 bg-[#e6f4f6] rounded-2xl flex items-center justify-center">
                    <Icon size={18} className="text-[#4a9aaa]" />
                  </div>
                  <p className="text-xs font-bold text-[#1a2f38]">{label}</p>
                  <p className="text-[10px] text-gray-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION AVIS ── */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-[#1a2f38] mb-1">Avis clients</h2>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={16}
                      fill={i <= Math.round(avgRating) ? '#4a9aaa' : '#e5e7eb'}
                      stroke="none" />
                  ))}
                </div>
                <span className="text-[#4a9aaa] font-bold">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</span>
                <span className="text-gray-400 text-sm">({reviews.length} avis)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Formulaire */}
            <div>
              <h3 className="font-bold text-[#1a2f38] mb-5">Laisser un avis</h3>
              {!user && (
                <div className="bg-[#f4f7f8] rounded-2xl p-4 mb-4 text-sm text-[#1a2f38]/60">
                  <Link to="/login" className="text-[#4a9aaa] font-semibold">Connectez-vous</Link> pour laisser un avis.
                </div>
              )}
              {user && (
                <div className="space-y-4">
                  {/* Étoiles interactives */}
                  <div>
                    <p className="text-sm font-semibold text-[#1a2f38] mb-2">Note</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <button key={i} onClick={() => setReviewRating(i)}
                          className="hover:scale-125 transition-transform">
                          <Star size={28}
                            fill={i <= reviewRating ? '#4a9aaa' : '#e5e7eb'}
                            stroke="none" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Commentaire */}
                  <div>
                    <p className="text-sm font-semibold text-[#1a2f38] mb-2">Commentaire</p>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={4}
                      placeholder="Partagez votre expérience avec ce produit..."
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9aaa] resize-none"
                    />
                  </div>

                  {reviewError && (
                    <p className="text-red-500 text-sm">{reviewError}</p>
                  )}

                  <button
                    onClick={handleSubmitReview}
                    disabled={submitting}
                    className="bg-[#1a2f38] text-white font-bold px-8 py-3 rounded-2xl hover:bg-[#4a9aaa] transition disabled:opacity-50"
                  >
                    {submitting ? 'Publication...' : 'Publier mon avis'}
                  </button>
                </div>
              )}
            </div>

            {/* Liste des avis */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Star size={40} className="text-gray-200 mb-3" />
                  <p className="text-[#1a2f38]/50">Aucun avis pour ce produit.</p>
                  <p className="text-sm text-gray-400">Soyez le premier à donner votre avis !</p>
                </div>
              ) : (
                reviews.map((review: ReviewResponseDTO) => (
                  <div key={review.id} className="bg-[#f4f7f8] rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#4a9aaa]/20 flex items-center justify-center font-black text-[#4a9aaa] text-sm">
                          {review.username?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                          <p className="font-bold text-[#1a2f38] text-sm">{review.username}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString('fr-MA', {
                              day: 'numeric', month: 'long', year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} size={12}
                            fill={i <= review.rating ? '#4a9aaa' : '#e5e7eb'}
                            stroke="none" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#1a2f38]/70 leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}