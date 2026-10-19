import type { AppConfig, StoryChapter, WheelPrize, LoveReason, CandleData, GiftLayer, PhotoMoment, StickerDefinition } from '../types/index.ts';

/**
 * =======================================================================
 * HƯỚNG DẪN DÀNH CHO BẠN (A MỎ):
 * Bạn có thể trực tiếp sửa các thông tin bên dưới để cá nhân hóa món quà!
 * - Tên gọi: names
 * - Dải ảnh Photo Story: PHOTO_MOMENTS (ảnh đặt tại public/assets/photos/)
 * - Sticker ảnh AI/PNG: STICKERS_CONFIG (ảnh đặt tại public/assets/stickers/)
 * - Giải thưởng vòng quay: INITIAL_WHEEL_PRIZES
 * - 20 lý do yêu thương: INITIAL_REASONS
 * - Lời thoại 3 cây nến gia đình: INITIAL_CANDLES
 * - Lời chúc & phụ đề ghi âm: voiceNotes
 * =======================================================================
 */

export const DEFAULT_CONFIG: AppConfig = {
  names: {
    gifter: 'A mỏ',
    recipient: 'em tròn',
    thirdPerson: 'Hoành con',
  },
  eventTitle: 'Chúc Mừng 20/10 Em Tròn 💖',
  tagline: 'Gửi người con gái đáng yêu nhất quả đất & Gia đình nhỏ 3 người',
  voiceNoteBoyfriend: {
    audioUrl: '/audio/voice-boyfriend.mp3',
    durationEstimate: '0:45',
    transcript: [
      'Alo em tròn à, nghe rõ không đó?',
      'Hôm nay là 20/10, anh chúc em luôn luôn xinh đẹp, rạng rỡ và bớt bớt nhăn mặt lại nhé!',
      'Cảm ơn em vì đã luôn ở bên cạnh anh, cùng anh ăn bao nhiêu bữa ngon và chịu đựng những trò ngố của anh.',
      'Dù có chuyện gì xảy ra thì A mỏ vẫn sẽ luôn yêu thương và bảo vệ em tròn.',
      'Thương em rất nhiều! Chúc mừng ngày của em nha ❤️',
    ],
  },
  voiceNoteFamily: {
    audioUrl: '/audio/voice-family.mp3',
    durationEstimate: '0:40',
    transcript: [
      'Loa loa loa! Gia đình 3 người xin trân trọng thông báo!',
      'Hôm nay ngày 20/10, đại diện Ba (A mỏ) và Con nuôi (Hoành con) xin chúc Mẹ nuôi (em tròn) luôn hạnh phúc, trẻ đẹp!',
      'Cảm ơn Hoành con đã luôn là mảnh ghép siêu lầy lội, chuyên giải cứu những pha giận dỗi của 2 người.',
      'Chúc gia đình 3 người tụi mình mãi mãi vui vẻ, đi ăn đâu cũng có nhau!',
      'Happy Vietnamese Women\'s Day! Yêu thương cả nhà! 💛💙💗',
    ],
  },
};

/**
 * 6 Khung Hình Photo Story (Page 1: CHỈ DUY NHẤT TRÒN - Dải ảnh cuộn dọc, chữ cực ngắn < 10 từ)
 */
export const PHOTO_MOMENTS: PhotoMoment[] = [
  {
    id: 1,
    imageSrc: '/assets/photos/moment-1.jpg',
    altText: 'Lần đầu gặp gỡ',
    caption: 'Va phải nhau, ngơ ngác như trúng số độc đắc!',
    stickerCharacter: 'me',
    stickerExpression: 'ok-luon',
    speechBubble: 'OK luôn! Đổ đứ đừ! ⭐',
    tapeColor: 'bg-rose-300/80',
    tiltAngle: -1.5,
    bgGradient: 'from-pink-100 via-rose-50 to-amber-50',
  },
  {
    id: 2,
    imageSrc: '/assets/photos/moment-2.jpg',
    altText: 'Hẹn hò ăn uống',
    caption: 'Miệng kêu no nhưng đũa gắp không ngừng!',
    stickerCharacter: 'me',
    stickerExpression: 'doian',
    speechBubble: 'Trà sữa trân châu nha! 🧋',
    tapeColor: 'bg-amber-300/80',
    tiltAngle: 2,
    bgGradient: 'from-amber-100 via-orange-50 to-pink-50',
  },
  {
    id: 3,
    imageSrc: '/assets/photos/moment-3.jpg',
    altText: 'Pha lạc đường ngố tàu',
    caption: 'Chuyên gia lạc đường nhưng quán ăn là tới ngay!',
    stickerCharacter: 'me',
    stickerExpression: 'kho-chiu',
    speechBubble: 'Khó chịu quá đi! 💢',
    tapeColor: 'bg-emerald-300/80',
    tiltAngle: -2,
    bgGradient: 'from-emerald-100 via-teal-50 to-pink-50',
  },
  {
    id: 4,
    imageSrc: '/assets/photos/moment-4.jpg',
    altText: 'Nụ cười tỏa nắng',
    caption: 'Nụ cười làm tan chảy mọi mệt mỏi cả ngày!',
    stickerCharacter: 'me',
    stickerExpression: 'hi-hi-hi',
    speechBubble: 'Hí hí hí! Cưng xỉu! 💖',
    tapeColor: 'bg-sky-300/80',
    tiltAngle: 1.5,
    bgGradient: 'from-blue-100 via-indigo-50 to-pink-50',
  },
  {
    id: 5,
    imageSrc: '/assets/photos/moment-5.jpg',
    altText: 'Nhớ nhung ngọt ngào',
    caption: 'Lúc nào cũng ôm khư khư chiếc điện thoại!',
    stickerCharacter: 'me',
    stickerExpression: 'muon-chat',
    speechBubble: 'Muốn chat với ai đó 📱',
    tapeColor: 'bg-violet-300/80',
    tiltAngle: -1,
    bgGradient: 'from-violet-100 via-purple-50 to-pink-50',
  },
  {
    id: 6,
    imageSrc: '/assets/photos/moment-6.jpg',
    altText: 'Lời hứa 20/10',
    caption: 'Mãi là chỗ dựa vững chãi nhất cho em tròn!',
    stickerCharacter: 'me',
    stickerExpression: 'hehe',
    speechBubble: 'Hehe thương A mỏ lắm! 💕',
    tapeColor: 'bg-rose-400/90',
    tiltAngle: 2.5,
    bgGradient: 'from-rose-100 via-pink-100 to-amber-100',
  },
];

/**
 * Cấu hình đầy đủ Sticker 2 bộ ảnh:
 * Hình 1: Hoành con (không kính, áo hoa tím, trà sữa, thỏ, yeahhh...) - Chỉ xuất hiện ở Page 2
 * Hình 2: Tròn (đeo kính thời trang, áo khoác navy, OK luôn, Hí hí, Đỉnh luôn...) - Page 1 & 2
 */
export const STICKERS_CONFIG: StickerDefinition[] = [
  // --- BỘ STICKER TRÒN (Hình 2) ---
  {
    id: 'tron_ok_luon',
    character: 'me',
    expression: 'ok-luon',
    fileName: 'tron_ok_luon.png',
    label: 'Tròn OK luôn',
    voiceLine: 'OK luôn! ⭐',
    badgeColor: '#f43f5e',
  },
  {
    id: 'tron_hi_hi_hi',
    character: 'me',
    expression: 'hi-hi-hi',
    fileName: 'tron_hi_hi_hi.png',
    label: 'Tròn cười hí hí',
    voiceLine: 'Hí hí hí! 💖',
    badgeColor: '#f43f5e',
  },
  {
    id: 'tron_dinh_luon',
    character: 'me',
    expression: 'dinh-luon',
    fileName: 'tron_dinh_luon.png',
    label: 'Tròn đỉnh luôn',
    voiceLine: 'Đỉnh luôn! ✨',
    badgeColor: '#f43f5e',
  },
  {
    id: 'tron_kho_chiu',
    character: 'me',
    expression: 'kho-chiu',
    fileName: 'tron_kho_chiu.png',
    label: 'Tròn khó chịu quá đi',
    voiceLine: 'Khó chịu quá đi! 💢',
    badgeColor: '#f43f5e',
  },
  {
    id: 'tron_oi_troi_oi',
    character: 'me',
    expression: 'oi-troi-oi',
    fileName: 'tron_oi_troi_oi.png',
    label: 'Tròn ôi trời ơi',
    voiceLine: 'Ôi trời ơi! 😲',
    badgeColor: '#f43f5e',
  },
  {
    id: 'tron_hehe',
    character: 'me',
    expression: 'hehe',
    fileName: 'tron_hehe.png',
    label: 'Tròn cười hehe',
    voiceLine: 'Hehe... 💕',
    badgeColor: '#f43f5e',
  },
  {
    id: 'tron_vo_duyen',
    character: 'me',
    expression: 'vo-duyen',
    fileName: 'tron_vo_duyen.png',
    label: 'Tròn vô duyên cò lẹ',
    voiceLine: 'Vô duyên cò lẹ! 💨',
    badgeColor: '#f43f5e',
  },
  {
    id: 'tron_muon_chat',
    character: 'me',
    expression: 'muon-chat',
    fileName: 'tron_muon_chat.png',
    label: 'Tròn muốn chat',
    voiceLine: 'Muốn chat với ai đó 📱',
    badgeColor: '#f43f5e',
  },

  // --- BỘ STICKER HOÀNH CON (Hình 1 - Dành cho Page 2 Gia Đình Nhỏ) ---
  {
    id: 'hoanh_tra_sua',
    character: 'con',
    expression: 'tra-sua',
    fileName: 'hoanh_tra_sua.png',
    label: 'Hoành con uống trà sữa',
    voiceLine: 'Trà sữa là chân ái! 🧋',
    badgeColor: '#8b5cf6',
  },
  {
    id: 'hoanh_yeahhh',
    character: 'con',
    expression: 'yeahhh',
    fileName: 'hoanh_yeahhh.png',
    label: 'Hoành con yeahhh',
    voiceLine: 'Yeahhh! 🎉',
    badgeColor: '#8b5cf6',
  },
  {
    id: 'hoanh_binh_thuong',
    character: 'con',
    expression: 'binh-thuong',
    fileName: 'hoanh_binh_thuong.png',
    label: 'Hoành con bình thường',
    voiceLine: 'Bình thường! 😒',
    badgeColor: '#8b5cf6',
  },
  {
    id: 'hoanh_kinh_ram',
    character: 'con',
    expression: 'kinh-ram',
    fileName: 'hoanh_kinh_ram.png',
    label: 'Hoành con ngầu lòi',
    voiceLine: 'Ngầu lòi chưa! 😎',
    badgeColor: '#8b5cf6',
  },
  {
    id: 'hoanh_om_tho',
    character: 'con',
    expression: 'om-tho',
    fileName: 'hoanh_om_tho.png',
    label: 'Hoành con ôm thỏ bông',
    voiceLine: 'Thỏ bông cưng xỉu! 🐰',
    badgeColor: '#8b5cf6',
  },
  {
    id: 'hoanh_vo_duyen',
    character: 'con',
    expression: 'vo-duyen',
    fileName: 'hoanh_vo_duyen.png',
    label: 'Hoành con vô duyên',
    voiceLine: 'Vô duyên cò lẹ! 😜',
    badgeColor: '#8b5cf6',
  },
];


export const INITIAL_WHEEL_PRIZES: WheelPrize[] = [
  {
    id: 1,
    label: 'Food Tour Bao Tất',
    fullTitle: '1 Chuyến Food Tour em tròn tự chọn (A mỏ bao 100%)',
    description: 'Em tròn thích ăn gì, quán nào, xa mấy A mỏ cũng chở đi và trả bill không chớp mắt!',
    color: '#ff758c',
    textColor: '#ffffff',
    icon: '🍕',
  },
  {
    id: 2,
    label: 'Vé Xem Phim VIP',
    fullTitle: '1 Vé xem phim suất chiếu đặc biệt + Bắp rang size bự',
    description: 'Được quyền chọn phim, chọn ghế, A mỏ chỉ việc ngoan ngoãn xách bắp nước đi theo!',
    color: '#ff7eb3',
    textColor: '#ffffff',
    icon: '🎬',
  },
  {
    id: 3,
    label: 'Ôm Sạc Pin 10s',
    fullTitle: '1 Chiếc ôm 10 giây nạp đầy 100% năng lượng',
    description: 'Bất cứ khi nào mệt mỏi, chìa thẻ này ra là được A mỏ ôm chặt sạc pin ngay lập tức!',
    color: '#70a6ff',
    textColor: '#ffffff',
    icon: '🤗',
  },
  {
    id: 4,
    label: 'Quyền Giận 5 Phút',
    fullTitle: 'Được giận A mỏ 5 phút không bị cãi lại một câu',
    description: 'Được dỗi, được làm mặt ngầu, A mỏ chỉ được dỗ dành và nhận lỗi!',
    color: '#38ef7d',
    textColor: '#ffffff',
    icon: '😤',
  },
  {
    id: 5,
    label: 'A Mỏ Rửa Chén 1 Tuần',
    fullTitle: 'A mỏ bao trọn gói rửa chén & dọn dẹp 1 tuần liền',
    description: 'Em tròn chỉ việc ngồi xem phim ăn hoa quả, việc rửa chén để chàng trai lo!',
    color: '#f6d365',
    textColor: '#573a08',
    icon: '🧼',
  },
  {
    id: 6,
    label: 'Kim Bài Miễn Tử',
    fullTitle: '1 Lần tha thứ lỗi lầm siêu to khổng lồ',
    description: 'Có hiệu lực vô thời hạn khi lỡ làm chuyện gì dở hơi, em tròn dùng là xong xuôi!',
    color: '#fda085',
    textColor: '#ffffff',
    icon: '👑',
  },
  {
    id: 7,
    label: 'Quay Lại Nữa Nha!',
    fullTitle: 'Quay lại lần nữa! (Vì em quá xinh đẹp)',
    description: 'Vòng quay say đắm trước nhan sắc của em tròn nên tặng thêm 1 lượt quay miễn phí!',
    isTroll: true,
    color: '#a18cd1',
    textColor: '#ffffff',
    icon: '🔄',
  },
  {
    id: 8,
    label: 'Quyền Năng Vô Hạn',
    fullTitle: 'Được sai A mỏ làm 1 điều bất kỳ trong khả năng!',
    description: 'Sai gì làm nấy: đấm lưng, mua trà sữa lúc 10h đêm, hát một bài tình ca...',
    color: '#fbc2eb',
    textColor: '#4a154b',
    icon: '⭐',
  },
];

/**
 * 20 Thẻ lý do yêu thương: Rút ngắn, dí dỏm, ngọt ngào, dưới ~12 từ/lý do
 */
export const INITIAL_REASONS: LoveReason[] = [
  { id: 1, reason: 'Nụ cười em tròn làm tan biến mọi mệt mỏi! ✨', tag: 'Ngọt ngào', icon: '✨' },
  { id: 2, reason: 'Dáng vẻ em ăn ngon trông cưng xỉu luôn! 🍰', tag: 'Đáng yêu', icon: '🍰' },
  { id: 3, reason: 'Luôn biết cách làm A mỏ cười cả ngày! 😂', tag: 'Hài hước', icon: '😂' },
  { id: 4, reason: 'Đôi mắt tròn xoe, nhìn phát anh hiểu liền! 👀', tag: 'Ấm áp', icon: '👀' },
  { id: 5, reason: 'Nhắc anh uống nước dù chính em thức khuya! 💧', tag: 'Quan tâm', icon: '💧' },
  { id: 6, reason: 'Lúc dỗi, cái mỏ chu ra cực đáng yêu! 🐣', tag: 'Đáng yêu', icon: '🐣' },
  { id: 7, reason: 'Luôn ủng hộ mọi dự định của anh! 🤝', tag: 'Tri kỷ', icon: '🤝' },
  { id: 8, reason: 'Người duy nhất chịu cười trò đùa nhạt của anh! 🎭', tag: 'Hài hước', icon: '🎭' },
  { id: 9, reason: 'Nắm tay em đi dạo bình yên lạ lùng! 👫', tag: 'Bình yên', icon: '👫' },
  { id: 10, reason: 'Em tròn lúc nào cũng thơm ngọt như kẹo! 🍬', tag: 'Ngọt ngào', icon: '🍬' },
  { id: 11, reason: 'Mạnh mẽ kiên cường làm anh vừa nể vừa thương! 💪', tag: 'Tự hào', icon: '💪' },
  { id: 12, reason: 'Đi đâu thấy món ngon cũng nhớ phần anh! 🍱', tag: 'Ấm áp', icon: '🍱' },
  { id: 13, reason: 'Giọng nói ngọt ngào xoa dịu một ngày bận rộn! 📱', tag: 'Yên bình', icon: '📱' },
  { id: 14, reason: 'Người mẹ mẫu mực của con nuôi Hoành con! 🏡', tag: 'Gia đình', icon: '🏡' },
  { id: 15, reason: 'Bảo đừng mua hoa tốn tiền nên anh làm web! 🌸', tag: 'Dễ thương', icon: '🌸' },
  { id: 16, reason: 'Luôn bao dung những lần đoảng vị của A mỏ! 🕊️', tag: 'Bao dung', icon: '🕊️' },
  { id: 17, reason: 'Mỗi lần ôm em thấy cả thế giới thu nhỏ! 🧸', tag: 'Yêu thương', icon: '🧸' },
  { id: 18, reason: 'Là động lực để anh nỗ lực mỗi ngày! 🚀', tag: 'Động lực', icon: '🚀' },
  { id: 19, reason: 'Chân thật, mộc mạc và là duy nhất trên đời! 💎', tag: 'Duy nhất', icon: '💎' },
  { id: 20, reason: 'Có em tròn, cuộc sống A mỏ mới trọn vẹn! 💖', tag: 'Vô hạn', icon: '💖' },
];

/**
 * 3 Cây Nến: Thoại cực ngắn (< 8 từ) cho không khí tắt đèn
 */
export const INITIAL_CANDLES: CandleData[] = [
  {
    id: 'candle-ba',
    role: 'ba',
    name: 'A mỏ',
    label: 'Ba (A mỏ)',
    colorName: 'yellow',
    hexColor: '#fbbf24',
    quote: 'Ba soi đường cho mẹ con đi ăn! 😎',
    detail: 'Trụ cột năng lượng & Nguồn tài trợ đồ ăn',
  },
  {
    id: 'candle-me',
    role: 'me',
    name: 'em tròn',
    label: 'Mẹ (em tròn)',
    colorName: 'blue',
    hexColor: '#60a5fa',
    quote: 'Nóc nhà uy quyền, ấm áp nhất quả đất! 💖',
    detail: 'Trái tim của gia đình & Nóc nhà kiên cố',
  },
  {
    id: 'candle-con',
    role: 'con',
    name: 'Hoành con',
    label: 'Con (Hoành con)',
    colorName: 'pink',
    hexColor: '#f472b6',
    quote: 'Con nuôi ngoan ngoãn, chúc mẹ 20/10 ngập quà! ✨',
    detail: 'Thành viên tri ân & Chuyên gia hòa giải',
  },
];

export const INITIAL_GIFT_LAYERS: GiftLayer[] = [
  {
    step: 1,
    boxTitle: 'Bọc Bao Tải Cũ Kỹ 📦',
    dialogue: 'Ủa gì vậy trời? Quà 20/10 mà gói bằng bao tải?! Bóc lớp này ra lẹ đi!',
    buttonLabel: 'Xé toạc lớp bao tải ✂️',
    wrappingColor: '#b45309',
    badge: 'Lớp 1/5',
  },
  {
    step: 2,
    boxTitle: 'Thùng Các-tông Quấn Băng Keo 📦',
    dialogue: 'Quấn gì mà kỹ vậy cha nội! Cố lên, sắp thấy ruột rồi!',
    buttonLabel: 'Dùng hết sức bóc băng keo 💪',
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
    dialogue: 'Đố Hoành con và em tròn đoán được món quà cuối cùng là gì nè!',
    buttonLabel: 'Mở khóa yêu thương 💖',
    wrappingColor: '#a855f7',
    badge: 'Lớp 4/5',
  },
  {
    step: 5,
    boxTitle: 'KHO BÁU TRI ÂN GIA ĐÌNH 3 NGƯỜI 🏆',
    dialogue: 'Món quà vô giá nhất chính là chúng ta có nhau! Chúc mừng 20/10!',
    buttonLabel: 'Nhận chứng nhận gia đình hạnh phúc 🎉',
    wrappingColor: '#f59e0b',
    badge: 'Đích đến!',
  },
];
