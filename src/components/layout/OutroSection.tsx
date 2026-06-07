'use client';

export default function OutroSection() {
  return (
    <footer
      className="relative flex flex-col items-center justify-center text-center overflow-hidden"
      style={{
        minHeight: '60vh',
        background: '#1E1A16',
        borderTop: '1px solid rgba(148,132,102,0.2)',
        padding: '48px 32px',
      }}
    >
      {/* Scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.018) 3px, rgba(255,255,255,0.018) 6px)',
      }} />

      {/* Corner brackets */}
      {(['tl','tr','bl','br'] as const).map((pos) => {
        const base: React.CSSProperties = { position: 'absolute', width: 36, height: 36 };
        const sides: Record<string, React.CSSProperties> = {
          tl: { top: 20, left: 20, borderTop: '1px solid var(--smoke)', borderLeft: '1px solid var(--smoke)' },
          tr: { top: 20, right: 20, borderTop: '1px solid var(--smoke)', borderRight: '1px solid var(--smoke)' },
          bl: { bottom: 20, left: 20, borderBottom: '1px solid var(--smoke)', borderLeft: '1px solid var(--smoke)' },
          br: { bottom: 20, right: 20, borderBottom: '1px solid var(--smoke)', borderRight: '1px solid var(--smoke)' },
        };
        return <div key={pos} style={{ ...base, ...sides[pos] }} />;
      })}

      {/* Kicker pixel — leggibile su scuro */}
      <p
        className="font-pixel"
        style={{
          fontSize: '0.42rem',
          color: 'var(--smoke)',
          letterSpacing: '0.2em',
          marginBottom: 32,
        }}
      >
        NEVER STOP EXPLORING&nbsp;·&nbsp;探索は止まらない&nbsp;·&nbsp;SINCE 2004
      </p>

      {/* Main tagline — grande, leggibile */}
      <h2
        className="font-display uppercase leading-none"
        style={{
          fontSize: 'clamp(2.5rem, 7vw, 6rem)',
          color: 'var(--cream)',
          letterSpacing: '0.12em',
          marginBottom: 12,
        }}
      >
        HEAVY COTTON,
      </h2>
      <h2
        className="font-display uppercase leading-none"
        style={{
          fontSize: 'clamp(2.5rem, 7vw, 6rem)',
          color: 'var(--red)',
          letterSpacing: '0.12em',
        }}
      >
        HEAVY INTENTIONS.
      </h2>

      {/* Divider */}
      <div style={{
        width: 160, height: 1,
        background: 'linear-gradient(90deg, transparent, var(--smoke), transparent)',
        margin: '36px auto',
      }} />

      {/* Nav links — pixel font leggibile */}
      <div style={{ display: 'flex', gap: 48, marginBottom: 24 }}>
        {['SHOP', 'ABOUT', 'CONTACT'].map((link) => (
          <a
            key={link}
            href="#"
            className="font-pixel"
            style={{
              fontSize: '0.45rem',
              color: 'var(--smoke)',
              letterSpacing: '0.2em',
              textDecoration: 'none',
              transition: 'color 0.2s ease-out',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cream)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--smoke)')}
          >
            {link}
          </a>
        ))}
      </div>

      {/* Copyright */}
      <p className="font-pixel" style={{
        fontSize: '0.32rem',
        color: 'rgba(148,132,102,0.45)',
        letterSpacing: '0.15em',
      }}>
        © 2004 — EXPEDITION SERIES · ALL RIGHTS RESERVED
      </p>
    </footer>
  );
}
