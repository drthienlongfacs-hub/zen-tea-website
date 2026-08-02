import React from 'react';
import { X, Clock, User, Share2, Heart, Sparkles } from 'lucide-react';

export default function BlogArticleModal({ article, isOpen, onClose }) {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#f7f4ef] border border-[#7c674e]/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7c674e] hover:text-[#1f2721] rounded-full bg-[#ece3d7] z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Article Header */}
        <div className="space-y-3 mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-[#e2ebe0] text-[#254124] text-xs font-bold">
            {article.category}
          </span>
          <h2 className="font-serif-zen text-2xl md:text-3xl font-bold text-[#1f2721] leading-tight">
            {article.title}
          </h2>
          <p className="text-xs md:text-sm text-[#7c674e] italic">
            {article.subtitle}
          </p>

          <div className="flex items-center gap-4 text-xs text-[#7c674e] pt-2 border-t border-[#7c674e]/15">
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {article.author}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
            <span>·</span>
            <span>{article.date}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="h-64 w-full rounded-2xl overflow-hidden mb-6 bg-[#ece3d7]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-stone max-w-none text-xs md:text-sm text-[#1f2721] leading-relaxed space-y-4 whitespace-pre-line font-light">
          {article.content}
        </div>

        {/* Footer Quote & Actions */}
        <div className="mt-8 pt-6 border-t border-[#7c674e]/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#3d633b]">
            <Sparkles className="w-4 h-4" />
            <span className="italic font-serif-zen">Cảm ơn bạn đã lắng nghe chuyện trà cùng An Nhiên</span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Đã sao chép liên kết bài viết!');
            }}
            className="px-4 py-2 rounded-xl bg-[#e2ebe0] text-[#254124] text-xs font-semibold hover:bg-[#3d633b] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Chia Sẻ</span>
          </button>
        </div>

      </div>
    </div>
  );
}
