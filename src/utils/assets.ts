/**
 * Ghép đường dẫn asset với base của Vite.
 * Nhờ vậy site chạy đúng cả khi deploy ở root (Netlify)
 * hoặc ở thư mục con (GitHub Pages).
 */
const BASE = import.meta.env.BASE_URL || '/';

export function assetUrl(path: string): string {
  if (!path) return path;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${BASE}${path.replace(/^\/+/, '')}`;
}

const AUDIO_EXTENSIONS = ['.mp3', '.m4a', '.wav', '.ogg'];
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

function withExtensions(url: string, extensions: string[]): string[] {
  const clean = url.replace(/\.(mp3|m4a|wav|ogg|jpg|jpeg|png|webp)$/i, '');
  const result: string[] = [];

  // Ưu tiên đúng file người dùng khai báo trước.
  const original = assetUrl(url);
  result.push(original);

  for (const ext of extensions) {
    const candidate = assetUrl(`${clean}${ext}`);
    if (!result.includes(candidate)) result.push(candidate);
  }

  return result;
}

/** Ví dụ: /audio/voice.m4a -> [/audio/voice.m4a, /audio/voice.mp3, ...] */
export function audioCandidates(url: string): string[] {
  return withExtensions(url, AUDIO_EXTENSIONS);
}

/** Ví dụ: /assets/photos/moment-1.jpg -> thử thêm .png, .webp... */
export function imageCandidates(url: string): string[] {
  return withExtensions(url, IMAGE_EXTENSIONS);
}
