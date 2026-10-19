import React, { useState } from 'react';
import { X, Sliders, Music, Image, Globe, Check, Sparkles } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  gifterName: string;
  recipientName: string;
  thirdPersonName: string;
  onUpdateNames: (gifter: string, recipient: string, thirdPerson: string) => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  gifterName,
  recipientName,
  thirdPersonName,
  onUpdateNames,
}) => {
  const [gifter, setGifter] = useState(gifterName);
  const [recipient, setRecipient] = useState(recipientName);
  const [thirdPerson, setThirdPerson] = useState(thirdPersonName);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'names' | 'stickers' | 'files' | 'deploy'>('names');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateNames(
      gifter.trim() || 'A mỏ',
      recipient.trim() || 'em tròn',
      thirdPerson.trim() || 'Hoành con'
    );
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-pink-200 max-h-[90vh] flex flex-col text-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-pink-600" />
            <h3 className="font-bold text-gray-800 text-base sm:text-lg">
              Hướng Dẫn Hoàn Thiện Quà 20/10
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100 rounded-xl my-3 text-[11px] sm:text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('names')}
            className={`py-1.5 rounded-lg transition-all cursor-pointer truncate px-1 text-center ${
              activeTab === 'names' ? 'bg-white text-pink-600 shadow-xs' : 'text-gray-600'
            }`}
          >
            ✏️ Đổi Tên
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stickers')}
            className={`py-1.5 rounded-lg transition-all cursor-pointer truncate px-1 text-center ${
              activeTab === 'stickers' ? 'bg-white text-pink-600 shadow-xs' : 'text-gray-600'
            }`}
          >
            🎨 Sticker & Ảnh
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('files')}
            className={`py-1.5 rounded-lg transition-all cursor-pointer truncate px-1 text-center ${
              activeTab === 'files' ? 'bg-white text-pink-600 shadow-xs' : 'text-gray-600'
            }`}
          >
            🎵 Ghi Âm & Nhạc
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('deploy')}
            className={`py-1.5 rounded-lg transition-all cursor-pointer truncate px-1 text-center ${
              activeTab === 'deploy' ? 'bg-white text-pink-600 shadow-xs' : 'text-gray-600'
            }`}
          >
            🌐 Đưa Lên Mạng
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1 text-xs sm:text-sm text-gray-700 space-y-4">
          {activeTab === 'names' && (
            <form onSubmit={handleSave} className="space-y-4">
              <p className="text-gray-500 text-xs">
                Bạn có thể sửa tên hiển thị ngay lập tức để xem trước trên trang:
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  1. Tên bạn (Người tặng):
                </label>
                <input
                  type="text"
                  value={gifter}
                  onChange={(e) => setGifter(e.target.value)}
                  placeholder="Ví dụ: A mỏ"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-pink-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  2. Tên bạn gái (Người nhận chính):
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Ví dụ: em tròn"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-pink-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  3. Tên bạn thân / &quot;con nuôi&quot;:
                </label>
                <input
                  type="text"
                  value={thirdPerson}
                  onChange={(e) => setThirdPerson(e.target.value)}
                  placeholder="Ví dụ: Hoành con"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-pink-500 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-pink-500 text-white font-bold text-sm hover:bg-pink-600 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              >
                {isSaved ? <Check className="w-4 h-4" /> : null}
                <span>{isSaved ? 'Đã lưu thay đổi!' : 'Lưu & Xem Trước Ngay ✨'}</span>
              </button>
            </form>
          )}

          {activeTab === 'stickers' && (
            <div className="space-y-3">
              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200">
                <div className="flex items-center gap-2 font-bold text-rose-700 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Cách Thêm Sticker AI Bạn Đã Tạo (PNG):</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Chỉ cần bỏ các file ảnh PNG nền trong suốt vào thư mục <code>public/assets/stickers/</code>:
                </p>
                <ul className="list-disc list-inside text-xs text-gray-700 mt-2 space-y-1 font-mono">
                  <li><code>ba_cuoi.png</code>, <code>ba_quau.png</code> (Ảnh A mỏ)</li>
                  <li><code>me_cuoi.png</code>, <code>me_doian.png</code> (Ảnh em tròn)</li>
                  <li><code>con_hahe.png</code>, <code>con_quay.png</code> (Ảnh Hoành con)</li>
                </ul>
                <p className="text-[11px] text-rose-600 italic mt-2">
                  * Hệ thống đã tích hợp sẵn Sticker Chibi Vector tự động fallback nên nếu chưa kịp bỏ ảnh thì giao diện vẫn siêu lung linh!
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <div className="flex items-center gap-2 font-bold text-amber-800 mb-1">
                  <Image className="w-4 h-4" />
                  <span>Cách Thêm 6 Ảnh Thật Vào Photo Story:</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Bỏ 6 bức ảnh kỷ niệm vào thư mục <code>public/assets/photos/</code> với tên:
                </p>
                <ul className="list-disc list-inside text-xs text-gray-700 mt-2 space-y-1 font-mono">
                  <li><code>moment-1.jpg</code> (Lần đầu gặp gỡ)</li>
                  <li><code>moment-2.jpg</code> (Hẹn hò ăn uống)</li>
                  <li><code>moment-3.jpg</code> (Lạc đường hài hước)</li>
                  <li><code>moment-4.jpg</code> (Ảnh cùng Hoành con)</li>
                  <li><code>moment-5.jpg</code> (Bình yên bên nhau)</li>
                  <li><code>moment-6.jpg</code> (Khoảnh khắc ngọt ngào nhất)</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-3">
              <div className="p-3 bg-pink-50 rounded-2xl border border-pink-200">
                <div className="flex items-center gap-2 font-bold text-pink-700 mb-1">
                  <Music className="w-4 h-4" />
                  <span>Cách Thay Nhạc Nền & Lời Ghi Âm:</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Bỏ file MP3/M4A vào thư mục <code>public/audio/</code>:
                </p>
                <ul className="list-disc list-inside text-xs text-gray-700 mt-2 space-y-1 font-mono">
                  <li><code>public/audio/bgm.mp3</code> (Nhạc nền bài hai người thích)</li>
                  <li><code>public/audio/voice-boyfriend.mp3</code> (Lời A mỏ tự thu âm)</li>
                  <li><code>public/audio/voice-family.mp3</code> (Lời chúc gia đình 3 người)</li>
                </ul>
                <p className="text-[11px] text-pink-600 italic mt-2">
                  * Ghi chú: Nếu chưa có file âm thanh thật, trang web sẽ tự động tổng hợp giai điệu du dương và chạy phụ đề karaoke mẫu!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-2 font-bold text-emerald-800 mb-1">
                  <Globe className="w-4 h-4" />
                  <span>Cách Đưa Lên Mạng Miễn Phí Trước 20/10:</span>
                </div>
                <ol className="list-decimal list-inside text-xs text-gray-700 space-y-2 mt-2 leading-relaxed">
                  <li>
                    <strong>Cách 1: Gửi ngay link Shared App URL:</strong>
                    <br />
                    Copy đường link ở bảng bên phải để gửi cho bạn gái mở trực tiếp trên điện thoại!
                  </li>
                  <li>
                    <strong>Cách 2: Đưa lên Vercel / Netlify (Miễn phí 100%):</strong>
                    <br />
                    Tải mã nguồn về (Export zip), kéo thả thư mục vào trang web <strong>vercel.com</strong> hoặc <strong>netlify.com</strong>, bạn sẽ nhận được một đường link cực đẹp dạng <code>em-tron-2010.vercel.app</code>!
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
