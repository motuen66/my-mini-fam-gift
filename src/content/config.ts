import type {
  AppConfig,
  CandleData,
  GiftLayer,
  LoveLetterContent,
  LoveReason,
  PhotoMoment,
  StickerDefinition,
  WheelPrize,
} from '../types/index.ts';

/**
 * =======================================================================
 *  SỬA NỘI DUNG Ở ĐÂY LÀ ĐỦ
 * -----------------------------------------------------------------------
 *  - Tên 3 người: names
 *  - Ảnh kỷ niệm: PHOTO_MOMENTS  (bỏ ảnh vào public/assets/photos/)
 *  - Sticker: STICKERS_CONFIG    (bỏ PNG vào public/assets/stickers/)
 *  - Vòng quay: INITIAL_WHEEL_PRIZES
 *  - 20 lý do: INITIAL_REASONS
 *  - 3 cây nến: INITIAL_CANDLES
 *  - Hộp quà nhiều lớp: INITIAL_GIFT_LAYERS
 *  - Lá thư cuối: LOVE_LETTER
 *  - Ghi âm: voiceNoteBoyfriend / voiceNoteFamily
 *
 *  Các câu có ghi "TODO" là chỗ bạn có thể thay bằng kỷ niệm thật.
 *  Nếu không thay, trang vẫn hiển thị câu hoàn chỉnh, không bị lỗi.
 * =======================================================================
 */

export const DEFAULT_CONFIG: AppConfig = {
  names: {
    gifter: 'a Mỏ',
    recipient: 'em Tròn',
    thirdPerson: 'Hoành con',
  },
  eventTitle: 'Chúc Mừng 20/10 em Tròn 💖',
  tagline: 'Gửi em Tròn và gia đình nhỏ 3 người',
  voiceNoteBoyfriend: {
    // iPhone ghi âm ra .m4a. Nếu bạn có .mp3, chỉ cần đổi đuôi ở đây.
    audioUrl: '/audio/voice-boyfriend.m4a',
    durationEstimate: '0:08',
    transcript: [
      'Alo em Tròn nghe rõ không đó?',
    ],
  },
  voiceNoteFamily: {
    audioUrl: '/audio/voice-family.m4a',
    durationEstimate: '0:15',
    transcript: [
      'Loa loa loa! Gia đình 3 người xin thông báo!',
    ],
  },
};

/**
 * 6 khung Photo Story.
 * TODO: thay caption bằng kỷ niệm thật của bạn nếu muốn.
 * Hiện tại tất cả đều là câu vui, không khẳng định chuyện cụ thể.
 */
export const PHOTO_MOMENTS: PhotoMoment[] = [
  {
    id: 1,
    imageSrc: '/assets/photos/moment-1.jpg',
    altText: 'Khoảnh khắc 1',
    caption: 'Tấm này nhìn là biết người ta có gu rồi đó 😌',
    stickerCharacter: 'me',
    stickerExpression: 'ok-luon',
    speechBubble: 'OK luôn! ⭐',
    tapeColor: 'bg-rose-300/80',
    tiltAngle: -1.5,
    bgGradient: 'from-pink-100 via-rose-50 to-amber-50',
  },
  {
    id: 2,
    imageSrc: '/assets/photos/moment-2.jpg',
    altText: 'Khoảnh khắc 2',
    caption: 'Cười cái là cả ngày anh thấy ổn.',
    stickerCharacter: 'me',
    stickerExpression: 'hi-hi-hi',
    speechBubble: 'Hí hí hí! 💖',
    tapeColor: 'bg-amber-300/80',
    tiltAngle: 2,
    bgGradient: 'from-amber-100 via-orange-50 to-pink-50',
  },
  {
    id: 3,
    imageSrc: '/assets/photos/moment-3.jpg',
    altText: 'Khoảnh khắc 3',
    caption: 'Đi đâu không quan trọng, miễn là có nhau.',
    stickerCharacter: 'me',
    stickerExpression: 'di-thoi',
    speechBubble: 'Đi thôi! 🌸',
    tapeColor: 'bg-emerald-300/80',
    tiltAngle: -2,
    bgGradient: 'from-emerald-100 via-teal-50 to-pink-50',
  },
  {
    id: 4,
    imageSrc: '/assets/photos/moment-4.jpg',
    altText: 'Khoảnh khắc 4',
    caption: 'Khoảnh khắc này không cần caption cũng đủ rồi.',
    stickerCharacter: 'con',
    stickerExpression: 'yeahhh',
    speechBubble: 'Yeahhh! 🎉',
    tapeColor: 'bg-sky-300/80',
    tiltAngle: 1.5,
    bgGradient: 'from-blue-100 via-indigo-50 to-pink-50',
  },
  {
    id: 5,
    imageSrc: '/assets/photos/moment-5.jpg',
    altText: 'Khoảnh khắc 5',
    caption: 'Nhìn lại vẫn thấy mình may mắn ghê.',
    stickerCharacter: 'me',
    stickerExpression: 'hehe',
    speechBubble: 'Hehe... 💕',
    tapeColor: 'bg-violet-300/80',
    tiltAngle: -1,
    bgGradient: 'from-violet-100 via-purple-50 to-pink-50',
  },
  {
    id: 6,
    imageSrc: '/assets/photos/moment-6.jpg',
    altText: 'Khoảnh khắc 6',
    caption: 'Cảm ơn em vì vẫn ở đây, cùng anh đi tiếp.',
    stickerCharacter: 'me',
    stickerExpression: 'ok-luon',
    speechBubble: 'Thương a Mỏ lắm! 💕',
    tapeColor: 'bg-rose-400/90',
    tiltAngle: 2.5,
    bgGradient: 'from-rose-100 via-pink-100 to-amber-100',
  },
];

/**
 * Sticker PNG đặt trong public/assets/stickers/.
 * Nếu chưa có file, trang tự dùng sticker SVG vẽ sẵn.
 *
 * Bộ Tròn (em Tròn): tron_*.png
 * Bộ Hoành (Hoành con): hoanh_*.png
 * Bộ Ba (a Mỏ): chưa có ảnh, đang dùng SVG.
 */
export const STICKERS_CONFIG: StickerDefinition[] = [
  // --- EM TRÒN ---
  { id: 'tron_hi_hi_hi', character: 'me', expression: 'hi-hi-hi', fileName: 'tron_hi_hi_hi.webp', label: 'em Tròn cười hí hí', voiceLine: 'Hí hí hí! 💖', badgeColor: '#f43f5e' },
  { id: 'tron_ok_luon', character: 'me', expression: 'ok-luon', fileName: 'tron_ok_luon.webp', label: 'em Tròn OK luôn', voiceLine: 'OK luôn! ⭐', badgeColor: '#f43f5e' },
  { id: 'tron_dinh_luon', character: 'me', expression: 'dinh-luon', fileName: 'tron_dinh_luon.webp', label: 'em Tròn đỉnh luôn', voiceLine: 'Đỉnh luôn! ✨', badgeColor: '#f43f5e' },
  { id: 'tron_kho_chiu', character: 'me', expression: 'kho-chiu', fileName: 'tron_kho_chiu.webp', label: 'em Tròn khó chịu', voiceLine: 'Khó chịu quá đi! 💢', badgeColor: '#f43f5e' },
  { id: 'tron_oi_troi_oi', character: 'me', expression: 'oi-troi-oi', fileName: 'tron_oi_troi_oi.webp', label: 'em Tròn ôi trời ơi', voiceLine: 'Ôi trời ơi! 😲', badgeColor: '#f43f5e' },
  { id: 'tron_hehe', character: 'me', expression: 'hehe', fileName: 'tron_hehe.webp', label: 'em Tròn cười hehe', voiceLine: 'Hehe... 💕', badgeColor: '#f43f5e' },
  { id: 'tron_vo_duyen', character: 'me', expression: 'vo-duyen', fileName: 'tron_vo_duyen.webp', label: 'em Tròn vô duyên', voiceLine: 'Vô duyên cò lẹ! 💨', badgeColor: '#f43f5e' },
  { id: 'tron_muon_chat', character: 'me', expression: 'muon-chat', fileName: 'tron_muon_chat.webp', label: 'em Tròn muốn chat', voiceLine: 'Muốn chat với ai đó 📱', badgeColor: '#f43f5e' },
  { id: 'tron_ha', character: 'me', expression: 'ngaongoc', fileName: 'tron_ha.webp', label: 'em Tròn ngơ ngác', voiceLine: 'Hả? 🤔', badgeColor: '#f43f5e' },
  { id: 'tron_um', character: 'me', expression: 'um', fileName: 'tron_um.webp', label: 'em Tròn ừm', voiceLine: 'Ừm... 🤔', badgeColor: '#f43f5e' },
  { id: 'tron_buon_ngu', character: 'me', expression: 'buon-ngu', fileName: 'tron_buon_ngu.webp', label: 'em Tròn buồn ngủ', voiceLine: 'Buồn ngủ... 💤', badgeColor: '#f43f5e' },
  { id: 'tron_di_thoi', character: 'me', expression: 'di-thoi', fileName: 'tron_di_thoi.webp', label: 'em Tròn đi thôi', voiceLine: 'Đi thôi 🌸', badgeColor: '#f43f5e' },
  { id: 'tron_cuoi', character: 'me', expression: 'cuoi', fileName: 'tron_hi_hi_hi.webp', label: 'em Tròn cười', voiceLine: 'Cười xỉu! 🥰', badgeColor: '#f43f5e' },
  { id: 'tron_tha_tim', character: 'me', expression: 'tha-tim', fileName: 'tron_hehe.webp', label: 'em Tròn thả tim', voiceLine: 'Thương a Mỏ nhất! ❤️', badgeColor: '#f43f5e' },
  { id: 'tron_doian', character: 'me', expression: 'doian', fileName: 'tron_ha.webp', label: 'em Tròn đòi ăn', voiceLine: 'Trà sữa nha! 🧋', badgeColor: '#f43f5e' },
  { id: 'tron_quau', character: 'me', expression: 'quau', fileName: 'tron_kho_chiu.webp', label: 'em Tròn quạu', voiceLine: 'Ai chọc đó! 😤', badgeColor: '#f43f5e' },
  { id: 'tron_chumom', character: 'me', expression: 'chumom', fileName: 'tron_kho_chiu.webp', label: 'em Tròn chu mỏ', voiceLine: 'Hứ! 😤', badgeColor: '#f43f5e' },

  // --- HOÀNH CON ---
  { id: 'hoanh_tra_sua', character: 'con', expression: 'tra-sua', fileName: 'hoanh_tra_sua.webp', label: 'Hoành con uống trà sữa', voiceLine: 'Trà sữa là chân ái! 🧋', badgeColor: '#8b5cf6' },
  { id: 'hoanh_yeahhh', character: 'con', expression: 'yeahhh', fileName: 'hoanh_yeahhh.webp', label: 'Hoành con yeahhh', voiceLine: 'Yeahhh! 🎉', badgeColor: '#8b5cf6' },
  { id: 'hoanh_binh_thuong', character: 'con', expression: 'binh-thuong', fileName: 'hoanh_binh_thuong.webp', label: 'Hoành con bình thường', voiceLine: 'Bình thường! 😒', badgeColor: '#8b5cf6' },
  { id: 'hoanh_kinh_ram', character: 'con', expression: 'kinh-ram', fileName: 'hoanh_kinh_ram.webp', label: 'Hoành con ngầu', voiceLine: 'Ngầu lòi chưa! 😎', badgeColor: '#8b5cf6' },
  { id: 'hoanh_om_tho', character: 'con', expression: 'om-tho', fileName: 'hoanh_om_tho.webp', label: 'Hoành con ôm thỏ', voiceLine: 'Thỏ bông cưng xỉu! 🐰', badgeColor: '#8b5cf6' },
  { id: 'hoanh_vo_duyen', character: 'con', expression: 'vo-duyen', fileName: 'hoanh_vo_duyen.webp', label: 'Hoành con vô duyên', voiceLine: 'Vô duyên cò lẹ! 😜', badgeColor: '#8b5cf6' },
  { id: 'hoanh_cuoi', character: 'con', expression: 'cuoi', fileName: 'hoanh_cuoi.webp', label: 'Hoành con cười', voiceLine: 'Cười xỉu! 😆', badgeColor: '#8b5cf6' },
  { id: 'hoanh_hahe', character: 'con', expression: 'hahe', fileName: 'hoanh_cuoi.webp', label: 'Hoành con hả hê', voiceLine: 'Hả hê ghê! 😆', badgeColor: '#8b5cf6' },
];

/** Câu chân thành duy nhất ở cuối Photo Story. */
export const PHOTO_STORY_FINAL_LINE =
  'Dù ngày mai có ồn ào thế nào, a Mỏ vẫn thương em Tròn nhất trần đời. ❤️';

/** Mời qua tab 2 ở cuối tab 1. */
export const TAB_INVITE = 'Còn một món quà nhỏ cho cả nhà ở tab Gia đình nhỏ 🕯️';

export const INITIAL_WHEEL_PRIZES: WheelPrize[] = [
  {
    id: 1,
    label: 'Food Tour',
    fullTitle: '1 chuyến food tour em Tròn tự chọn (a Mỏ bao hết)',
    description: 'Em Tròn chọn quán, a Mỏ chở đi và trả bill không chớp mắt!',
    color: '#ff758c',
    textColor: '#ffffff',
    icon: '🍕',
  },
  {
    id: 2,
    label: 'Vé Phim VIP',
    fullTitle: '1 vé xem phim suất đặc biệt + bắp rang size bự',
    description: 'Em chọn phim, chọn ghế; a Mỏ lo bắp nước và ngồi ngoan.',
    color: '#ff7eb3',
    textColor: '#ffffff',
    icon: '🎬',
  },
  {
    id: 3,
    label: 'Ôm 10 Giây',
    fullTitle: '1 chiếc ôm 10 giây nạp đầy năng lượng',
    description: 'Mệt đâu thì chìa thẻ ra, được ôm chặt và sạc pin ngay.',
    color: '#70a6ff',
    textColor: '#ffffff',
    icon: '🤗',
  },
  {
    id: 4,
    label: 'Giận 5 Phút',
    fullTitle: 'Được giận a Mỏ 5 phút không bị cãi lại',
    description: 'Được dỗi, được làm mặt ngầu. Hết 5 phút thì vẫn thương.',
    color: '#38ef7d',
    textColor: '#ffffff',
    icon: '😤',
  },
  {
    id: 5,
    label: 'Rửa Chén 1 Tuần',
    fullTitle: 'a Mỏ bao trọn rửa chén và dọn bếp 1 tuần',
    description: 'Em Tròn chỉ việc ngồi chơi, việc bếp núc để a Mỏ lo.',
    color: '#f6d365',
    textColor: '#573a08',
    icon: '🧼',
  },
  {
    id: 6,
    label: 'Kim Bài',
    fullTitle: '1 lần tha thứ lỗi lầm siêu to khổng lồ',
    description: 'Dùng khi a Mỏ lỡ làm chuyện dở hơi. Hiệu lực vô thời hạn!',
    color: '#fda085',
    textColor: '#ffffff',
    icon: '👑',
  },
  {
    id: 7,
    label: 'Quay Lại Nha!',
    fullTitle: 'Quay lại lần nữa! (Vì em quá xinh)',
    description: 'Vòng quay say nắng trước nhan sắc của em Tròn nên tặng thêm 1 lượt.',
    isTroll: true,
    color: '#a18cd1',
    textColor: '#ffffff',
    icon: '🔄',
  },
  {
    id: 8,
    label: 'Điều Ước',
    fullTitle: 'Được sai a Mỏ làm 1 điều bất kỳ trong khả năng',
    description: 'Sai gì làm nấy: đấm lưng, mua trà sữa, hát một bài tình ca...',
    color: '#fbc2eb',
    textColor: '#4a154b',
    icon: '⭐',
  },
];

/** 20 thông điệp vui vẻ, tích cực, kiểu "vũ trụ gửi may mắn" — không gắn với chuyện riêng tư. */
export const INITIAL_REASONS: LoveReason[] = [
  { id: 1, reason: 'Hôm nay em xinh, tương lai em rộng mở.', tag: 'Tỏa sáng', icon: '✨' },
  { id: 2, reason: 'Vũ trụ đang để dành điều tử tế cho em đó.', tag: 'Vũ trụ', icon: '🌌' },
  { id: 3, reason: 'Mọi chuyện rồi sẽ ổn, kiểu gì cũng có quà.', tag: 'May mắn', icon: '🍀' },
  { id: 4, reason: 'Tiền vào như nước, việc nhẹ mà lương cao.', tag: 'Tài lộc', icon: '💰' },
  { id: 5, reason: 'Sức khỏe dồi dào, tối ngủ ngon không mộng mị.', tag: 'Sức khỏe', icon: '🌿' },
  { id: 6, reason: 'Gặp toàn người thương, tránh hết người drama.', tag: 'Bình yên', icon: '🕊️' },
  { id: 7, reason: 'Đi đâu cũng gặp chuyện vui, chụp đâu cũng ra ảnh đẹp.', tag: 'Rạng rỡ', icon: '📸' },
  { id: 8, reason: 'Ước gì được nấy, muộn nhất là chiều nay.', tag: 'Điều ước', icon: '🌠' },
  { id: 9, reason: 'Hôm nay là ngày dành riêng cho em, cứ vui hết cỡ.', tag: '20/10', icon: '🎉' },
  { id: 10, reason: 'Mọi lo lắng sẽ tan như sương buổi sớm.', tag: 'Nhẹ nhõm', icon: '☀️' },
  { id: 11, reason: 'Vũ trụ gửi em một cái ôm thật to.', tag: 'Vũ trụ', icon: '🤗' },
  { id: 12, reason: 'Cười nhiều hơn, xinh hơn mỗi ngày.', tag: 'Vui vẻ', icon: '😄' },
  { id: 13, reason: 'Món ngon ở khắp nơi, người thương ở ngay đây.', tag: 'Ngọt ngào', icon: '🍰' },
  { id: 14, reason: 'Giữ sức khỏe, giữ luôn nét đáng yêu.', tag: 'Đáng yêu', icon: '🌸' },
  { id: 15, reason: 'Điều tốt lành đang trên đường tới, sắp gõ cửa rồi.', tag: 'May mắn', icon: '🚚' },
  { id: 16, reason: 'Bình an trong tim, sự nghiệp trong tầm tay.', tag: 'Bình an', icon: '🕯️' },
  { id: 17, reason: 'Cứ tự tin, em giỏi hơn em nghĩ nhiều.', tag: 'Tự tin', icon: '💪' },
  { id: 18, reason: 'Tối nay trời đẹp, nhất định có sao băng cho em ước.', tag: 'Điều ước', icon: '🌙' },
  { id: 19, reason: 'Mỗi ngày đều có một niềm vui nhỏ đang chờ.', tag: 'Vui vẻ', icon: '🌼' },
  { id: 20, reason: 'Vũ trụ đã ghi tên em vào danh sách may mắn.', tag: 'May mắn', icon: '🌟' },
];

export const LOVE_LETTER: LoveLetterContent = {
  title: 'Gửi em Tròn 💌',
  paragraphs: [
    'Anh không giỏi viết mấy câu dài dòng, nên gói gọn ở đây: cảm ơn em vì đã xuất hiện và làm những ngày bình thường của anh vui hơn.',
    'Chúc em 20/10 thật nhiều tiếng cười, ít phải nhăn mặt, và lúc nào cũng có người chở đi ăn.',
  ],
  signature: 'Thương em nhiều, a Mỏ ❤️',
};

export const INITIAL_CANDLES: CandleData[] = [
  {
    id: 'candle-ba',
    role: 'ba',
    name: 'a Mỏ',
    label: 'Ba',
    colorName: 'yellow',
    hexColor: '#fbbf24',
    quote: 'Ba lo phần chở và phần trả tiền! 😎',
    detail: 'Trụ cột năng lượng & nguồn tài trợ đồ ăn',
  },
  {
    id: 'candle-me',
    role: 'me',
    name: 'em Tròn',
    label: 'Mẹ',
    colorName: 'blue',
    hexColor: '#60a5fa',
    quote: 'Mẹ là nóc nhà, là tim của cả nhà 💖',
    detail: 'Trái tim của gia đình & nóc nhà kiên cố',
  },
  {
    id: 'candle-con',
    role: 'con',
    name: 'Hoành con',
    label: 'Con',
    colorName: 'pink',
    hexColor: '#f472b6',
    quote: 'Con gái nuôi chúc mẹ ngập quà! ✨',
    detail: 'Thành viên tri ân & chuyên gia hòa giải',
  },
];

export const FAMILY_CLOSING = {
  line: 'Gia đình bé nhỏ của tụi mình 💛💙💗',
  subline: 'Cảm ơn em Tròn và Hoành con vì đã là một phần của gia đình nhỏ này.',
  voucher: 'Voucher: 1 buổi ăn uống thả ga 3 người (a Mỏ quẹt thẻ).',
};

export const INITIAL_GIFT_LAYERS: GiftLayer[] = [
  {
    step: 1,
    boxTitle: 'Bọc Bao Tải Cũ Kỹ 📦',
    dialogue: 'Ủa gì vậy trời? Quà 20/10 mà gói bằng bao tải?!',
    buttonLabel: 'Xé toạc lớp bao tải ✂️',
    wrappingColor: '#b45309',
    badge: 'Lớp 1/5',
  },
  {
    step: 2,
    boxTitle: 'Thùng Các-tông Quấn Băng Keo 📦',
    dialogue: 'Quấn gì mà kỹ vậy! Cố lên, sắp thấy ruột rồi!',
    buttonLabel: 'Bóc hết băng keo 💪',
    wrappingColor: '#d97706',
    badge: 'Lớp 2/5',
  },
  {
    step: 3,
    boxTitle: 'Hộp Quà Thắt Nơ Hồng Óng Ánh 🎀',
    dialogue: 'Bắt đầu ra dáng quà tặng rồi nè! Nhưng vẫn còn lớp nữa...',
    buttonLabel: 'Mở nơ hồng kim tuyến ✨',
    wrappingColor: '#ec4899',
    badge: 'Lớp 3/5',
  },
  {
    step: 4,
    boxTitle: 'Chiếc Hộp Bí Mật Khóa Trái Tim 🔐',
    dialogue: 'Đố cả nhà đoán được món quà cuối cùng là gì nè!',
    buttonLabel: 'Mở khóa yêu thương 💖',
    wrappingColor: '#a855f7',
    badge: 'Lớp 4/5',
  },
  {
    step: 5,
    boxTitle: 'KHO BÁU GIA ĐÌNH 3 NGƯỜI 🏆',
    dialogue: 'Món quà vô giá nhất chính là chúng ta có nhau!',
    buttonLabel: 'Nhận chứng nhận gia đình hạnh phúc 🎉',
    wrappingColor: '#f59e0b',
    badge: 'Đích đến!',
  },
];
