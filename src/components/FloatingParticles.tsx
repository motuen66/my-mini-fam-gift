import React, { useMemo } from 'react';

interface Particle {
  id: number;
  emoji: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
}

interface FloatingParticlesProps {
  darkMode?: boolean;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({ darkMode = false }) => {
  const particles: Particle[] = useMemo(() => {
    const emojis = darkMode
      ? ['✨', '⭐', '💫', '💛', '🌟', '🕯️']
      : ['🌸', '✨', '💖', '🌼', '🌷', '⭐', '🎈'];

    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: Math.random() * 100,
      size: (darkMode ? 12 : 16) + Math.random() * 18,
      duration: (darkMode ? 14 : 10) + Math.random() * 10,
      delay: Math.random() * 8,
      rotation: Math.random() * 360,
    }));
  }, [darkMode]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-1000"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute select-none animate-float-down"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            top: '-40px',
            opacity: darkMode ? 0.35 : 0.45,
            filter: darkMode
              ? 'drop-shadow(0 0 6px rgba(253, 224, 71, 0.6))'
              : 'drop-shadow(0 2px 4px rgba(244,114,182,0.2))',
          }}
        >
          {p.emoji}
        </span>
      ))}
      <style>{`
        @keyframes floatDown {
          0% {
            transform: translateY(-20px) rotate(0deg) translateX(0px);
            opacity: 0;
          }
          15% {
            opacity: 0.7;
          }
          85% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(105vh) rotate(360deg) translateX(40px);
            opacity: 0;
          }
        }
        .animate-float-down {
          animation: floatDown linear infinite;
        }
      `}</style>
    </div>
  );
};
