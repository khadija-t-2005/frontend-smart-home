import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import productService from '../services/product.service';
import cartService from '../services/cart.service';
import variantService from '../services/variant.service';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { Search, X, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Pertinence' },
  { value: 'price_asc',  label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'name_asc',   label: 'Nom A → Z' },
];

const ROOMS = [
  { key: 'tous',         label: 'Tous',        emoji: '🏠' },
  { key: 'salon',        label: 'Salon',       emoji: '🛋️' },
  { key: 'cuisine',      label: 'Cuisine',     emoji: '🍳' },
  { key: 'chambre',      label: 'Chambre',     emoji: '🛏️' },
  { key: 'entrée',       label: 'Entrée',      emoji: '🚪' },
  { key: 'salle de bain',label: 'Salle de bain', emoji: '🚿' },
  { key: 'bureau',       label: 'Bureau',      emoji: '💼' },
  { key: 'jardin',       label: 'Jardin',      emoji: '🌿' },
];

export default function ProductList() {
  const location = useLocation();
  const [search,     setSearch]     = useState(new URLSearchParams(location.search).get('search') || '');
  const [inputValue, setInputValue] = useState(new URLSearchParams(location.search).get('search') || '');
  const [sortBy,     setSortBy]     = useState('default');
  const [maxPrice,   setMaxPrice]   = useState<number | ''>('');
  const [activeRoom, setActiveRoom] = useState('tous');

  const user    = useAuthStore((s) => s.user);
  const setCart = useCartStore((s) => s.setCart);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('search') || '';
    setSearch(q); setInputValue(q);
  }, [location.search]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', search],
    queryFn: async () => {
      const res = search
        ? await productService.searchByName(search)
        : await productService.getAll();
      return res.data;
    },
  });

  // 🆕 Fonction corrigée pour ajouter au panier avec variantId
  const handleAddToCart = async (productId: number) => {
    if (!user) { window.location.href = '/login'; return; }
    try {
      // Récupérer le premier variant (couleur) du produit
      const variantsRes = await variantService.getVariants(productId);
      const firstVariant = variantsRes.data?.[0];
      
      if (!firstVariant) {
        alert("Impossible de charger les variantes du produit");
        return;
      }

      // Ajouter avec variantId (premier variant par défaut)
      const res = await cartService.addToCart(
        Number(user.id),
        productId,
        firstVariant.id,  // 🆕 Passer le variantId
        1
      );
      setCart(res.data);
    } catch { 
      alert("Erreur lors de l'ajout au panier"); 
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(inputValue.trim());
  };

  const products: any[] = Array.isArray(data) ? [...data] : [];

  // Filtres
  const filtered = products
    .filter(p => maxPrice === '' || p.price <= Number(maxPrice))
    .filter(p => {
      if (activeRoom === 'tous') return true;
      const cat = (p.categoryName || p.category_name || '').toLowerCase();
      return cat.includes(activeRoom);
    });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc')  return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'name_asc')   return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#f4f7f8]">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-xs font-bold tracking-widest text-[#4a9aaa] uppercase mb-2">
            Notre catalogue
          </p>
          <h1 className="text-4xl font-black text-[#1a2f38]">Smart Home par pièce</h1>
        </div>
      </div>

      {/* ── Filtres par pièce ── */}
      <div className="bg-white border-b border-gray-100 sticky top-[104px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {ROOMS.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() => setActiveRoom(key)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeRoom === key
                  ? 'bg-[#1a2f38] text-white shadow-md'
                  : 'bg-gray-100 text-[#1a2f38]/70 hover:bg-[#e6f4f6] hover:text-[#4a9aaa]'
              }`}
            >
              <span>{emoji}</span>
              {label}
              {activeRoom === key && key !== 'tous' && (
                <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {sorted.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Toolbar recherche + tri */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-full text-sm
                focus:outline-none focus:ring-2 focus:ring-[#4a9aaa] transition"
            />
            {inputValue && (
              <button type="button"
                onClick={() => { setInputValue(''); setSearch(''); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </form>

          {/* Tri */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-full pl-4 pr-9 py-3
                text-sm text-[#1a2f38] focus:outline-none focus:ring-2 focus:ring-[#4a9aaa] cursor-pointer"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Filtre prix */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2">
            <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">Max :</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Prix DH"
              className="w-24 text-sm text-[#1a2f38] focus:outline-none bg-transparent"
            />
            {maxPrice !== '' && (
              <button onClick={() => setMaxPrice('')} className="text-gray-400 hover:text-[#4a9aaa]">
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Résultats */}
        {!isLoading && (
          <p className="text-sm text-gray-400 mb-6">
            <span className="font-semibold text-[#1a2f38]">{sorted.length}</span>{' '}
            produit{sorted.length !== 1 ? 's' : ''} trouvé{sorted.length !== 1 ? 's' : ''}
            {activeRoom !== 'tous' && <span className="text-[#4a9aaa]"> · {ROOMS.find(r => r.key === activeRoom)?.label}</span>}
            {search && <span> pour "<strong>{search}</strong>"</span>}
          </p>
        )}

        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-52 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-full" />
                  <div className="flex justify-between pt-2">
                    <div className="h-5 bg-gray-100 rounded-full w-1/3" />
                    <div className="h-8 bg-gray-100 rounded-full w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">⚠️</span>
            <p className="text-[#1a2f38] font-bold text-lg mb-2">Impossible de charger les produits</p>
            <p className="text-gray-400 text-sm">Vérifiez que le backend est démarré sur le port 8080.</p>
          </div>
        )}

        {/* Grille */}
        {!isLoading && !error && (
          sorted.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sorted.map((product: any) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-6xl mb-4">
                {activeRoom !== 'tous' ? ROOMS.find(r => r.key === activeRoom)?.emoji : '🔍'}
              </span>
              <p className="text-[#1a2f38] font-bold text-xl mb-2">Aucun produit trouvé</p>
              <p className="text-gray-400 text-sm mb-6">
                {search ? `Aucun résultat pour "${search}"` : `Aucun produit dans cette pièce.`}
              </p>
              <button
                onClick={() => { setActiveRoom('tous'); setSearch(''); setInputValue(''); }}
                className="bg-[#1a2f38] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#4a9aaa] transition"
              >
                Voir tous les produits
              </button>
            </div>
          )
        )}
      </div>
      <Footer />
    </div>
  );
}