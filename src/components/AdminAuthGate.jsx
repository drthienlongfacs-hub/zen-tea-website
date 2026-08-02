import React, { useEffect, useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import {
  hasAdminPassword,
  setAdminPassword,
  verifyAdminPassword,
  isAdminSessionUnlocked,
  unlockAdminSession
} from '../utils/orderService';

// Chặn người lạ mở thẳng trang Admin POS. Đây là site tĩnh (không có máy chủ),
// nên mật khẩu chỉ ngăn người xem thông thường — không thay thế đăng nhập máy chủ thật.
export default function AdminAuthGate({ children, onCancel }) {
  const [ready, setReady] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setNeedsSetup(!hasAdminPassword());
    setUnlocked(isAdminSessionUnlocked());
    setReady(true);
  }, []);

  if (!ready) return null;
  if (unlocked) return children;

  const handleSetup = async (e) => {
    e.preventDefault();
    setError('');
    if (pw.length < 4) { setError('Mật khẩu cần ít nhất 4 ký tự.'); return; }
    if (pw !== pw2) { setError('Hai mật khẩu bạn nhập không khớp nhau.'); return; }
    await setAdminPassword(pw);
    unlockAdminSession();
    setUnlocked(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const ok = await verifyAdminPassword(pw);
    if (!ok) { setError('Sai mật khẩu, vui lòng thử lại.'); return; }
    unlockAdminSession();
    setUnlocked(true);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] flex items-center justify-center p-6">
      <div className="zen-card w-full max-w-sm p-8 rounded-2xl space-y-5">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-full bg-[#3d633b]/10 flex items-center justify-center">
            {needsSetup ? <ShieldCheck className="w-6 h-6 text-[#3d633b]" /> : <Lock className="w-6 h-6 text-[#3d633b]" />}
          </div>
          <h2 className="text-lg font-bold text-[#1f2721]">
            {needsSetup ? 'Đặt Mật Khẩu Cho Admin POS' : 'Đăng Nhập Admin POS'}
          </h2>
          <p className="text-xs text-[#6b7a6c]">
            {needsSetup
              ? 'Đây là lần đầu mở trang quản trị trên trình duyệt này. Hãy đặt một mật khẩu để chỉ mình bạn xem được đơn hàng.'
              : 'Nhập mật khẩu để vào xem đơn hàng, đặt bàn và tin nhắn khách.'}
          </p>
        </div>

        <form onSubmit={needsSetup ? handleSetup : handleLogin} className="space-y-3">
          <input
            type="password"
            autoFocus
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Mật khẩu"
            className="w-full px-4 py-2.5 rounded-xl border border-[#d8ddd3] text-sm focus:outline-none focus:border-[#3d633b]"
          />
          {needsSetup && (
            <input
              type="password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              className="w-full px-4 py-2.5 rounded-xl border border-[#d8ddd3] text-sm focus:outline-none focus:border-[#3d633b]"
            />
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#3d633b] text-white text-sm font-semibold hover:bg-[#2c4a2a] transition-colors"
          >
            {needsSetup ? 'Lưu Mật Khẩu & Vào Quản Trị' : 'Đăng Nhập'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2 text-xs text-[#6b7a6c] hover:text-[#1f2721]"
          >
            Quay Về Trang Chủ
          </button>
        </form>
      </div>
    </div>
  );
}
