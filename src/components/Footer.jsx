import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onOpenPolicy }) {
  return (
    <footer className="bg-[#232b25] text-[#e2ebe0] pt-16 pb-28 md:pb-16 mt-20 border-t border-[#3d633b]/30">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Col 1: Brand Info */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#3d633b] text-[#f7f4ef] flex items-center justify-center font-serif-zen text-lg">
              安
            </div>
            <span className="font-display text-xl font-bold text-[#f7f4ef]">
              An Nhiên <span className="text-[#8fb388]">.</span> Trà Quán
            </span>
          </div>
          <p className="text-xs text-[#a0b2a3] leading-relaxed">
            Góc nhỏ dành cho những tâm hồn yêu Matcha, mê viết và tìm kiếm sự tĩnh lặng giữa nhịp sống hối hả.
          </p>
          <blockquote className="italic text-[11px] text-[#8fb388] border-l-2 border-[#3d633b] pl-3 py-1">
            "Sống chậm một chút, pha một ly matcha, kể một câu chuyện — đó là niềm hạnh phúc đơn sơ."
          </blockquote>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <h4 className="font-serif-zen text-base font-semibold text-[#f7f4ef] mb-3 tracking-wider uppercase">
            Khám Phá
          </h4>
          <ul className="space-y-2 text-xs text-[#a0b2a3]">
            <li><a href="#menu" className="hover:text-[#8fb388] transition-colors">🍵 Thưởng Trà & Menu Online</a></li>
            <li><a href="#blog" className="hover:text-[#8fb388] transition-colors">📖 Nhật Ký Chuyện Trà</a></li>
            <li><a href="#zen-gear" className="hover:text-[#8fb388] transition-colors">🛍️ Dụng Cụ Trà Cụ Wabi-Sabi</a></li>
            <li><a href="#recipes" className="hover:text-[#8fb388] transition-colors">✨ Công Thức Pha Uji Matcha</a></li>
            <li><a href="#reservation" className="hover:text-[#8fb388] transition-colors">⛩️ Đặt Bàn Thưởng Trà Tĩnh Tâm</a></li>
          </ul>
        </div>

        {/* Col 3: Contact & Hours */}
        <div>
          <h4 className="font-serif-zen text-base font-semibold text-[#f7f4ef] mb-3 tracking-wider uppercase">
            Liên Hệ & Ghé Quán
          </h4>
          <ul className="space-y-2.5 text-xs text-[#a0b2a3]">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#8fb388] shrink-0 mt-0.5" />
              <span>Chung cư Valeo Đầm Sen, 318/5 Trịnh Đình Trọng, P. Hòa Thạnh, Q. Tân Phú, TP.HCM</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#8fb388] shrink-0" />
              <a href="tel:0585596789" className="hover:text-white">Hotline: 0585 596 789 (Chị Linh)</a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8fb388] shrink-0" />
              <span>08:00 - 21:30 (Tất cả các ngày)</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Policies & Regulatory */}
        <div>
          <h4 className="font-serif-zen text-base font-semibold text-[#f7f4ef] mb-3 tracking-wider uppercase">
            Chính Sách & Tuân Thủ
          </h4>
          <ul className="space-y-2 text-xs text-[#a0b2a3]">
            <li>
              <button onClick={() => onOpenPolicy('privacy')} className="hover:text-[#8fb388] transition-colors">
                Chính sách bảo mật thông tin
              </button>
            </li>
            <li>
              <button onClick={() => onOpenPolicy('refund')} className="hover:text-[#8fb388] transition-colors">
                Chính sách đổi trả & hoàn tiền
              </button>
            </li>
            <li>
              <button onClick={() => onOpenPolicy('shipping')} className="hover:text-[#8fb388] transition-colors">
                Chính sách giao nhận & kiểm hàng
              </button>
            </li>
            <li>
              <button onClick={() => onOpenPolicy('payment')} className="hover:text-[#8fb388] transition-colors">
                Phương thức thanh toán MoMo / QR
              </button>
            </li>
          </ul>
          <div className="mt-4 pt-3 border-t border-[#3d633b]/30 flex items-center gap-2 text-[10px] text-[#7a8c7e]">
            <ShieldCheck className="w-4 h-4 text-[#8fb388]" />
            <span>Đang đăng ký hoạt động với Sở Công Thương Việt Nam</span>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto px-4 mt-10 pt-6 border-t border-[#3d633b]/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7a8c7e]">
        <p>© 2026 An Nhiên Trà Quán — Matcha & Chuyện Trà. All rights reserved.</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0">
          <span>Xây dựng với tâm từ bi & triết lý Wabi-Sabi</span>
          <Heart className="w-3 h-3 text-[#c2410c] fill-[#c2410c]" />
        </p>
      </div>
    </footer>
  );
}
