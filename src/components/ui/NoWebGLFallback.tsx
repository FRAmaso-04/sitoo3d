export default function NoWebGLFallback() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ minHeight: '100vh', background: 'var(--dark)', padding: '32px' }}
    >
      <p className="font-mono text-smoke text-xs tracking-brand uppercase mb-6">
        AN EXPEDITION INTO THE UNKNOWN
      </p>
      <h1
        className="font-display text-off-white uppercase leading-none"
        style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', letterSpacing: '0.1em' }}
      >
        NEVER STOP<br />EXPLORING
      </h1>
      <p className="font-jp text-cream text-xl mt-4">探索は止まらない</p>
      <p className="font-mono text-smoke text-xs tracking-brand mt-4 uppercase">SINCE 2004</p>

      <div
        className="grid gap-6 mt-12 w-full max-w-lg"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}
      >
        {[
          { name: 'THE RED PINE', code: 'DROP 01' },
          { name: 'NORTHWIND',    code: 'DROP 02' },
          { name: 'EMBER',        code: 'DROP 03' },
        ].map((drop) => (
          <div
            key={drop.name}
            className="border border-smoke text-center"
            style={{ padding: '24px 16px' }}
          >
            <div
              className="w-full mb-3"
              style={{
                aspectRatio: '1',
                background: 'linear-gradient(135deg, #161616, #2a2a2a)',
              }}
            />
            <p className="font-mono text-smoke text-xs tracking-brand uppercase mb-1">
              {drop.code}
            </p>
            <p className="font-display text-cream text-xl tracking-brand">{drop.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
