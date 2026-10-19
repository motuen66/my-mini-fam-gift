export interface AppConfig {
  names: {
    gifter: string; // "A mỏ"
    recipient: string; // "em tròn"
    thirdPerson: string; // "Hoành con"
  };
  eventTitle: string; // "Chúc Mừng Ngày Phụ Nữ Việt Nam 20/10"
  tagline: string; // "Món quà tương tác tràn ngập yêu thương và tiếng cười"
  voiceNoteBoyfriend: {
    audioUrl: string;
    durationEstimate: string;
    transcript: string[];
  };
  voiceNoteFamily: {
    audioUrl: string;
    durationEstimate: string;
    transcript: string[];
  };
}

export interface StoryChapter {
  id: number;
  chapterNumber: string;
  title: string;
  subtitle: string;
  content: string[];
  emotion: string;
  accentColor: string;
  bgGradient: string;
  iconName: string;
  customNote?: string;
}

export interface WheelPrize {
  id: number;
  label: string;
  fullTitle: string;
  description: string;
  isTroll?: boolean;
  color: string;
  textColor: string;
  icon: string;
}

export interface LoveReason {
  id: number;
  reason: string;
  tag: string;
  icon: string;
}

export interface CandleData {
  id: string;
  role: 'ba' | 'me' | 'con';
  name: string;
  label: string;
  colorName: 'yellow' | 'blue' | 'pink';
  hexColor: string;
  quote: string;
  detail: string;
}

export interface GiftLayer {
  step: number;
  boxTitle: string;
  dialogue: string;
  buttonLabel: string;
  wrappingColor: string;
  badge: string;
}

export interface PhotoMoment {
  id: number;
  imageSrc?: string;
  altText: string;
  caption: string; // < 10 words, humorous label/bubble
  stickerCharacter: 'ba' | 'me' | 'con';
  stickerExpression: 'cuoi' | 'quau' | 'doian' | 'chumom' | 'hahe' | 'tha-tim';
  speechBubble: string;
  tapeColor: string;
  tiltAngle: number;
  bgGradient: string;
}

export interface StickerDefinition {
  id: string;
  character: 'ba' | 'me' | 'con';
  expression: string;
  fileName: string;
  label: string;
  voiceLine: string;
  badgeColor: string;
}

