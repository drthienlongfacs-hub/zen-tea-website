import React, { useState, useEffect } from 'react';
import { Coffee, Volume2, User, Calendar, Menu, X, ShoppingBag, Bell } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  cartCount,
  setIsCartOpen,
  setIsSoundModalOpen,
  setIsReservationModalOpen,
  onOpenAdmin
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(cartCount);
  const [cartAnimating, setCartAnimating] = useState(false);

  // Detect scroll for header shadow/opacity
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Animate cart badge on count change
  useEffect(() => {
    if (cartCount !== prevCartCount && cartCount > prevCartCount) {
      setCartAnimating(true);
      const t = setTimeout(() => setCartAnimating(false), 600);
      setPrevCartCount(cartCount);
      return () => clearTimeout(t);
    }
    setPrevCartCount(cartCount);
  }, [cartCount]);

  const navLinks = [
    { id: 'home',     label: 'Trang Chủ' },
    { id: 'menu',     label: '🍵 Thưởng Trà' },
    { id: 'blog',     label: '📖 Chuyện Trà' },
    { id: 'zen-gear', label: '🛍️ Trà Cụ' },
    { id: 'recipes',  label: '✨ Bí Kíp' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#f7f4ef]/95 backdrop-blur-xl shadow-sm border-b border-[#7c674e]/12'
          : 'bg-[#f7f4ef]/80 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">

        {/* ── Brand Logo ── */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 group shrink-0"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3d633b] to-[#254124] text-[#f7f4ef] flex items-center justify-center font-serif-zen text-lg shadow-md group-hover:shadow-[#3d633b]/40 group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
            安
          </div>
          <div className="hidden sm:block">
            <span className="font-display text-base font-bold text-[#1f2721] tracking-wide block leading-none">
              An Nhiên <span className="text-[#3d633b]">·</span> Trà Quán
            </span>
            <span className="text-[10px] text-[#9aab9c] tracking-[0.18em] uppercase font-medium">
              Thiền · Matcha · Wabi-Sabi
            </span>
          </div>
        </button>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-0.5 bg-[#ece3d7]/50 p-1.5 rounded-full border border-[#7c674e]/10 text-[13px] font-medium">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`px-3.5 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                activeTab === link.id
                  ? 'bg-[#3d633b] text-white shadow-sm shadow-[#3d633b]/30'
                  : 'text-[#1f2721] hover:text-[#3d633b] hover:bg-[#e2ebe0]/60'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* Admin POS */}
          <button
            onClick={onOpenAdmin}
            title="Quản lý đơn hàng"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1f2721] text-[#e2ebe0] text-xs font-semibold hover:bg-[#3d633b] transition-colors shadow-sm"
          >
            <User className="w-3.5 h-3.5 text-[#8fb388]" />
            <span className="hidden lg:inline">Quản Lý Đơn</span>
          </button>

          {/* Sound / Zen */}
          <button
            onClick={() => setIsSoundModalOpen(true)}
            title="Âm thanh thiền"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e2ebe0] text-[#254124] text-xs font-semibold hover:bg-[#3d633b] hover:text-white transition-all shadow-sm"
          >
            <Volume2 className="w-4 h-4 animate-breathe text-[#3d633b] group-hover:text-white" />
            <span className="hidden lg:inline">Âm Zen</span>
          </button>

          {/* Book Table */}
          <button
            onClick={() => setIsReservationModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#7c674e] text-white text-xs font-semibold hover:bg-[#63513d] transition-colors shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            Đặt Bàn
          </button>

          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label={`Giỏ hàng ${cartCount} món`}
            className="relative p-2.5 rounded-full bg-[#3d633b] text-white hover:bg-[#254124] transition-colors shadow-md active:scale-95"
          >
            <Coffee className="w-5 h-5" />
            {cartCount > 0 && (
              <span
                className={`absolute -top-1.5 -right-1.5 bg-[#c2410c] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#f7f4ef] shadow-sm ${
                  cartAnimating ? 'animate-cart-bounce' : ''
                }`}
              >
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#1f2721] hover:bg-[#ece3d7] rounded-xl transition-colors"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#7c674e]/10 bg-[#f7f4ef]/98 backdrop-blur-xl px-4 py-4 space-y-1.5 animate-fadeSlideUp shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => { setActiveTab(link.id); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === link.id
                  ? 'bg-[#3d633b] text-white shadow-sm'
                  : 'text-[#1f2721] hover:bg-[#e2ebe0]'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-[#7c674e]/10 grid grid-cols-2 gap-2">
            <button
              onClick={() => { setIsReservationModalOpen(true); setIsMobileMenuOpen(false); }}
              className="py-3 bg-[#7c674e] text-white text-xs font-bold rounded-xl text-center"
            >
              📅 Đặt Bàn Zen
            </button>
            <button
              onClick={() => { onOpenAdmin(); setIsMobileMenuOpen(false); }}
              className="py-3 bg-[#1f2721] text-[#e2ebe0] text-xs font-bold rounded-xl text-center"
            >
              👤 Quản Lý Đơn
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
