import React, { useState } from 'react';
import { X, Calendar, Clock, Users, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveReservation } from '../utils/orderService';

export default function ReservationModal({ isOpen, onClose }) {
  // ✅ All hooks declared BEFORE any early return (Rules of Hooks)
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState('Phòng Trà Tĩnh Lặng (Ấm cúng, thiền định)');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [resId, setResId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !date) {
      alert('Vui lòng chọn ngày và điền tên, số điện thoại.');
      return;
    }

    const created = saveReservation({
      name,
      phone,
      date,
      time,
      guests,
      roomType
    });

    setResId(created.id);
    setIsBooked(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Guard after all hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#f7f4ef] border border-[#7c674e]/30 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        
        <button
          onClick={() => {
            setIsBooked(false);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-[#7c674e] hover:text-[#1f2721] rounded-full bg-[#ece3d7]"
        >
          <X className="w-5 h-5" />
        </button>

        {!isBooked ? (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2ebe0] text-[#254124] text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Thưởng Trà Tĩnh Tâm</span>
              </div>
              <h3 className="font-serif-zen text-2xl font-bold text-[#1f2721]">
                Đặt Bàn / Phòng Trà Zen
              </h3>
              <p className="text-xs text-[#7c674e] mt-1">
                Để quán dành riêng cho bạn một không gian yên tĩnh tuyệt đối.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#3d633b] block mb-1">
                    Ngày Ghé Quán *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#7c674e]/20 bg-[#fcfbfa] text-xs focus:outline-none focus:border-[#3d633b]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#3d633b] block mb-1">
                    Khung Giờ *
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#7c674e]/20 bg-[#fcfbfa] text-xs focus:outline-none focus:border-[#3d633b]"
                  >
                    <option value="09:00">09:00 - Sáng Tĩnh Tỉnh</option>
                    <option value="14:00">14:00 - Chiều Thưởng Trà</option>
                    <option value="17:00">17:00 - Hoàng Hôn Yên Bình</option>
                    <option value="19:30">19:30 - Mưa Đêm Hiên Trà</option>
                  </select>
                </div>
              </div>

              {/* Guests & Room */}
              <div>
                <label className="text-xs font-bold text-[#3d633b] block mb-1">
                  Số Lượng Khách Uống Trà
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuests(num)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                        guests === num
                          ? 'border-[#3d633b] bg-[#e2ebe0] text-[#254124]'
                          : 'border-[#7c674e]/20 bg-[#fcfbfa] text-[#1f2721]'
                      }`}
                    >
                      {num} Khách
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#3d633b] block mb-1">
                  Không Gian Ưa Thích
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#7c674e]/20 bg-[#fcfbfa] text-xs focus:outline-none focus:border-[#3d633b]"
                >
                  <option value="Phòng Trà Tĩnh Lặng">Phòng Trà Tĩnh Lặng (Trong nhà, ấm cúng)</option>
                  <option value="Ban Công Trúc Xanh">Ban Công Trúc Xanh (Thoáng mát, ngắm cảnh)</option>
                  <option value="Sân Vườn Wabi-Sabi">Sân Vườn Wabi-Sabi (Gần gụi thiên nhiên)</option>
                </select>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Họ và tên của bạn *"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#7c674e]/20 bg-[#fcfbfa] text-xs focus:outline-none focus:border-[#3d633b]"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Số điện thoại *"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#7c674e]/20 bg-[#fcfbfa] text-xs focus:outline-none focus:border-[#3d633b]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#3d633b] text-white font-semibold text-sm hover:bg-[#254124] transition-colors shadow-md"
              >
                Xác Nhận Giữ Bàn Tĩnh Tâm
              </button>

            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#e2ebe0] text-[#3d633b] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="font-serif-zen text-2xl font-bold text-[#1f2721]">
              Đã Giữ Bàn Cho Bạn!
            </h3>
            <p className="text-xs text-[#7c674e] max-w-xs mx-auto leading-relaxed">
              Trà quán đã ghi nhận lịch hẹn thưởng trà của <strong>{name}</strong> vào ngày <strong>{date}</strong> lúc <strong>{time}</strong>.
            </p>

            <button
              onClick={() => {
                setIsBooked(false);
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-[#3d633b] text-white font-semibold text-sm hover:bg-[#254124] transition-colors shadow-md"
            >
              Hoàn Tất
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
