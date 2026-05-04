// Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const itemCount = useCartStore((s) => s.itemCount);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Fermer le menu utilisateur quand on clique ailleurs
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  // 🆕 Extraire le nom de l'email (partie avant @)
  const getUserName = () => {
    if (!user?.email) return '';
    const name = user.email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        {/* Top bar */}
        <div className="bg-gradient-to-r from-[#1a2f38] to-[#2a4555] text-white/90 text-xs py-2.5 px-6 flex justify-between items-center">
          <span className="flex items-center gap-1">
            <span>✓ Livraison gratuite au Maroc à partir de</span>
            <strong className="text-white text-sm">50 DH</strong>
          </span>
          <div className="flex gap-6 items-center">
            {user ? (
              // 🆕 Affichage élégant de l'utilisateur connecté
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 bg-[#4a9aaa] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-white/85 hidden sm:inline text-xs">{user.email}</span>
              </div>
            ) : (
              <>
                <Link to="/login" className="hover:text-white transition font-medium">Connexion</Link>
                <span className="text-white/40">|</span>
                <Link to="/register" className="hover:text-white transition font-medium">Inscription</Link>
              </>
            )}
          </div>
        </div>

        {/* Main nav */}
        <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-2xl font-black text-[#1a2f38] tracking-tight">
              E<span className="text-[#4a9aaa]">·</span>Store
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Accueil', to: '/' },
              { label: 'Produits', to: '/products' },
  
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-sm font-medium text-[#1a2f38]/70 hover:text-[#4a9aaa] transition-colors relative group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4a9aaa] transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-[#1a2f38]/70 hover:text-[#4a9aaa] transition p-1.5 hover:bg-[#f4f7f8] rounded-lg"
            >
              <Search size={20} />
            </button>

            <Link 
              to="/cart" 
              className="relative text-[#1a2f38]/70 hover:text-[#4a9aaa] transition p-1.5 hover:bg-[#f4f7f8] rounded-lg"
            >
              <ShoppingCart size={20} />
              {itemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#4a9aaa] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {itemCount()}
                </span>
              )}
            </Link>

            {/* 🆕 Menu utilisateur avec dropdown */}
            {user ? (
              <div className="relative" data-user-menu>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[#f4f7f8] transition text-[#1a2f38] font-medium text-sm"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-[#4a9aaa] to-[#2a7a8a] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#1a2f38]/5 to-[#4a9aaa]/5 px-5 py-4 border-b border-gray-100">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Connecté en tant que</p>
                      <p className="text-sm font-bold text-[#1a2f38] mt-1 truncate">{user.email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-[#f4f7f8] transition text-[#1a2f38] text-sm"
                      >
                        <User size={16} className="text-[#4a9aaa]" />
                        <span>Mon profil</span>
                      </Link>
                      <Link
                        to="/cart"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-[#f4f7f8] transition text-[#1a2f38] text-sm"
                      >
                        <ShoppingCart size={16} className="text-[#4a9aaa]" />
                        <span>Mon panier</span>
                        {itemCount() > 0 && (
                          <span className="ml-auto bg-[#4a9aaa] text-white text-xs font-bold px-2 py-1 rounded-full">
                            {itemCount()}
                          </span>
                        )}
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100" />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 transition text-red-600 text-sm font-medium"
                    >
                      <LogOut size={16} />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block bg-[#1a2f38] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#4a9aaa] transition-colors"
              >
                Se connecter
              </Link>
            )}

            {/* Menu mobile */}
            <button
              className="md:hidden text-[#1a2f38] p-1.5"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white px-6 py-4 max-w-7xl mx-auto animate-in fade-in slide-in-from-top-2">
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="flex-1 border border-gray-200 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a9aaa]"
              />
              <button
                type="submit"
                className="bg-[#4a9aaa] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#3d8494] transition"
              >
                Rechercher
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3 animate-in fade-in slide-in-from-top-2">
            {[
              { label: 'Accueil', to: '/' },
              { label: 'Produits', to: '/products' },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-medium text-[#1a2f38] hover:text-[#4a9aaa] transition py-2"
              >
                {label}
              </Link>
            ))}
            
            {user ? (
              <div className="border-t border-gray-100 pt-3 space-y-3">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-[#1a2f38] hover:text-[#4a9aaa] py-2"
                >
                  <User size={16} /> Mon profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 py-2"
                >
                  <LogOut size={16} /> Déconnexion
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block text-center bg-[#1a2f38] text-white text-sm font-semibold px-5 py-2.5 rounded-full mt-2"
              >
                Se connecter
              </Link>
            )}
          </div>
        )}
      </header>
      <div className="h-[104px]" />
    </>
  );
};

export default Navbar;