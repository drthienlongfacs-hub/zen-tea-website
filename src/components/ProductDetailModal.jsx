import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, Coffee, Check, MessageSquare } from 'lucide-react';

export default function ProductDetailModal({ item, isOpen, onClose, onAddToCart }) {
  // ✅ Declare all hooks FIRST (Rules of Hooks compliance)
  const [selectedSize, setSelectedSize] = useState(item?.sizes?.[0] || { name: 'Vừa', price: 0 });
  const [selectedSweetness, setSelectedSweetness] = useState('50% Ngọt Dịu');
  const [selectedIce, setSelectedIce] = useState('Ít Đá (Giữ Vị)');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (item && item.sizes && item.sizes.length > 0) {
      setSelectedSize(item.sizes[0]);
      setSelectedToppings([]);
      setQuantity(1);
      setNote('');
    }
  }, [item?.id]);

  // Guard after all hooks
  if (!isOpen || !item) return null;

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const toggleTopping = (topping) => {
    if (selectedToppings.find(t => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  // Calculate live total unit price
  const toppingsTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const unitPrice = item.price + (selectedSize.price || 0) + toppingsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart({
      item,
      size: selectedSize,
      sweetness: selectedSweetness,
      ice: selectedIce,
      toppings: selectedToppings,
      quantity,
      note,
      unitPrice,
      totalPrice
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#f7f4ef] border border-[#7c674e]/30 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7c674e] hover:text-[#1f2721] rounded-full bg-[#ece3d7] z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Item Header Image & Title */}
        <div className="flex gap-4 mb-6 pb-6 border-b border-[#7c674e]/15">
          <img
            src={item.image}
            alt={item.name}
            className="w-24 h-24 rounded-2xl object-cover border border-[#7c674e]/20 shrink-0"
          />
          <div>
            <h3 className="font-display text-lg font-bold text-[#1f2721]">
              {item.name}
            </h3>
            {item.jpName && (
              <p className="text-xs font-serif-zen text-[#7c674e] italic mb-1">
                {item.jpName}
              </p>
            )}
            <p className="text-xs text-[#6e7d70] line-clamp-2 leading-relaxed mb-2">
              {item.desc}
            </p>
            <span className="font-display text-base font-bold text-[#254124]">
              {formatVND(item.price)}
            </span>
          </div>
        </div>

        {/* Customization Options */}
        <div className="space-y-5">
          
          {/* Size Option */}
          {item.sizes && item.sizes.length > 0 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#3d633b] block mb-2">
                1. Chọn Kích Cỡ (Size)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.sizes.map((sz, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedSize.name === sz.name
                        ? 'border-[#3d633b] bg-[#e2ebe0] text-[#254124] font-bold'
                        : 'border-[#7c674e]/20 bg-[#fcfbfa] text-[#1f2721]'
                    }`}
                  >
                    <span>{sz.name}</span>
                    <span className="text-[11px] text-[#7c674e]">
                      {sz.price > 0 ? `+${formatVND(sz.price)}` : 'Gốc'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sweetness Option */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#3d633b] block mb-2">
              2. Mức Độ Ngọt (Mật Ong / Đường Cỏ Ngọt)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Không Đường', '50% Ngọt Dịu', '100% Chuẩn Quán'].map((sw) => (
                <button
                  key={sw}
                  onClick={() => setSelectedSweetness(sw)}
                  className={`px-2.5 py-2 rounded-xl border text-xs font-medium text-center transition-colors ${
                    selectedSweetness === sw
                      ? 'border-[#3d633b] bg-[#e2ebe0] text-[#254124] font-bold'
                      : 'border-[#7c674e]/20 bg-[#fcfbfa] text-[#1f2721]'
                  }`}
                >
                  {sw}
                </button>
              ))}
            </div>
          </div>

          {/* Ice Option */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#3d633b] block mb-2">
              3. Chọn Nhiệt Độ / Đá
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Uống Nóng (80°C)', 'Ít Đá (Giữ Vị)', 'Đá Riêng'].map((ic) => (
                <button
                  key={ic}
                  onClick={() => setSelectedIce(ic)}
                  className={`px-2.5 py-2 rounded-xl border text-xs font-medium text-center transition-colors ${
                    selectedIce === ic
                      ? 'border-[#3d633b] bg-[#e2ebe0] text-[#254124] font-bold'
                      : 'border-[#7c674e]/20 bg-[#fcfbfa] text-[#1f2721]'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Toppings Option */}
          {item.toppings && item.toppings.length > 0 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#3d633b] block mb-2">
                4. Topping Thêm (Thưởng Thức Trọn Vẹn)
              </label>
              <div className="space-y-2">
                {item.toppings.map((top) => {
                  const isChecked = !!selectedToppings.find(t => t.id === top.id);
                  return (
                    <button
                      key={top.id}
                      onClick={() => toggleTopping(top)}
                      className={`w-full p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-colors ${
                        isChecked
                          ? 'border-[#3d633b] bg-[#e2ebe0] text-[#254124]'
                          : 'border-[#7c674e]/20 bg-[#fcfbfa] text-[#1f2721]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-[#3d633b] border-[#3d633b] text-white' : 'border-[#7c674e]'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span>{top.name}</span>
                      </div>
                      <span className="font-semibold text-[#7c674e]">
                        +{formatVND(top.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Note Input */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#3d633b] block mb-2">
              Ghi Chú Cho Người Pha Trà
            </label>
            <div className="relative">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Đánh bọt matcha kỹ hơn giúp mình..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#7c674e]/20 bg-[#fcfbfa] text-xs focus:outline-none focus:border-[#3d633b]"
              />
            </div>
          </div>

        </div>

        {/* Footer Actions: Quantity & Add to Cart */}
        <div className="mt-8 pt-4 border-t border-[#7c674e]/15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 border border-[#7c674e]/20 rounded-full p-1 bg-[#ece3d7]/50">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full bg-white text-[#1f2721] flex items-center justify-center hover:bg-[#3d633b] hover:text-white transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-bold text-sm text-[#1f2721]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full bg-white text-[#1f2721] flex items-center justify-center hover:bg-[#3d633b] hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#3d633b] text-white font-semibold text-sm hover:bg-[#254124] transition-colors shadow-md flex items-center justify-between"
          >
            <span>Thêm Vào Giỏ</span>
            <span className="font-bold">{formatVND(totalPrice)}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
