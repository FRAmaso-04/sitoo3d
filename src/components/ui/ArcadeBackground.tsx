'use client';

// Cinematic arcade background — shown behind the transparent WebGL canvas.
// To add a video: uncomment the <video> block and set src="/video/your-asset.mp4"

export default function ArcadeBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>

      {/* Base atmosphere — deep dark with a hint of indigo */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 90% 70% at 50% 110%, #0c0810 0%, #06040a 45%, #000000 100%)',
      }} />

      {/* Cinematic video background — low opacity, content dissolves into atmosphere */}
      <video
        autoPlay loop muted playsInline
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          opacity: 0.12,
          mixBlendMode: 'lighten',
          filter: 'blur(8px) saturate(0.4)',
        }}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
      />

      {/* Subtle grid — faint perspective lines */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }} />

      {/* Stage floor glow — red brand accent pooling at the bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
        background: 'linear-gradient(0deg, rgba(204,17,17,0.06) 0%, transparent 100%)',
      }} />

      {/* Top fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '25%',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)',
      }} />

      {/* Radial vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.75) 100%)',
      }} />

      {/* CRT scanlines */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.14) 2px, rgba(0,0,0,0.14) 4px)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
