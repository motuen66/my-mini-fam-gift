export type CharacterType = 'ba' | 'me' | 'con';

export type ExpressionType =
  | 'ok-luon'
  | 'hi-hi-hi'
  | 'dinh-luon'
  | 'kho-chiu'
  | 'oi-troi-oi'
  | 'hehe'
  | 'vo-duyen'
  | 'muon-chat'
  | 'um'
  | 'buon-ngu'
  | 'di-thoi'
  | 'tra-sua'
  | 'yeahhh'
  | 'binh-thuong'
  | 'kinh-ram'
  | 'om-tho'
  | 'cuoi'
  | 'quau'
  | 'doian'
  | 'chumom'
  | 'hahe'
  | 'tha-tim'
  | 'ngaongoc';

export interface AppConfig {
  names: {
    gifter: string;
    recipient: string;
    thirdPerson: string;
  };
  eventTitle: string;
  tagline: string;
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
  role: CharacterType;
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
  caption: string;
  stickerCharacter: CharacterType;
  stickerExpression: ExpressionType;
  speechBubble: string;
  tapeColor: string;
  tiltAngle: number;
  bgGradient: string;
}

export interface StickerDefinition {
  id: string;
  character: CharacterType;
  expression: ExpressionType;
  fileName: string;
  label: string;
  voiceLine: string;
  badgeColor: string;
}

export interface LoveLetterContent {
  title: string;
  paragraphs: string[];
  signature: string;
}
