export default function OutroSection() {
  return (
    <footer
      className="flex flex-col items-center justify-center text-center"
      style={{
        height:      '60vh',
        background:  'var(--dark)',
        borderTop:   '1px solid var(--smoke)',
        padding:     '32px',
      }}
    >
      <p className="font-mono text-smoke text-xs tracking-brand uppercase mb-6">
        NEVER STOP EXPLORING / 探索は止まらない / SINCE 2004
      </p>
      <h2
        className="font-display text-cream uppercase leading-none"
        style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', letterSpacing: '0.15em' }}
      >
        HEAVY COTTON,<br />HEAVY INTENTIONS.
      </h2>
      <div className="flex gap-8 mt-8">
        {['SHOP', 'ABOUT', 'CONTACT'].map((link) => (
          <a
            key={link}
            href="#"
            className="font-mono text-smoke text-xs tracking-brand uppercase hover:text-cream transition-colors"
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}
