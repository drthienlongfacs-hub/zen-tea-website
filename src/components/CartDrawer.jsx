import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Coffee, Ticket, ArrowRight } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout
}) {
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');

  if (!isOpen) return null;

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shippingFee = subtotal >= 150000 || subtotal === 0 ? 0 : 20000;
  
  const handleApplyVoucher = (codeToApply) => {
    const code = (codeToApply || voucherCode).trim().toUpperCase();
    if (code === 'THIEN2026') {
      setAppliedVoucher({ code: 'THIEN2026', type: 'percent', value: 20, text: 'Giảm 20% tổng đơn' });
      setVoucherError('');
      setVoucherCode('THIEN2026');
    } else if (code === 'ANNHIEN10') {
      setAppliedVoucher({ code: 'ANNHIEN10', type: 'percent', value: 10, text: 'Giảm 10% tổng đơn' });
      setVoucherError('');
      setVoucherCode('ANNHIEN10');
    } else if (code === 'MATCHA30') {
      setAppliedVoucher({ code: 'MATCHA30', type: 'fixed', value: 30000, text: 'Giảm 30.000đ' });
      setVoucherError('');
      setVoucherCode('MATCHA30');
    } else {
      setVoucherError('Mã không hợp lệ. Chọn mã có sẵn bên dưới!');
    }
  };

  let discount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === 'percent') {
      discount = Math.round(subtotal * (appliedVoucher.value / 100));
    } else if (appliedVoucher.type === 'fixed') {
      discount = Math.min(subtotal, appliedVoucher.value);
    }
  }

  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#f7f4ef] border-l border-[#7c674e]/30 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#7c674e]/15 pb-4">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-[#3d633b]" />
            <h3 className="font-serif-zen text-xl font-bold text-[#1f2721]">
              Giỏ Hàng Thưởng Trà ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#7c674e] hover:text-[#1f2721] rounded-full bg-[#ece3d7]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#e2ebe0] text-[#3d633b] flex items-center justify-center mx-auto text-2xl">
                🍵
              </div>
              <p className="text-sm font-medium text-[#1f2721]">Giỏ hàng của bạn đang trống</p>
              <p className="text-xs text-[#7c674e]">Hãy chọn cho mình một ly Matcha chuẩn vị để thưởng thức nhé!</p>
            </div>
          ) : (
            cartItems.map((cartItem, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-[#7c674e]/15 bg-[#fcfbfa] flex gap-3 relative"
              >
                <img
                  src={cartItem.item.image}
                  alt={cartItem.item.name}
                  className="w-16 h-16 rounded-xl object-cover border border-[#7c674e]/15 shrink-0"
                />
                <div className="flex-1 min-w-0 pr-6">
                  <h4 className="text-xs font-bold text-[#1f2721] truncate">
                    {cartItem.item.name}
                  </h4>
                  <p className="text-[11px] text-[#7c674e]">
                    Size: {cartItem.size.name} · {cartItem.sweetness} · {cartItem.ice}
                  </p>
                  {cartItem.toppings.length > 0 && (
                    <p className="text-[10px] text-[#3d633b] font-medium truncate">
                      Topping: {cartItem.toppings.map(t => t.name).join(', ')}
                    </p>
                  )}
                  {cartItem.note && (
                    <p className="text-[10px] text-amber-700 italic truncate">
                      Ghi chú: {cartItem.note}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#7c674e]/10">
                    <span className="font-bold text-xs text-[#254124]">
                      {formatVND(cartItem.totalPrice)}
                    </span>
                    <div className="flex items-center gap-2 border border-[#7c674e]/20 rounded-full px-2 py-0.5 bg-white">
                      <button
                        onClick={() => onUpdateQuantity(idx, cartItem.quantity - 1)}
                        className="text-[#7c674e] hover:text-[#1f2721]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(idx, cartItem.quantity + 1)}
                        className="text-[#7c674e] hover:text-[#1f2721]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(idx)}
                  className="absolute top-3 right-3 text-[#7c674e]/60 hover:text-[#c2410c]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Voucher */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#7c674e]/15 pt-4 space-y-3">
            
            {/* Voucher Box */}
            <div className="space-y-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Nhập mã ưu đãi (THIEN2026)"
                  className="flex-1 px-3 py-2 rounded-xl border border-[#7c674e]/20 bg-[#fcfbfa] text-xs focus:outline-none focus:border-[#3d633b] uppercase"
                />
                <button
                  onClick={() => handleApplyVoucher()}
                  className="px-3 py-2 rounded-xl bg-[#7c674e] text-white text-xs font-semibold hover:bg-[#63513d]"
                >
                  Áp Dụng
                </button>
              </div>

              {/* 1-click preset voucher tags */}
              <div className="flex gap-1.5 pt-1">
                {[
                  { code: 'THIEN2026', label: 'THIEN2026 (-20%)' },
                  { code: 'ANNHIEN10', label: 'ANNHIEN10 (-10%)' },
                  { code: 'MATCHA30', label: 'MATCHA30 (-30k)' }
                ].map(v => (
                  <button
                    key={v.code}
                    type="button"
                    onClick={() => handleApplyVoucher(v.code)}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border transition-all ${
                      appliedVoucher?.code === v.code
                        ? 'bg-[#3d633b] text-white border-[#3d633b]'
                        : 'bg-[#e2ebe0]/60 text-[#254124] border-[#3d633b]/20 hover:bg-[#3d633b] hover:text-white'
                    }`}
                  >
                    🏷️ {v.label}
                  </button>
                ))}
              </div>

              {appliedVoucher && (
                <p className="text-[11px] text-[#3d633b] font-semibold flex items-center gap-1 pt-1">
                  <Ticket className="w-3.5 h-3.5" /> Áp dụng thành công: {appliedVoucher.text}!
                </p>
              )}
              {voucherError && (
                <p className="text-[11px] text-[#c2410c]">{voucherError}</p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#7c674e]">
                <span>Tạm tính:</span>
                <span>{formatVND(subtotal)}</span>
              </div>
              {appliedVoucher && (
                <div className="flex justify-between text-[#3d633b] font-medium">
                  <span>Giảm giá (Mã THIEN2026):</span>
                  <span>-{formatVND(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#7c674e]">
                <span>Phí giao hàng:</span>
                <span>{shippingFee === 0 ? 'Miễn phí (Đơn >150k)' : formatVND(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-[#1f2721] font-bold text-sm pt-2 border-t border-[#7c674e]/15">
                <span>Tổng thanh toán:</span>
                <span className="text-[#254124] text-base">{formatVND(grandTotal)}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onProceedCheckout({ subtotal, discount, shippingFee, grandTotal });
              }}
              className="w-full py-3.5 rounded-2xl bg-[#3d633b] text-white font-semibold text-sm hover:bg-[#254124] transition-colors shadow-md flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Tiến Hành Đặt Hàng</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
