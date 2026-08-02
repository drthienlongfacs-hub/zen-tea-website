import React from 'react';
import { Home, Coffee, BookOpen, ShoppingBag, Calendar, ShoppingCart } from 'lucide-react';

export default function MobileBottomNav({ activeTab, setActiveTab, cartCount, setIsCartOpen, setIsReservationModalOpen }) {
  const tabs = [
    { id: 'home',     label: 'Trang Chủ',  icon: Home },
    { id: 'blog',     label: 'Chuyện Trà', icon: BookOpen },
    { id: 'menu',     label: 'Đặt Món',    icon: Coffee,    isCTA: true },
    { id: 'zen-gear', label: 'Trà Cụ',     icon: ShoppingBag },
    { id: 'cart',     label: 'Giỏ Hàng',  icon: ShoppingCart, isCart: true },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden glass-panel border-t border-[#7c674e]/15 shadow-2xl">
      {/* Safe area support */}
      <div className="grid grid-cols-5 items-end px-1 pb-safe" style={{ height: '64px', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {tabs.map(({ id, label, icon: Icon, isCTA, isCart }) => {
          const isActive = isCart ? cartCount > 0 : activeTab === id;

          if (isCTA) {
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="relative flex flex-col items-center justify-end pb-1 text-[10px] font-bold text-[#3d633b]"
                aria-label={label}
              >
                <span className="absolute -top-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#3d633b] to-[#254124] text-white shadow-xl shadow-[#3d633b]/40 ring-4 ring-[#f7f4ef] active:scale-95 transition-transform">
                  <Icon className="w-6 h-6" />
                </span>
                <span className="mt-8 text-[#3d633b] font-bold">{label}</span>
              </button>
            );
          }

          if (isCart) {
            return (
              <button
                key={id}
                onClick={() => setIsCartOpen(true)}
                className="relative flex flex-col items-center justify-center h-full gap-0.5 text-[10px] font-medium text-[#7c674e] hover:text-[#3d633b] transition-colors"
                aria-label={`Giỏ hàng ${cartCount} món`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-colors ${cartCount > 0 ? 'text-[#3d633b]' : ''}`} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#c2410c] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
                <span className={cartCount > 0 ? 'text-[#3d633b] font-semibold' : ''}>{label}</span>
              </button>
            );
          }

          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center justify-center h-full gap-0.5 text-[10px] font-medium transition-all ${
                activeTab === id ? 'text-[#3d633b]' : 'text-[#7c674e]'
              }`}
              aria-label={label}
            >
              <div className={`p-1 rounded-lg transition-all ${activeTab === id ? 'bg-[#e2ebe0]' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={activeTab === id ? 'font-semibold' : ''}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
