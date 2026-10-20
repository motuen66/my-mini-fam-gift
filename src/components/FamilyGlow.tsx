import React from 'react';

interface FamilyGlowProps {
  litCount: number;
  visible: boolean;
}

/**
 * Ánh sáng nến tràn toàn trang.
 * 1 nến: một vùng sáng. 2 nến: hai vùng chồng màu.
 * 3 nến: cả phòng sáng ấm.
 */
export const FamilyGlow: React.FC<FamilyGlowProps> = ({ litCount, visible }) => {
  const layers = [
    {
      key: 'ba',
      active: litCount >= 1,
      background:
        'radial-gradient(circle 46vmax at 22% 58%, rgba(251, 191, 36, 0.30) 0%, rgba(251, 191, 36, 0.14) 38%, transparent 72%)',
    },
    {
      key: 'me',
      active: litCount >= 2,
      background:
        'radial-gradient(circle 46vmax at 50% 55%, rgba(96, 165, 250, 0.28) 0%, rgba(96, 165, 250, 0.12) 40%, transparent 72%)',
    },
    {
      key: 'con',
      active: litCount >= 3,
      background:
        'radial-gradient(circle 46vmax at 78% 58%, rgba(244, 114, 182, 0.28) 0%, rgba(244, 114, 182, 0.12) 40%, transparent 72%)',
    },
  ];

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {layers.map((layer) => (
        <div
          key={layer.key}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
          style={{
            background: layer.background,
            opacity: layer.active ? 1 : 0,
            mixBlendMode: 'screen',
          }}
        />
      ))}

      {/* Khi đủ 3 nến, cả phòng ấm lên */}
      <div
        className="absolute inset-0 transition-opacity duration-[1600ms] ease-out"
        style={{
          background:
            'radial-gradient(ellipse 90% 75% at 50% 55%, rgba(254, 243, 199, 0.16) 0%, rgba(253, 230, 138, 0.10) 38%, rgba(244, 114, 182, 0.06) 62%, transparent 82%)',
          opacity: litCount >= 3 ? 1 : 0,
          mixBlendMode: 'screen',
        }}
      />

      {/* Viền tối nhẹ để ánh sáng nổi hơn */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(3, 6, 18, 0.55) 100%)',
          opacity: litCount > 0 ? 1 : 0,
        }}
      />
    </div>
  );
};
