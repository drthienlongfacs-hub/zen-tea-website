import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import ReservationModal from './components/ReservationModal';
import ZenSoundscapeModal from './components/ZenSoundscapeModal';
import BlogArticleModal from './components/BlogArticleModal';
import PolicyModal from './components/PolicyModal';
import AdminOrderManager from './components/AdminOrderManager';

import {
  MENU_CATEGORIES,
  MENU_ITEMS,
  BLOG_ARTICLES,
  ZEN_ITEMS,
  RECIPES,
  REVIEWS
} from './data/mockData';

import {
  Coffee, BookOpen, ShoppingBag, Sparkles, Calendar,
  MapPin, Phone, Clock, Star, Search, ArrowRight,
  ExternalLink, Volume2, Heart, CheckCircle2, Leaf,
  Award, Users, Zap, ChevronDown
} from 'lucide-react';

/* ────────────────────────────────────────────────────
   TOAST SYSTEM
──────────────────────────────────────────────────── */
function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type} animate-toast-in`}>
          {t.icon && <span>{t.icon}</span>}
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────
   REVIEW MARQUEE
──────────────────────────────────────────────────── */
function ReviewMarquee({ reviews }) {
  const doubled = [...reviews, ...reviews]; // duplicate for seamless loop
  return (
    <div className="overflow-hidden py-2">
      <div className="marquee-track gap-4">
        {doubled.map((rv, idx) => (
          <div
            key={idx}
            className="zen-card px-5 py-4 rounded-2xl flex-shrink-0 w-72 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-0.5">
                {[...Array(rv.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] text-[#9aab9c] font-medium">{rv.date}</span>
            </div>
            <p className="text-xs text-[#1f2721] leading-relaxed italic line-clamp-3">
              "{rv.comment}"
            </p>
            <div className="flex items-center gap-2 pt-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3d633b] to-[#254124] flex items-center justify-center text-white text-[11px] font-bold">
                {rv.author.charAt(0)}
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#1f2721]">{rv.author}</p>
                <p className="text-[10px] text-[#9aab9c]">{rv.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────
   STATS COUNTER
──────────────────────────────────────────────────── */
const STATS = [
  { icon: Users,  value: '12.400+', label: 'Khách Hàng Tin Yêu',   suffix: '' },
  { icon: Star,   value: '4.9',     label: 'Điểm Đánh Giá',        suffix: '⭐' },
  { icon: Coffee, value: '50+',     label: 'Loại Trà & Thức Uống', suffix: '' },
  { icon: Zap,    value: '15',      label: 'Phút Giao Hàng',       suffix: ' phút' },
];

function StatsSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="w-full bg-[#1f2721] py-12 px-4 overflow-hidden relative"
    >
      {/* Decorative watermark */}
      <div className="hero-watermark absolute -right-8 top-1/2 -translate-y-1/2 opacity-[0.04] select-none pointer-events-none">
        安
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(({ icon: Icon, value, label, suffix }, i) => (
          <div
            key={i}
            className={`stats-card transition-all ${visible ? `animate-number-pop delay-${i * 75}` : 'opacity-0'}`}
          >
            <div className="w-10 h-10 rounded-full bg-[#3d633b]/30 flex items-center justify-center mx-auto mb-3">
              <Icon className="w-5 h-5 text-[#8fb388]" />
            </div>
            <p className="font-display text-3xl font-bold text-white mb-1">
              {value}<span className="text-[#8fb388] text-xl">{suffix}</span>
            </p>
            <p className="text-[11px] text-[#7a8c7e] font-medium uppercase tracking-wide">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────
   SCROLL REVEAL HOOK
──────────────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    const elements = document.querySelectorAll('.reveal, .reveal-left');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

/* ────────────────────────────────────────────────────
   MAIN APP
──────────────────────────────────────────────────── */
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Cart
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutTotals, setCheckoutTotals] = useState({ subtotal: 0, discount: 0, shippingFee: 0, grandTotal: 0 });

  // Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [policyType, setPolicyType] = useState(null);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  // Contact
  const [contactMessage, setContactMessage] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Toast system
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = 'success', icon = null) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, icon }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  // Scroll reveal
  useScrollReveal();

  // Smooth tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart helpers
  const handleAddToCart = (configuredItem) => {
    setCartItems((prev) => [...prev, configuredItem]);
    setIsCartOpen(true);
    showToast(`🍵 Đã thêm "${configuredItem.item.name}" vào giỏ!`, 'success');
  };

  const handleUpdateQuantity = (index, newQty) => {
    if (newQty <= 0) { handleRemoveCartItem(index); return; }
    setCartItems((prev) => {
      const updated = [...prev];
      const item = updated[index];
      updated[index] = { ...item, quantity: newQty, totalPrice: item.unitPrice * newQty };
      return updated;
    });
  };

  const handleRemoveCartItem = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProceedCheckout = (totals) => {
    setCheckoutTotals(totals);
    setIsCheckoutOpen(true);
  };

  const handleOpenPolicy = (type) => {
    setPolicyType(type);
    setIsPolicyModalOpen(true);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    showToast('✉️ Đã gửi lời nhắn thành công! An Nhiên sẽ phản hồi sớm.', 'success');
    setTimeout(() => {
      setContactSubmitted(false);
      setContactMessage('');
      setContactName('');
    }, 4000);
  };

  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  if (isAdminOpen) {
    return <AdminOrderManager onClose={() => setIsAdminOpen(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1f2721] flex flex-col">

      {/* Toast Notifications */}
      <Toast toasts={toasts} />

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        cartCount={cartCount}
        setIsCartOpen={setIsCartOpen}
        setIsSoundModalOpen={setIsSoundModalOpen}
        setIsReservationModalOpen={setIsReservationModalOpen}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* ═══════════════════ HOME TAB ═══════════════════ */}
      {activeTab === 'home' && (
        <div className="animate-fadeIn">

          {/* ── CINEMATIC HERO SECTION ── */}
          <section className="relative overflow-hidden bg-gradient-to-b from-[#1a251c] via-[#253428] to-[#f7f4ef] min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-8 pb-16">

            {/* Decorative Kanji watermark */}
            <div
              className="hero-watermark absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
              aria-hidden="true"
            >
              茶
            </div>

            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="particle"
                style={{
                  width: `${4 + i * 2}px`,
                  height: `${4 + i * 2}px`,
                  background: `rgba(${138 + i * 8}, ${179 + i * 4}, ${136}, ${0.5 + i * 0.05})`,
                  left: `${10 + i * 10}%`,
                  top: `${60 + (i % 3) * 15}%`,
                  animationDuration: `${5 + i * 1.5}s`,
                  animationDelay: `${i * 0.7}s`,
                }}
              />
            ))}

            {/* Avatar Ring */}
            <div className="relative inline-block mb-6 animate-zen-float z-10">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden ring-4 ring-[#3d633b]/60 ring-offset-4 ring-offset-[#1f2721] shadow-2xl shadow-[#3d633b]/30 mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=85&w=500"
                  alt="An Nhiên Trà Quán"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online dot */}
              <span className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-4 h-4 rounded-full bg-[#4ade80] ring-4 ring-[#1f2721] shadow-md" />
              {/* Ripple rings */}
              <span className="absolute inset-0 rounded-full border-2 border-[#3d633b]/30 animate-ripple" />
            </div>

            {/* Badge */}
            <div className="z-10 mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d633b]/30 border border-[#3d633b]/40 text-[#8fb388] text-xs font-bold uppercase tracking-widest backdrop-blur-md animate-fadeSlideUp">
              <Leaf className="w-3 h-3" />
              Thiền Trà · Uji Matcha · Wabi-Sabi
            </div>

            {/* Main Title */}
            <h1 className="z-10 font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] max-w-2xl mx-auto mb-4 animate-fadeSlideUp" style={{ animationDelay: '80ms' }}>
              Xin Chào,{' '}
              <span className="hero-gradient-text">Mình Là</span>
              <br />An Nhiên
            </h1>

            {/* Subtitle */}
            <p className="z-10 text-[#a0b2a3] text-sm md:text-base leading-loose max-w-lg mx-auto mb-8 font-light animate-fadeSlideUp" style={{ animationDelay: '160ms' }}>
              Một người mẹ yêu Matcha, say mê trà đạo Nhật Bản — pha từng ly trà
              tươi thủ công gửi đến bạn như gửi một khoảnh khắc tĩnh lặng.
            </p>

            {/* CTA Buttons */}
            <div className="z-10 flex flex-wrap items-center justify-center gap-3 mb-10 animate-fadeSlideUp" style={{ animationDelay: '240ms' }}>
              <button
                onClick={() => handleTabChange('menu')}
                className="btn-primary btn-ripple text-base px-8 py-4"
              >
                <Coffee className="w-5 h-5" />
                Thưởng Trà Ngay
              </button>
              <button
                onClick={() => setIsSoundModalOpen(true)}
                className="btn-ghost btn-ripple text-sm px-7 py-4"
                style={{ color: '#8fb388', borderColor: 'rgba(143,179,136,0.4)', background: 'rgba(61,99,59,0.15)' }}
              >
                <Volume2 className="w-4 h-4 animate-breathe" />
                Nghe Âm Zen
              </button>
            </div>

            {/* Social Links */}
            <div className="z-10 flex items-center justify-center gap-2 flex-wrap animate-fadeSlideUp" style={{ animationDelay: '320ms' }}>
              {[
                { label: '🎵 TikTok', sub: '@annhientraquan', href: 'https://tiktok.com' },
                { label: '📘 Facebook', sub: 'An Nhiên Trà', href: 'https://facebook.com' },
                { label: '▶️ YouTube', sub: 'Chuyện Trà', href: 'https://youtube.com' },
              ].map(({ label, sub, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 hover:bg-[#3d633b] hover:border-[#3d633b] transition-all text-xs font-semibold text-[#c8ddc6] flex items-center gap-1.5 backdrop-blur-md"
                >
                  <span>{label}</span>
                  <span className="opacity-60 text-[10px]">{sub}</span>
                </a>
              ))}
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-scroll-bounce opacity-60 z-10">
              <ChevronDown className="w-6 h-6 text-[#8fb388]" />
            </div>
          </section>

          {/* ── STATS STRIP ── */}
          <StatsSection />

          {/* ── MAIN CONTENT ── */}
          <div className="max-w-5xl mx-auto px-4 pt-14 pb-24 space-y-16">

            {/* Zen Quote */}
            <div className="reveal zen-card p-8 md:p-10 rounded-3xl text-center relative overflow-hidden">
              <div className="absolute -top-4 -left-4 text-[80px] text-[#3d633b]/08 font-serif-zen select-none pointer-events-none leading-none">
                "
              </div>
              <blockquote className="font-serif-zen text-xl md:text-2xl italic text-[#254124] max-w-xl mx-auto leading-loose">
                Sống chậm một chút, pha một ly matcha, kể một câu chuyện —
                đôi khi đó là tất cả những gì cần để xoa dịu tâm trí.
              </blockquote>
              <p className="mt-4 text-sm font-semibold text-[#3d633b] tracking-wider">
                — An Nhiên · Trà Quán
              </p>
            </div>

            {/* Discovery Grid */}
            <div className="space-y-5 reveal">
              <div className="flex items-center gap-3">
                <div className="zen-divider flex-1" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#9aab9c] shrink-0">
                  Khám Phá Góc Trà Quán
                </span>
                <div className="zen-divider flex-1" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { tab: 'menu',     emoji: '🍵', title: 'Đặt Trà Online Giao Tận Nơi', desc: 'Uji Matcha Latte, Hojicha nướng, Trà Tuyết Cúc.' },
                  { tab: 'blog',     emoji: '📖', title: 'Blog Kể Chuyện & Thiền Trà',  desc: 'Nhật ký sống chậm, nghệ thuật pha chế Chasen.' },
                  { tab: 'zen-gear', emoji: '🛍️', title: 'Góc Trà Cụ Wabi-Sabi',        desc: 'Chổi tre Chasen, Bát gốm Chawan, Chuông xoay.' },
                  { tab: 'recipes',  emoji: '✨', title: 'Bí Kíp Công Thức Chuẩn Uji',  desc: 'Pha Matcha Latte không đắng — từng bước rõ ràng.', highlight: true },
                ].map(({ tab, emoji, title, desc, highlight }) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`zen-card p-5 rounded-2xl flex items-center gap-4 group text-left w-full ${
                      highlight ? 'bg-gradient-to-br from-[#3d633b] to-[#254124] border-transparent' : ''
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform ${
                      highlight ? 'bg-white/20' : 'bg-[#e2ebe0]'
                    }`}>
                      {emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-display text-base font-bold leading-snug group-hover:text-[#3d633b] transition-colors ${highlight ? 'text-white group-hover:text-white' : 'text-[#1f2721]'}`}>
                        {title}
                      </h3>
                      <p className={`text-xs mt-0.5 truncate ${highlight ? 'text-white/70' : 'text-[#6e7d70]'}`}>
                        {desc}
                      </p>
                    </div>
                    <ArrowRight className={`w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform ${highlight ? 'text-white/70' : 'text-[#9aab9c]'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Products */}
            <div className="space-y-5 reveal">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif-zen text-3xl font-bold text-[#1f2721]">
                    Nổi Bật Hôm Nay
                  </h2>
                  <p className="text-xs text-[#7c674e] mt-1">
                    Những vị trà được yêu thích nhất tuần này tại An Nhiên
                  </p>
                </div>
                <button
                  onClick={() => handleTabChange('menu')}
                  className="text-xs font-bold text-[#3d633b] hover:underline flex items-center gap-1.5 shrink-0"
                >
                  Xem Tất Cả
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {MENU_ITEMS.slice(0, 3).map((item, i) => (
                  <div key={item.id} className="reveal" style={{ animationDelay: `${i * 100}ms` }}>
                    <ProductCard
                      item={item}
                      onSelect={(p) => {
                        setSelectedProduct(p);
                        setIsProductModalOpen(true);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Review Marquee */}
            <div className="space-y-5 reveal">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-[#9aab9c]">
                  Cảm Nhận Từ Khách Hàng
                </span>
                <h2 className="font-serif-zen text-3xl font-bold text-[#1f2721] mt-1">
                  Họ Nói Về An Nhiên
                </h2>
              </div>
              <ReviewMarquee reviews={REVIEWS} />
            </div>

            {/* Contact Section */}
            <section id="contact" className="reveal pt-8 border-t border-[#7c674e]/15 space-y-6">
              <div className="text-center max-w-md mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#3d633b]">
                  Gửi Lời Nhắn
                </span>
                <h2 className="font-serif-zen text-3xl font-bold text-[#1f2721]">
                  Kết Nối Cùng An Nhiên
                </h2>
                <p className="text-sm text-[#7c674e] leading-relaxed">
                  Mọi thắc mắc, góp ý hay chỉ muốn chia sẻ chuyện trà — hãy nhắn cho quán nhé!
                </p>
              </div>

              <div className="max-w-md mx-auto zen-card p-6 md:p-8 rounded-3xl">
                {contactSubmitted ? (
                  <div className="text-center py-8 space-y-3 text-[#3d633b]">
                    <CheckCircle2 className="w-12 h-12 mx-auto" />
                    <p className="font-bold text-base">Đã Gửi Lời Nhắn!</p>
                    <p className="text-xs text-[#7c674e]">An Nhiên sẽ phản hồi bạn trong 24h.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Tên của bạn *"
                      className="zen-input w-full px-4 py-3 rounded-xl border border-[#7c674e]/20 bg-[#fcfbfa] text-sm"
                    />
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Lời nhắn gửi trà quán... 🍵"
                      className="zen-input w-full px-4 py-3 rounded-xl border border-[#7c674e]/20 bg-[#fcfbfa] text-sm resize-none"
                    />
                    <button
                      type="submit"
                      className="btn-primary btn-ripple w-full justify-center py-3.5"
                    >
                      Gửi Nhắn Cho Quán ✉️
                    </button>
                  </form>
                )}
              </div>
            </section>

          </div>
        </div>
      )}

      {/* ═══════════════════ MENU TAB ═══════════════════ */}
      {activeTab === 'menu' && (
        <div className="max-w-5xl mx-auto w-full px-4 pt-8 pb-24 space-y-8 animate-fadeIn">

          <div className="text-center max-w-md mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#3d633b]">
              Thưởng Trà Tĩnh Tâm
            </span>
            <h1 className="font-serif-zen text-4xl md:text-5xl font-bold text-[#1f2721]">
              Danh Mục Trà & Bánh
            </h1>
            <p className="text-sm text-[#7c674e] leading-relaxed">
              Pha chế thủ công từ nguyên liệu hữu cơ tươi mới mỗi ngày.
            </p>
          </div>

          {/* Search + Category */}
          <div className="space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#9aab9c]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm vị trà yêu thích..."
                className="zen-input w-full pl-11 pr-4 py-3 rounded-full border border-[#7c674e]/20 bg-[#fcfbfa] text-sm"
              />
            </div>

            <div className="cat-scroll scrollbar-hide">
              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-[#3d633b] text-white shadow-md shadow-[#3d633b]/30'
                      : 'bg-[#ece3d7]/70 text-[#1f2721] hover:bg-[#e2ebe0]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          {searchQuery && (
            <p className="text-xs text-[#9aab9c] font-medium">
              Tìm thấy {filteredMenuItems.length} kết quả cho "{searchQuery}"
            </p>
          )}

          {/* Products Grid */}
          {filteredMenuItems.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <div className="text-5xl">🍵</div>
              <p className="text-sm font-medium text-[#7c674e]">Không tìm thấy món trà phù hợp.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="text-xs text-[#3d633b] font-bold hover:underline"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map((item, i) => (
                <div key={item.id} className="reveal" style={{ animationDelay: `${(i % 6) * 80}ms` }}>
                  <ProductCard
                    item={item}
                    onSelect={(p) => {
                      setSelectedProduct(p);
                      setIsProductModalOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════ BLOG TAB ═══════════════════ */}
      {activeTab === 'blog' && (
        <div className="max-w-5xl mx-auto w-full px-4 pt-8 pb-24 space-y-8 animate-fadeIn">
          <div className="text-center max-w-md mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#3d633b]">
              Góc Tĩnh Tâm
            </span>
            <h1 className="font-serif-zen text-4xl md:text-5xl font-bold text-[#1f2721]">
              Nhật Ký Chuyện Trà
            </h1>
            <p className="text-sm text-[#7c674e] leading-relaxed">
              Những mẩu chuyện nhỏ về trà đạo, sống chậm và triết lý Wabi-Sabi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_ARTICLES.map((article, i) => (
              <div
                key={article.id}
                onClick={() => { setSelectedArticle(article); setIsBlogModalOpen(true); }}
                className="zen-card reveal rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div>
                  <div className="overflow-hidden bg-[#ece3d7]" style={{ aspectRatio: '16/9' }}>
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold text-[#3d633b] uppercase tracking-wider">
                      {article.category}
                    </span>
                    <h3 className="font-serif-zen text-base font-bold text-[#1f2721] group-hover:text-[#3d633b] transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#6e7d70] line-clamp-2 leading-relaxed">
                      {article.subtitle}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-3 text-[11px] text-[#9aab9c] flex items-center justify-between border-t border-[#7c674e]/10">
                  <span className="font-medium">{article.author}</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════ ZEN GEAR TAB ═══════════════════ */}
      {activeTab === 'zen-gear' && (
        <div className="max-w-5xl mx-auto w-full px-4 pt-8 pb-24 space-y-8 animate-fadeIn">
          <div className="text-center max-w-md mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#3d633b]">
              Trà Cụ Thật Sự
            </span>
            <h1 className="font-serif-zen text-4xl md:text-5xl font-bold text-[#1f2721]">
              Góc Đồ Hay Dùng
            </h1>
            <p className="text-sm text-[#7c674e] leading-relaxed">
              Dụng cụ pha trà, nến thơm và vật phẩm tĩnh tâm An Nhiên tin dùng.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ZEN_ITEMS.map((gear, i) => (
              <div
                key={gear.id}
                className="zen-card reveal rounded-2xl overflow-hidden flex flex-col"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="overflow-hidden bg-[#ece3d7] relative" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={gear.image}
                    alt={gear.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-400"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
                    {gear.tag}
                  </span>
                </div>
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-display text-sm font-bold text-[#1f2721] line-clamp-2 leading-snug">
                      {gear.title}
                    </h3>
                    <p className="text-[11px] text-[#6e7d70] line-clamp-2 mt-1">
                      {gear.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#7c674e]/10">
                    <span className="font-bold text-sm text-[#254124]">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(gear.price)}
                    </span>
                    <a
                      href={gear.shopeeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#7c674e] text-white text-[11px] font-semibold hover:bg-[#63513d] flex items-center gap-1 transition-colors"
                    >
                      Shopee
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════ RECIPES TAB ═══════════════════ */}
      {activeTab === 'recipes' && (
        <div className="max-w-5xl mx-auto w-full px-4 pt-8 pb-24 space-y-8 animate-fadeIn">
          <div className="text-center max-w-md mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#3d633b]">
              Bí Kíp Độc Quyền
            </span>
            <h1 className="font-serif-zen text-4xl md:text-5xl font-bold text-[#1f2721]">
              Công Thức Pha Trà Chuẩn Uji
            </h1>
            <p className="text-sm text-[#7c674e] leading-relaxed">
              Hướng dẫn tỉ mỉ từng bước để tự pha một ly Matcha tuyệt hảo tại nhà.
            </p>
          </div>

          <div className="space-y-6">
            {RECIPES.map((recipe, i) => (
              <div key={recipe.id} className="zen-card reveal p-6 md:p-8 rounded-3xl space-y-5" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#7c674e]/15 pb-4">
                  <h2 className="font-serif-zen text-2xl font-bold text-[#1f2721]">
                    {recipe.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
                    <span className="px-3 py-1.5 rounded-full bg-[#e2ebe0] text-[#254124]">
                      {recipe.difficulty}
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-[#ece3d7] text-[#7c674e]">
                      ⏱️ {recipe.time}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#3d633b] mb-3 flex items-center gap-2">
                      <Leaf className="w-3.5 h-3.5" />
                      Nguyên Liệu
                    </h3>
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-sm text-[#1f2721]">
                          <span className="w-2 h-2 rounded-full bg-[#3d633b] shrink-0" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#3d633b] mb-3 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      Thực Hiện
                    </h3>
                    <div className="space-y-2">
                      {recipe.steps.map((st, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="shrink-0 w-5 h-5 rounded-full bg-[#3d633b] text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-sm text-[#1f2721] leading-relaxed">{st}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#e2ebe0] to-[#f7f4ef] border border-[#3d633b]/15 text-sm text-[#254124]">
                  <span className="font-bold">💡 Bí kíp từ An Nhiên: </span>
                  <span className="italic">{recipe.proTip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer & Mobile Nav */}
      <Footer onOpenPolicy={handleOpenPolicy} />

      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        cartCount={cartCount}
        setIsCartOpen={setIsCartOpen}
        setIsReservationModalOpen={setIsReservationModalOpen}
      />

      {/* ── MODALS ── */}
      <ProductDetailModal
        item={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedCheckout={handleProceedCheckout}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        totals={checkoutTotals}
        onClearCart={() => setCartItems([])}
      />
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
      />
      <ZenSoundscapeModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
      />
      <BlogArticleModal
        article={selectedArticle}
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
      />
      <PolicyModal
        type={policyType}
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />
    </div>
  );
}
