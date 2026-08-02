import React, { useState } from 'react';
import { X, CheckCircle2, QrCode, CreditCard, Truck, ShieldCheck, Copy, Sparkles, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveOrder } from '../utils/orderService';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  totals,
  onClearCart
}) {
  // ✅ All hooks declared BEFORE any early return (Rules of Hooks)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng.');
      return;
    }

    // Save order permanently and dispatch zero-cost phone alert to 0585596789
    const createdOrder = saveOrder({
      fullName,
      phone,
      address,
      notes,
      paymentMethod,
      cartItems,
      totals
    });

    setOrderId(createdOrder.id);
    setIsSuccess(true);
    onClearCart();

    // Trigger confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };


  const copyQRContent = () => {
    navigator.clipboard.writeText(`AN NHIEN TRA QUAN - CHUYEN KHOAN DON HANG ${orderId || 'AN9999'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Guard after all hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#f7f4ef] border border-[#7c674e]/30 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsSuccess(false);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-[#7c674e] hover:text-[#1f2721] rounded-full bg-[#ece3d7]"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="text-center mb-6">
              <h3 className="font-serif-zen text-2xl font-bold text-[#1f2721]">
                Xác Nhận Đơn Trà & Giao Hàng
              </h3>
              <p className="text-xs text-[#7c674e] mt-1">
                An Nhiên Trà Quán sẽ pha chế trà tươi và giao đến bạn nhanh nhất!
              </p>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              
              {/* Receiver Info */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#3d633b] block mb-1">
                  1. Thông Tin Người Nhận
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Họ và tên người nhận *"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#7c674e]/20 bg-[#fcfbfa] text-xs focus:outline-none focus:border-[#3d633b]"
                  />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Số điện thoại liên hệ *"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#7c674e]/20 bg-[#fcfbfa] text-xs focus:outline-none focus:border-[#3d633b]"
                  />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Địa chỉ giao trà tận nơi *"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#7c674e]/20 bg-[#fcfbfa] text-xs focus:outline-none focus:border-[#3d633b]"
                  />
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ghi chú giao hàng (VD: Giao trước 4h chiều...)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#7c674e]/20 bg-[#fcfbfa] text-xs focus:outline-none focus:border-[#3d633b]"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#3d633b] block mb-1">
                  2. Phương Thức Thanh Toán
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('momo')}
                    className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'momo'
                        ? 'border-[#a50064] bg-[#fff0f6] text-[#a50064] font-bold shadow-sm'
                        : 'border-[#7c674e]/20 bg-[#fcfbfa] text-[#1f2721]'
                    }`}
                  >
                    <span className="text-lg">👛</span>
                    <span>Ví MoMo / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-[#0052cc] bg-[#edf4ff] text-[#0052cc] font-bold shadow-sm'
                        : 'border-[#7c674e]/20 bg-[#fcfbfa] text-[#1f2721]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#0052cc]" />
                    <span>Chuyển Khoản QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#3d633b] bg-[#e2ebe0] text-[#254124] font-bold shadow-sm'
                        : 'border-[#7c674e]/20 bg-[#fcfbfa] text-[#1f2721]'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-[#3d633b]" />
                    <span>Tiền Mặt (COD)</span>
                  </button>
                </div>
              </div>

              {/* QR Code Interactive Preview */}
              {(paymentMethod === 'momo' || paymentMethod === 'bank') && (
                <div className="p-4 rounded-2xl border border-[#7c674e]/20 bg-white text-center space-y-2">
                  <p className="text-xs font-bold text-[#1f2721]">
                    Mã QR Thanh Toán Tự Động ({paymentMethod === 'momo' ? 'MoMo' : 'VietQR Techcombank'})
                  </p>
                  <div className="w-36 h-36 mx-auto bg-gray-100 rounded-xl p-2 border border-gray-200 flex flex-col items-center justify-center relative">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AN_NHIEN_TRA_QUAN_${totals.grandTotal}`}
                      alt="QR Payment"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-[#7c674e]">
                    Số tiền: <strong className="text-[#254124] text-xs">{formatVND(totals.grandTotal)}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={copyQRContent}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3d633b] hover:underline"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Đã sao chép nội dung CK!' : 'Sao chép cú pháp chuyển khoản'}</span>
                  </button>
                </div>
              )}

              {/* Summary Breakdown */}
              <div className="p-3.5 rounded-xl bg-[#ece3d7]/50 text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Tổng tiền món:</span>
                  <span>{formatVND(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Giảm giá:</span>
                  <span className="text-[#3d633b]">-{formatVND(totals.discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>{totals.shippingFee === 0 ? 'Miễn phí' : formatVND(totals.shippingFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#254124] pt-1 border-t border-[#7c674e]/20">
                  <span>Cần thanh toán:</span>
                  <span>{formatVND(totals.grandTotal)}</span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#3d633b] text-white font-semibold text-sm hover:bg-[#254124] transition-colors shadow-md active:scale-98"
              >
                Xác Nhận Đặt Đơn Trà
              </button>

            </form>
          </div>
        ) : (
          /* Order Confirmation Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#e2ebe0] text-[#3d633b] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#e2ebe0] text-[#254124] text-xs font-bold mb-2">
                Mã Đơn Hàng: #{orderId}
              </span>
              <h3 className="font-serif-zen text-2xl font-bold text-[#1f2721]">
                Đặt Trà Thành Công!
              </h3>
              <p className="text-xs text-[#7c674e] mt-2 leading-relaxed max-w-sm mx-auto">
                Cảm ơn <strong>{fullName}</strong> đã lựa chọn An Nhiên Trà Quán. Người pha trà đang tỉ mỉ chuẩn bị ly trà tươi ngon nhất cho bạn.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#3d633b]/20 bg-[#e2ebe0]/40 text-left text-xs space-y-1.5">
              <p><strong>Người nhận:</strong> {fullName} ({phone})</p>
              <p><strong>Giao đến:</strong> {address}</p>
              <p><strong>Thanh toán:</strong> {paymentMethod === 'cod' ? 'Tiền mặt khi nhận trà (COD)' : 'Đã xác nhận QR'}</p>
              <p><strong>Thời gian dự kiến:</strong> 15-25 phút</p>
            </div>

            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-[#3d633b] text-white font-semibold text-sm hover:bg-[#254124] transition-colors shadow-md"
            >
              Hoàn Tất & Về Trang Chủ
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
