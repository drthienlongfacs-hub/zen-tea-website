import React, { useState, useEffect } from 'react';
import { X, Play, Square, Wind, Volume2, Sparkles, Heart } from 'lucide-react';
import { playAmbientSound, stopAmbientSound } from '../utils/soundEngine';

export default function ZenSoundscapeModal({ isOpen, onClose }) {
  const [activeSound, setActiveSound] = useState(null);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Hít Vào Tĩnh Lặng');
  const [breathTimer, setBreathTimer] = useState(60);

  useEffect(() => {
    let interval = null;
    if (isBreathingActive && breathTimer > 0) {
      interval = setInterval(() => {
        setBreathTimer((prev) => prev - 1);
        const cycle = breathTimer % 8;
        if (cycle >= 4) {
          setBreathPhase('Hít Vào Tĩnh Lặng... (4s)');
        } else {
          setBreathPhase('Thở Ra Thư Thái... (4s)');
        }
      }, 1000);
    } else if (breathTimer === 0) {
      setIsBreathingActive(false);
      setBreathPhase('Hoàn Thành 1 Phút Thiền Thở! Tâm Trí Đã Tĩnh Lặng.');
      setBreathTimer(60);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive, breathTimer]);

  if (!isOpen) return null;

  const handleSoundToggle = (soundType) => {
    if (activeSound === soundType) {
      stopAmbientSound();
      setActiveSound(null);
    } else {
      playAmbientSound(soundType);
      setActiveSound(soundType);
    }
  };

  const startBreathing = () => {
    setIsBreathingActive(true);
    setBreathTimer(60);
  };

  const stopBreathing = () => {
    setIsBreathingActive(false);
    setBreathPhase('Sẵn Sàng Bắt Đầu');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#f7f4ef] border border-[#7c674e]/30 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => {
            stopAmbientSound();
            setActiveSound(null);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-[#7c674e] hover:text-[#1f2721] rounded-full bg-[#ece3d7]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e2ebe0] text-[#254124] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Góc Tĩnh Tâm & Relax</span>
          </div>
          <h3 className="font-serif-zen text-2xl font-bold text-[#1f2721]">
            Âm Thanh Zen & Thiền Thở
          </h3>
          <p className="text-xs text-[#7c674e] mt-1">
            Lắng nghe âm thanh thiên nhiên và thực hành 1 phút lắng tụ tâm trí.
          </p>
        </div>

        {/* Ambient Sound Players */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3d633b]">
            1. Chọn Âm Thanh Thư Giãn (Web Audio Synth)
          </h4>

          {/* Sound 1: Singing Bowl */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#7c674e]/20 bg-[#fcfbfa] hover:border-[#3d633b] transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🥣</span>
              <div>
                <p className="text-sm font-semibold text-[#1f2721]">Chuông Xoay Tây Tạng (432Hz)</p>
                <p className="text-[11px] text-[#7c674e]">Tần số sóng âm xua tan căng thẳng</p>
              </div>
            </div>
            <button
              onClick={() => handleSoundToggle('bowl')}
              className={`p-2.5 rounded-full transition-colors ${
                activeSound === 'bowl'
                  ? 'bg-[#c2410c] text-white'
                  : 'bg-[#e2ebe0] text-[#254124] hover:bg-[#3d633b] hover:text-white'
              }`}
            >
              {activeSound === 'bowl' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
          </div>

          {/* Sound 2: Water Stream */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#7c674e]/20 bg-[#fcfbfa] hover:border-[#3d633b] transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎋</span>
              <div>
                <p className="text-sm font-semibold text-[#1f2721]">Suối Trúc Róc Rách</p>
                <p className="text-[11px] text-[#7c674e]">Dòng nước chảy róc rách qua ống bamboo</p>
              </div>
            </div>
            <button
              onClick={() => handleSoundToggle('water')}
              className={`p-2.5 rounded-full transition-colors ${
                activeSound === 'water'
                  ? 'bg-[#c2410c] text-white'
                  : 'bg-[#e2ebe0] text-[#254124] hover:bg-[#3d633b] hover:text-white'
              }`}
            >
              {activeSound === 'water' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
          </div>

          {/* Sound 3: Rain */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#7c674e]/20 bg-[#fcfbfa] hover:border-[#3d633b] transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌧️</span>
              <div>
                <p className="text-sm font-semibold text-[#1f2721]">Mưa Đêm Hiên Trà</p>
                <p className="text-[11px] text-[#7c674e]">Tiếng mưa rơi nhẹ nhàng trên mái lá</p>
              </div>
            </div>
            <button
              onClick={() => handleSoundToggle('rain')}
              className={`p-2.5 rounded-full transition-colors ${
                activeSound === 'rain'
                  ? 'bg-[#c2410c] text-white'
                  : 'bg-[#e2ebe0] text-[#254124] hover:bg-[#3d633b] hover:text-white'
              }`}
            >
              {activeSound === 'rain' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
          </div>
        </div>

        {/* 1-Minute Breathing Circle */}
        <div className="pt-4 border-t border-[#7c674e]/20 text-center">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#3d633b] mb-3">
            2. Thiền Thở 1 Phút (Pranayama)
          </h4>

          <div className="flex flex-col items-center justify-center my-4">
            <div
              className={`w-28 h-28 rounded-full border-4 border-[#3d633b] flex flex-col items-center justify-center bg-[#e2ebe0]/50 transition-all duration-1000 ${
                isBreathingActive ? 'animate-breathe' : ''
              }`}
            >
              <Wind className="w-6 h-6 text-[#3d633b] mb-1" />
              <span className="font-mono text-xl font-bold text-[#254124]">{breathTimer}s</span>
            </div>
            <p className="text-xs font-medium text-[#1f2721] mt-3 italic min-h-[20px]">
              {breathPhase}
            </p>
          </div>

          {!isBreathingActive ? (
            <button
              onClick={startBreathing}
              className="w-full py-3 rounded-2xl bg-[#3d633b] text-white font-semibold text-sm hover:bg-[#254124] transition-colors shadow-md"
            >
              Bắt Đầu 60s Thiền Thở
            </button>
          ) : (
            <button
              onClick={stopBreathing}
              className="w-full py-3 rounded-2xl bg-[#c2410c] text-white font-semibold text-sm hover:bg-[#9a3412] transition-colors"
            >
              Tạm Dừng
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
