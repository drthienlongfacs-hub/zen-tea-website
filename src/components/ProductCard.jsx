import React from 'react';
import { Star, Plus, Clock, Sparkles } from 'lucide-react';

const BADGE_STYLE = {
  'Bán Chạy #1': 'badge-hot',
  'Bán Chạy': 'badge-hot',
  'Mới': 'badge-new',
  'Mới Ra Mắt': 'badge-new',
  'Giới Hạn': 'badge-limited',
  'Đặc Biệt': 'badge-limited',
};

export default function ProductCard({ item, onSelect }) {
  const formatVND = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const badgeClass = BADGE_STYLE[item.tag] || 'zen-badge';

  return (
    <div
      className="zen-card rounded-2xl overflow-hidden flex flex-col justify-between group cursor-pointer"
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(item)}
    >
      {/* ── Image Block with Hover Overlay ── */}
      <div className="product-card-wrap relative" style={{ aspectRatio: '3/2' }}>
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          style={{ transform: 'scale(1)' }}
          loading="lazy"
        />

        {/* Dark gradient overlay — hidden until hover */}
        <div className="card-overlay">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(item); }}
            className="w-full py-2.5 rounded-xl bg-white/95 text-[#254124] text-xs font-bold hover:bg-[#3d633b] hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-lg btn-ripple"
          >
            <Plus className="w-3.5 h-3.5" />
            Xem & Đặt Món
          </button>
        </div>

        {/* Badge */}
        {item.tag && (
          <span className={`absolute top-3 left-3 ${badgeClass} text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md`}>
            {item.tag}
          </span>
        )}

        {/* Prep time */}
        <span className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1 font-medium">
          <Clock className="w-3 h-3" />
          {item.prepTime}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="p-4 space-y-2 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base font-bold text-[#1f2721] group-hover:text-[#3d633b] transition-colors leading-snug truncate">
              {item.name}
            </h3>
            {item.jpName && (
              <p className="text-[11px] font-serif-zen text-[#7c674e] italic mt-0.5">
                {item.jpName}
              </p>
            )}
          </div>
          {/* Rating */}
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2 py-1 rounded-lg text-[11px] font-bold text-amber-700 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{item.rating}</span>
          </div>
        </div>

        <p className="text-xs text-[#6e7d70] line-clamp-2 leading-relaxed flex-1">
          {item.desc}
        </p>

        {/* Footer: Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-[#7c674e]/10">
          <div>
            <span className="text-[10px] text-[#9aab9c] uppercase tracking-wider block font-medium">Từ</span>
            <span className="font-display text-lg font-bold text-[#254124] leading-none">
              {formatVND(item.price)}
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(item); }}
            className="px-4 py-2.5 rounded-xl bg-[#3d633b] text-white text-xs font-semibold hover:bg-[#254124] transition-all flex items-center gap-1.5 shadow-sm active:scale-95 btn-ripple group-hover:shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            Đặt Món
          </button>
        </div>
      </div>
    </div>
  );
}
