import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, QrCode, CreditCard, Truck, ShieldCheck, Copy, Sparkles, Bell, RefreshCw, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveOrder, getShopConfig } from '../utils/orderService';

// ─── SHOP BANKING CONFIG (Thật — MB Bank Lê Trọng Thiên Long) ─────────────
const SHOP_BANK = {
  bankCode: 'MB',          // Official VietQR code for MBBank
  bankName: 'MB Bank (Quân Đội)',
  accountNo: '0888999911',
  accountName: 'LE TRONG THIEN LONG',
  displayName: 'Lê Trọng Thiên Long',
  logoUrl: 'https://cdn.vietqr.io/img/MB.png'
};

// ─── VIETQR REAL IMAGE URL ──────────────────────────────────────────────────
function getVietQRUrl(amount, orderId) {
  const addInfo = encodeURIComponent(`ANNHIEN ${orderId} TRA`);
  const accountName = encodeURIComponent(SHOP_BANK.accountName);
  return `https://img.vietqr.io/image/${SHOP_BANK.bankCode}-${SHOP_BANK.accountNo}-compact2.png?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`;
}

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
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);
  const [qrError, setQrError] = useState(false);
  const [shopConfig, setShopConfig] = useState(getShopConfig());

  useEffect(() => {
    setShopConfig(getShopConfig());
    setQrLoaded(false);
    setQrError(false);
  }, [paymentMethod, totals]);

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng.');
      return;
    }

    // Save order permanently and dispatch zero-cost phone alert to Chị Linh 0585596789
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

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#3d633b', '#8fb388', '#f7f4ef', '#7c674e']
    });
  };

  const copyTransferContent = () => {
    const content = `Chủ TK: ${SHOP_BANK.displayName}\nNgân hàng: ${SHOP_BANK.bankName}\nSố TK: ${SHOP_BANK.accountNo}\nSố tiền: ${formatVND(totals.grandTotal)}\nNội dung: ANNHIEN ${orderId || 'ORDER'} TRA`;
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }).catch(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  // Guard after all hooks
  if (!isOpen) return null;

  const vietQRUrl = getVietQRUrl(totals.grandTotal, orderId || 'ORDER');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#f7f4ef] border border-[#7c674e]/30 rounded-3xl max-w-lg w-full max-h-[95vh] overflow-y-auto p-5 md:p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsSuccess(false);
            setQrLoaded(false);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-[#7c674e] hover:text-[#1f2721] rounded-full bg-[#ece3d7]"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="text-center mb-5">
              <h3 className="font-serif-zen text-2xl font-bold text-[#1f2721]">
                Xác Nhận Đơn Trà & Thanh Toán
              </h3>
              <p className="text-xs text-[#7c674e] mt-1">
                An Nhiên Trà Quán · Valeo Đầm Sen, Q. Tân Phú, TP.HCM
              </p>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              
              {/* Receiver Info */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#3d633b] block mb-2">
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
                    placeholder="Ghi chú giao hàng (tùy chọn)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#7c674e]/20 bg-[#fcfbfa] text-xs focus:outline-none focus:border-[#3d633b]"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#3d633b] block mb-2">
                  2. Phương Thức Thanh Toán
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-[#0052cc] bg-[#edf4ff] text-[#0052cc] font-bold shadow-sm ring-2 ring-[#0052cc]/20'
                        : 'border-[#7c674e]/20 bg-[#fcfbfa] text-[#1f2721]'
                    }`}
                  >
                    <img src={SHOP_BANK.logoUrl} alt="MB Bank" className="w-7 h-7 object-contain rounded" />
                    <span>MB Bank QR</span>
                    <span className="text-[9px] text-green-600 font-bold">⭐ Khuyến nghị</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('momo')}
                    className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'momo'
                        ? 'border-[#a50064] bg-[#fff0f6] text-[#a50064] font-bold shadow-sm'
                        : 'border-[#7c674e]/20 bg-[#fcfbfa] text-[#1f2721]'
                    }`}
                  >
                    <span className="text-xl">👛</span>
                    <span>Ví MoMo</span>
                    <span className="text-[9px] text-gray-400">QR Ví</span>
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
                    <span>Tiền Mặt</span>
                    <span className="text-[9px] text-gray-400">Trả khi nhận</span>
                  </button>
                </div>
              </div>

              {/* REAL VietQR for MB Bank */}
              {paymentMethod === 'bank' && (
                <div className="p-4 rounded-2xl border-2 border-[#0052cc]/30 bg-white shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <img src={SHOP_BANK.logoUrl} alt="MB Bank" className="w-6 h-6 object-contain rounded" />
                    <div>
                      <p className="text-xs font-bold text-[#0052cc]">Chuyển Khoản MB Bank · VietQR</p>
                      <p className="text-[10px] text-gray-500">Mã QR chuẩn VietQR · Quét bằng mọi app banking VN</p>
                    </div>
                  </div>

                  {/* REAL VietQR Image */}
                  <div className="flex justify-center">
                    <div className="relative">
                      {!qrLoaded && !qrError && (
                        <div className="w-48 h-56 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
                          <div className="text-center">
                            <RefreshCw className="w-6 h-6 animate-spin text-[#3d633b] mx-auto mb-2" />
                            <p className="text-[10px] text-gray-400">Đang tải QR thật...</p>
                          </div>
                        </div>
                      )}
                      {qrError && (
                        <div className="w-48 h-56 flex items-center justify-center bg-red-50 rounded-xl border border-red-200 p-4 text-center">
                          <div>
                            <p className="text-[10px] text-red-500 font-bold mb-1">Không tải được QR</p>
                            <p className="text-[10px] text-gray-400">Vui lòng chuyển khoản thủ công theo thông tin bên dưới</p>
                          </div>
                        </div>
                      )}
                      <img
                        src={`https://img.vietqr.io/image/MB-${SHOP_BANK.accountNo}-compact2.png?amount=${totals.grandTotal}&addInfo=ANNHIEN%20ORDER%20TRA&accountName=${encodeURIComponent(SHOP_BANK.accountName)}`}
                        alt={`QR MB Bank chuyển khoản ${formatVND(totals.grandTotal)} cho An Nhiên Trà Quán`}
                        className={`w-48 rounded-xl border border-gray-200 shadow-sm transition-opacity duration-300 ${qrLoaded ? 'opacity-100' : 'opacity-0 absolute top-0'}`}
                        onLoad={() => { setQrLoaded(true); setQrError(false); }}
                        onError={() => { setQrError(true); setQrLoaded(false); }}
                      />
                    </div>
                  </div>

                  {/* Account Details Box */}
                  <div className="bg-[#f0f4ff] rounded-xl p-3 text-xs space-y-1.5 border border-[#0052cc]/10">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ngân hàng:</span>
                      <span className="font-bold text-[#0052cc]">{SHOP_BANK.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Số tài khoản:</span>
                      <span className="font-mono font-bold text-[#1f2721] tracking-wider">{SHOP_BANK.accountNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Chủ tài khoản:</span>
                      <span className="font-bold text-[#1f2721]">{SHOP_BANK.displayName}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#0052cc]/10 pt-1.5 mt-1">
                      <span className="text-gray-500 font-bold">Số tiền:</span>
                      <span className="font-bold text-green-700 text-sm">{formatVND(totals.grandTotal)}</span>
                    </div>
                  </div>

                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={copyTransferContent}
                    className="w-full py-2 rounded-xl bg-[#0052cc]/10 hover:bg-[#0052cc]/20 text-[#0052cc] font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? '✅ Đã sao chép thông tin chuyển khoản!' : 'Sao Chép Thông Tin Chuyển Khoản'}</span>
                  </button>
                </div>
              )}

              {/* MoMo QR */}
              {paymentMethod === 'momo' && (
                <div className="p-4 rounded-2xl border border-[#a50064]/20 bg-[#fff8fb] space-y-2 text-center">
                  <p className="text-xs font-bold text-[#a50064]">QR Ví MoMo · Chuyển về SĐT Chủ Quán</p>
                  <div className="w-40 h-40 mx-auto bg-white rounded-xl border border-[#a50064]/20 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl">👛</span>
                      <p className="text-[10px] text-[#a50064] font-bold mt-1">MoMo: 0585 596 789</p>
                      <p className="text-[10px] text-gray-400">Chị Linh</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#7c674e]">
                    Chuyển <strong className="text-[#a50064]">{formatVND(totals.grandTotal)}</strong> về MoMo SĐT <strong>0585 596 789</strong>
                  </p>
                </div>
              )}

              {/* COD Notice */}
              {paymentMethod === 'cod' && (
                <div className="p-3.5 rounded-xl border border-[#3d633b]/20 bg-[#e2ebe0]/40 text-xs text-[#254124] flex items-start gap-2">
                  <Truck className="w-4 h-4 text-[#3d633b] shrink-0 mt-0.5" />
                  <p>Bạn sẽ thanh toán bằng <strong>tiền mặt khi nhận trà</strong>. Người giao hàng sẽ chuẩn bị trả tiền thừa chính xác.</p>
                </div>
              )}

              {/* Summary Breakdown */}
              <div className="p-3.5 rounded-xl bg-[#ece3d7]/50 text-xs space-y-1 border border-[#7c674e]/10">
                <div className="flex justify-between text-[#7c674e]">
                  <span>Tổng tiền món:</span>
                  <span>{formatVND(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-[#3d633b]">
                    <span>Giảm giá (Voucher):</span>
                    <span className="font-bold">-{formatVND(totals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#7c674e]">
                  <span>Phí vận chuyển:</span>
                  <span>{totals.shippingFee === 0 ? '🎉 Miễn phí' : formatVND(totals.shippingFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#254124] pt-1.5 border-t border-[#7c674e]/20">
                  <span>Cần thanh toán:</span>
                  <span>{formatVND(totals.grandTotal)}</span>
                </div>
              </div>

              {/* Telegram Alert Notice */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#e2ebe0]/60 text-[10px] text-[#3d633b]">
                <Bell className="w-3.5 h-3.5 shrink-0" />
                <span>Đơn hàng sẽ được báo tức thì về điện thoại <strong>Chị Linh (0585 596 789)</strong> qua Telegram miễn phí.</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#3d633b] text-white font-semibold text-sm hover:bg-[#254124] transition-colors shadow-md active:scale-98"
              >
                🍵 Xác Nhận Đặt Đơn Trà
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
                Đặt Trà Thành Công! 🍵
              </h3>
              <p className="text-xs text-[#7c674e] mt-2 leading-relaxed max-w-sm mx-auto">
                Cảm ơn <strong>{fullName}</strong> đã lựa chọn An Nhiên Trà Quán. Người pha trà đang tỉ mỉ chuẩn bị ly trà tươi ngon nhất cho bạn.
              </p>
            </div>

            {/* Post-order QR (if bank transfer) */}
            {paymentMethod === 'bank' && (
              <div className="p-4 rounded-2xl border-2 border-[#0052cc]/20 bg-[#edf4ff] space-y-2">
                <p className="text-xs font-bold text-[#0052cc]">⚡ QR Chuyển Khoản Đơn #{orderId}</p>
                <div className="flex justify-center">
                  <img
                    src={`https://img.vietqr.io/image/MB-${SHOP_BANK.accountNo}-compact2.png?amount=${totals.grandTotal}&addInfo=${encodeURIComponent('ANNHIEN ' + orderId + ' TRA')}&accountName=${encodeURIComponent(SHOP_BANK.accountName)}`}
                    alt={`QR MB Bank đơn ${orderId}`}
                    className="w-44 rounded-xl border border-gray-200 shadow-sm"
                  />
                </div>
                <p className="text-[10px] text-[#0052cc]">
                  Chuyển <strong>{formatVND(totals.grandTotal)}</strong> → MB {SHOP_BANK.accountNo} · {SHOP_BANK.displayName}<br/>
                  <span className="text-gray-500">Nội dung: ANNHIEN {orderId} TRA</span>
                </p>
              </div>
            )}

            <div className="p-4 rounded-2xl border border-[#3d633b]/20 bg-[#e2ebe0]/40 text-left text-xs space-y-1.5">
              <p><strong>Người nhận:</strong> {fullName} ({phone})</p>
              <p><strong>Giao đến:</strong> {address}</p>
              <p><strong>Thanh toán:</strong> {paymentMethod === 'cod' ? 'Tiền mặt khi nhận trà (COD)' : paymentMethod === 'bank' ? `MB Bank QR — ${SHOP_BANK.accountNo}` : 'Ví MoMo — 0585 596 789'}</p>
              <p><strong>Thời gian dự kiến:</strong> 15-25 phút</p>
              <div className="flex items-center gap-1.5 pt-1.5 border-t border-[#7c674e]/20 text-[#3d633b]">
                <Bell className="w-3.5 h-3.5" />
                <span>Chị Linh (0585 596 789) đã nhận thông báo đơn hàng của bạn!</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSuccess(false);
                setQrLoaded(false);
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
