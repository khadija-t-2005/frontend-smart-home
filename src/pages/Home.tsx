import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, RefreshCw, Wifi, Cpu, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ─── DATA ─────────────────────────────── */
const SMART_PRODUCTS = [
  {
    id: 1,
    name: 'Canapé Smart Connect',
    desc: 'Chargement sans fil intégré & commande vocale',
    price: 4990,
    tag: 'Bestseller',
    image: 'https://plus.unsplash.com/premium_photo-1756142935130-a993672ddae8?q=80&w=1968&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bg: '#c8e2e8',
  },
  {
    id: 2,
    name: 'Lampe IA Adaptative',
    desc: 'Luminosité auto selon l\'ambiance & rythme circadien',
    price: 890,
    tag: 'Nouveau',
    image: 'https://images.unsplash.com/photo-1660603135468-6e3be1a106c0?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bg: '#d4e8c8',
  },
  {
    id: 3,
    name: 'Bureau Élévateur Connect',
    desc: 'Hauteur motorisée, mémoire de postures & app mobile',
    price: 3290,
    tag: 'Top vente',
    image: 'https://images.unsplash.com/photo-1696453423495-046a7d83bf55?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bg: '#e8dfc8',
  },
  {
    id: 4,
    name: 'Miroir Intelligent',
    desc: 'Affichage météo, agenda & qualité de l\'air en temps réel',
    price: 2190,
    tag: 'Exclusif',
    image: 'https://verconsmartmirror.com/wp-content/uploads/2024/11/magic-smart-mirror.jpg',
    bg: '#dcc8e8',
  },
];

const FEATURES = [
  { icon: Wifi, title: 'Connecté', desc: 'Chaque meuble se pilote depuis votre smartphone ou assistant vocal.' },
  { icon: Cpu, title: 'Intelligent', desc: 'L\'IA apprend vos habitudes et adapte votre environnement automatiquement.' },
  { icon: Zap, title: 'Économique', desc: 'Réduction jusqu\'à 40 % de votre consommation énergétique.' },
];

const STATS = [
  { value: '12 000+', label: 'Foyers connectés' },
  { value: '98%', label: 'Clients satisfاits' },
  { value: '24h', label: 'Livraison express' },
  { value: '4.9★', label: 'Note moyenne' },
];

const TESTIMONIALS = [
  { name: 'Karim B.', city: 'Casablanca', text: 'Mon bureau s\'ajuste tout seul selon mes horaires. Bluffant !', rating: 5 },
  { name: 'Salma R.', city: 'Rabat', text: 'La lampe IA a transformé mon espace de travail. Je dors mieux aussi.', rating: 5 },
  { name: 'Youssef M.', city: 'Marrakech', text: 'Le canapé avec charge sans fil, c\'est le luxe du quotidien.', rating: 5 },
];

/* ─── COMPONENT ────────────────────────── */
export default function Home() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const timer = setInterval(() => setActiveProduct(p => (p + 1) % SMART_PRODUCTS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const hero = SMART_PRODUCTS[activeProduct];

  return (
    <div className="min-h-screen bg-[#f4f7f8] font-sans overflow-x-hidden text-right">
      <Navbar />

      {/* ════ HERO SECTION (Unified Circle) ════ */}
      <section className="relative overflow-hidden bg-[#c8dfe5] min-h-[600px] flex items-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/20" />
          <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[#4a9aaa]/10" />
        </div>

        <div className={`max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="order-2 md:order-1 text-left">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#1a2f38] uppercase mb-5 bg-white/70 px-4 py-1.5 rounded-full">
              <Wifi size={11} /> Smart Home · Collection 2026
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-[#1a2f38] leading-[1.05] mb-5">
              Des meubles qui<br />
              <span className="text-[#4a9aaa]">pensent</span> pour<br />
              vous.
            </h1>
            <p className="text-[#1a2f38]/60 text-base leading-relaxed mb-8 max-w-md">
              E·Store réinvente l'ameublement marocain avec des pièces connectées, pilotées par IA, livrées partout au Maroc en 24h.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="inline-flex items-center gap-2 bg-[#1a2f38] text-white font-bold px-8 py-4 rounded-full hover:bg-[#4a9aaa] transition-all group shadow-lg">
                Explorer la collection
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 bg-white/80 border border-[#1a2f38]/10 text-[#1a2f38] font-semibold px-8 py-4 rounded-full hover:border-[#4a9aaa] hover:text-[#4a9aaa] transition-all">
                Créer un compte
              </Link>
            </div>
            <div className="flex gap-2 mt-8">
              {SMART_PRODUCTS.map((_, i) => (
                <button key={i} onClick={() => setActiveProduct(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === activeProduct ? 'w-8 bg-[#1a2f38]' : 'w-2 bg-[#1a2f38]/25'}`} />
              ))}
            </div>
          </div>

          {/* Right: Unified Circle Fix */}
          <div className="relative flex items-center justify-center order-1 md:order-2">
            <div key={activeProduct}
              className="w-80 h-80 md:w-[480px] md:h-[480px] rounded-full border-8 border-white/40 flex items-center justify-center shadow-2xl transition-all duration-500 overflow-hidden relative"
              style={{ backgroundColor: hero.bg }}>
              <img 
                src={hero.image} 
                alt={hero.name}
                className="w-full h-full object-cover select-none"
                style={{ animation: 'float 3s ease-in-out infinite' }}
              />
            </div>
            <div className="absolute bottom-10 left-0 bg-white rounded-2xl shadow-xl px-5 py-3 min-w-[180px] text-left z-20">
              <p className="text-[10px] text-[#4a9aaa] font-bold uppercase tracking-wider mb-0.5">{hero.tag}</p>
              <p className="text-sm font-bold text-[#1a2f38] leading-snug">{hero.name}</p>
              <p className="text-lg font-black text-[#1a2f38] mt-0.5">{hero.price.toLocaleString('fr-MA')} <span className="text-xs font-medium text-gray-400">DH</span></p>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @keyframes floatCard {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      
      </section>

      {/* STATS */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-7 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-black text-[#1a2f38]">{value}</p>
              <p className="text-sm text-[#1a2f38]/45 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>


      {/* SECTION 2 — Technology & Comfort */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="text-left">
          <span className="text-[10px] font-bold tracking-widest text-[#4a9aaa] uppercase block mb-4">
            Technologie & Confort
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#1a2f38] leading-tight mb-6">
            L'intelligence au<br />
            <span className="text-[#4a9aaa]">service du confort.</span>
          </h2>
          <p className="text-[#1a2f38]/60 leading-relaxed mb-4">
            Nos meubles smart home combinent design épuré et technologie de pointe. Chaque pièce est connectée à l'application E·Store pour un contrôle total.
          </p>
          <div className="flex gap-4 mt-8">
            <Link to="/products" className="inline-flex items-center gap-2 bg-[#1a2f38] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#4a9aaa] transition">Découvrir</Link>
          </div>
        </div>

        <div className="relative">
          {/* MODIFIED TO OVAL */}
          <div className="bg-[#d6ebef] rounded-[50%/30%] p-10 flex items-center justify-center min-h-[400px] overflow-hidden">
            <img 
              src={SMART_PRODUCTS[0].image} 
              className="w-64 h-64 object-cover drop-shadow-xl relative z-10" 
              style={{ animation: 'float 4s ease-in-out infinite' }} 
            />
          </div>
          <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-2xl px-6 py-4">
            <p className="text-[10px] text-gray-400 mb-0.5">À partir de</p>
            <p className="text-2xl font-black text-[#4a9aaa]">890 <small className="text-sm font-medium">DH</small></p>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Featured */}
      <section className="bg-[#1a2f38] py-24 relative overflow-hidden">

        <div className="absolute inset-0 pointer-events-none">

          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#4a9aaa]/10" />

          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#4a9aaa]/08" />

        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative">

          {/* Vases / déco left */}

          <div className="flex items-end gap-6 justify-center">

            <div className="bg-[#4a9aaa]/20 rounded-[32px] w-36 h-48 flex items-end justify-center pb-4">

              <span className="text-6xl select-none">🪴</span>

            </div>

            <div className="flex flex-col gap-4">

              <div className="bg-[#4a9aaa]/15 rounded-[24px] w-28 h-32 flex items-center justify-center">

                <span className="text-5xl select-none">💡</span>

              </div>

              <div className="bg-[#4a9aaa]/10 rounded-[24px] w-28 h-24 flex items-center justify-center">

                <span className="text-4xl select-none">🪞</span>

              </div>

            </div>

            <div className="bg-[#4a9aaa]/20 rounded-[32px] w-28 h-56 flex items-center justify-center">

              <span className="text-5xl select-none">🛋️</span>

            </div>

          </div>



          {/* Right: copy */}

          <div>

            <span className="text-[10px] font-bold tracking-widest text-[#4a9aaa] uppercase block mb-4">

              En ce moment

            </span>

            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">

              Produits en<br />

              <span className="text-[#4a9aaa]">vedette maintenant.</span>

            </h2>

            <p className="text-white/50 leading-relaxed mb-8">

              Découvrez nos meubles intelligents les plus populaires, sélectionnés par nos experts pour transformer chaque pièce de votre maison en espace connecté.

            </p>

            <div className="flex gap-4">

              <Link to="/products"

                className="inline-flex items-center gap-2 bg-[#4a9aaa] text-white font-bold px-7 py-3.5 rounded-full hover:bg-white hover:text-[#1a2f38] transition-all group">

                Shop Now

                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />

              </Link>

              <span className="inline-flex items-center text-white/40 text-sm">

                {SMART_PRODUCTS.length} produits disponibles

              </span>

            </div>

          </div>

        </div>

      </section>

      {/* PRODUCTS GRID */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div className="text-left">
              <span className="text-[10px] font-bold tracking-widest text-[#4a9aaa] uppercase block mb-2">Notre sélection</span>
              <h2 className="text-4xl font-black text-[#1a2f38]">Smart Home Essentials</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SMART_PRODUCTS.map((p) => (
              <Link to={`/products/${p.id}`} key={p.id} className="group bg-gray-50 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                {/* MODIFIED TO OVAL */}
                <div className="h-56 flex items-center justify-center relative overflow-hidden rounded-[50%/20%] m-2" style={{ backgroundColor: p.bg }}>
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 bg-[#1a2f38] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{p.tag}</span>
                </div>
                <div className="p-5 flex flex-col flex-1 text-left">
                  <h3 className="font-bold text-[#1a2f38] text-sm mb-1">{p.name}</h3>
                  <p className="text-xs text-gray-400 mb-3 flex-1">{p.desc}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-black text-[#4a9aaa]">{p.price.toLocaleString('fr-MA')} <small className="text-xs">DH</small></p>
                    <button className="bg-[#1a2f38] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#4a9aaa]">Ajouter</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-[#f4f7f8] py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-3xl p-8 group text-left">
              <div className="w-14 h-14 bg-[#e6f4f6] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#4a9aaa] transition-colors">
                <Icon size={24} className="text-[#4a9aaa] group-hover:text-white" />
              </div>
              <h3 className="font-black text-[#1a2f38] text-xl mb-3">{title}</h3>
              <p className="text-[#1a2f38]/55 text-sm">{desc}</p>
            </div>
          ))}
        </div>

      </section>

      <Footer />
    </div>
  );
}