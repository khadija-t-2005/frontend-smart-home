import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import cartService from '../services/cart.service';
import orderService from '../services/order.service';
import variantService from '../services/variant.service';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

// Composant image — utilise variantImageUrl si disponible, sinon charge le premier variant
function CartItemImage({ productId, productName, variantImageUrl }: {
  productId: number;
  productName: string;
  variantImageUrl?: string;
}) {
  const [imgUrl, setImgUrl] = useState<string | null>(variantImageUrl || null);

  useEffect(() => {
    // Si on a déjà l'image du variant choisi, on l'utilise directement
    if (variantImageUrl) {
      setImgUrl(variantImageUrl);
      return;
    }
    // Sinon on charge le premier variant
    variantService.getVariants(productId)
      .then(res => {
        if (res.data.length > 0 && res.data[0].imageUrl) {
          setImgUrl(res.data[0].imageUrl);
        }
      })
      .catch(() => setImgUrl(null));
  }, [productId, variantImageUrl]);

  return (
    <div className="w-16 h-16 bg-[#e6f4f6] rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
      {imgUrl ? (
        <img src={imgUrl} alt={productName} className="w-full h-full object-cover" />
      ) : (
        <span className="text-2xl">📦</span>
      )}
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const user     = useAuthStore((s) => s.user);
  const { cart, setCart, clearCart } = useCartStore();

  const [loading,  setLoading]  = useState(false);
  const [checking, setChecking] = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    cartService.getCart(Number(user.id))
      .then((res) => setCart(res.data))
      .catch(() => setError('Impossible de charger le panier'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleRemove = async (cartItemId: number) => {
    try {
      await cartService.removeItem(cartItemId);
      if (user) {
        const res = await cartService.getCart(Number(user.id));
        setCart(res.data);
      }
    } catch { setError("Erreur lors de la suppression"); }
  };

  const handleClear = async () => {
    if (!user) return;
    try {
      await cartService.clearCart(Number(user.id));
      clearCart();
    } catch { setError("Erreur lors du vidage du panier"); }
  };

  const handleCheckout = async () => {
    if (!user) return;
    setChecking(true); setError('');
    try {
      await orderService.checkout(Number(user.id));
      clearCart();
      setSuccess('Commande passée avec succès ! Merci pour votre achat.');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la commande');
    } finally { setChecking(false); }
  };

  const items = cart?.items ?? [];
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f4f7f8]">
      <Navbar />

      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <p className="text-xs font-bold tracking-widest text-[#4a9aaa] uppercase mb-2">Mon compte</p>
          <h1 className="text-4xl font-black text-[#1a2f38]">Mon panier</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-5 py-4 mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-100 text-green-700 text-sm rounded-2xl px-5 py-4 mb-6 font-semibold">
            ✓ {success}
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-gray-100" />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && !success && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag size={48} className="text-gray-200 mb-6" />
            <p className="text-[#1a2f38] font-bold text-xl mb-2">Votre panier est vide</p>
            <p className="text-gray-400 text-sm mb-8">Ajoutez des produits pour commencer vos achats</p>
            <Link to="/products"
              className="bg-[#1a2f38] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#4a9aaa] transition flex items-center gap-2 group">
              Découvrir nos produits
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Liste articles ── */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-5 hover:border-[#4a9aaa]/30 transition">

                  {/* Image via variant */}
                  <CartItemImage productId={item.productId} productName={item.productName} variantImageUrl={item.variantImageUrl} />

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#1a2f38] text-sm truncate">{item.productName}</h3>
                    {item.variantColor && (
                      <span className="text-xs text-gray-400">Couleur : {item.variantColor}</span>
                    )}
                    <p className="text-[#4a9aaa] font-black text-base mt-0.5">
                      {item.unitPrice.toLocaleString('fr-MA')} DH
                    </p>
                  </div>

                  {/* Quantité */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5">
                    <span className="text-xs text-gray-400">Qté</span>
                    <span className="font-bold text-[#1a2f38] text-sm w-5 text-center">{item.quantity}</span>
                  </div>

                  {/* Sous-total */}
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400">Sous-total</p>
                    <p className="font-black text-[#1a2f38]">
                      {(item.unitPrice * item.quantity).toLocaleString('fr-MA')} DH
                    </p>
                  </div>

                  {/* Supprimer */}
                  <button onClick={() => handleRemove(item.id)}
                    className="text-gray-300 hover:text-red-400 transition p-2 rounded-xl hover:bg-red-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <button onClick={handleClear}
                className="text-sm text-gray-400 hover:text-red-400 transition flex items-center gap-1.5 mt-2">
                <Trash2 size={13} /> Vider le panier
              </button>
            </div>

            {/* ── Récapitulatif ── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-28">
                <h2 className="font-black text-[#1a2f38] text-lg mb-5">Récapitulatif</h2>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{items.length} article{items.length > 1 ? 's' : ''}</span>
                    <span>{total.toLocaleString('fr-MA')} DH</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Livraison</span>
                    <span className={total >= 500 ? 'text-green-500 font-semibold' : ''}>
                      {total >= 500 ? 'Gratuite' : '50 DH'}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-[#1a2f38]">
                    <span>Total</span>
                    <span className="text-[#4a9aaa] text-lg">
                      {(total >= 500 ? total : total + 50).toLocaleString('fr-MA')} DH
                    </span>
                  </div>
                </div>

                {total < 500 && (
                  <p className="text-xs text-[#4a9aaa] bg-[#e6f4f6] rounded-xl px-3 py-2 mb-4">
                    Ajoutez {(500 - total).toLocaleString('fr-MA')} DH de plus pour la livraison gratuite !
                  </p>
                )}

                <button onClick={handleCheckout} disabled={checking}
                  className="w-full bg-[#1a2f38] text-white font-bold py-4 rounded-2xl hover:bg-[#4a9aaa] transition flex items-center justify-center gap-2 group disabled:opacity-60">
                  {checking ? 'Traitement...' : (
                    <>
                      Commander maintenant
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}