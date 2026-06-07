'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface WireframeGlobeProps {
  width?: number;
  height?: number;
  className?: string;
  accentColor?: string;
  active?: boolean;
}

export default function WireframeGlobe({
  width = 300,
  height = 300,
  className = '',
  accentColor = '#749A96',
  active = false,
}: WireframeGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width  = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width  = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const radius = Math.min(width, height) / 2.4;

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection).context(ctx);

    let landFeatures: d3.ExtendedFeatureCollection | null = null;
    let allDots: [number, number][] = [];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Ocean sphere
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(52,52,52,0.92)';
      ctx.fill();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (!landFeatures) return;

      // Graticule
      const graticule = d3.geoGraticule()();
      ctx.beginPath();
      path(graticule);
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.2;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Land outline
      ctx.beginPath();
      (landFeatures as d3.ExtendedFeatureCollection).features.forEach((f) => path(f));
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = 0.7;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Dots
      allDots.forEach(([lng, lat]) => {
        const proj = projection([lng, lat]);
        if (!proj) return;
        const [px, py] = proj;
        if (px < 0 || px > width || py < 0 || py > height) return;
        ctx.beginPath();
        ctx.arc(px, py, 1.0, 0, 2 * Math.PI);
        ctx.fillStyle = '#DDE3C0';
        ctx.fill();
      });
    };

    const loadData = async () => {
      try {
        const res = await fetch(
          'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json',
        );
        if (!res.ok) throw new Error('failed');
        landFeatures = await res.json() as d3.ExtendedFeatureCollection;

        // Generate sparse dots
        landFeatures.features.forEach((feat) => {
          const bounds = d3.geoBounds(feat);
          const [[minLng, minLat], [maxLng, maxLat]] = bounds;
          const step = 5.5;
          for (let lng = minLng; lng <= maxLng; lng += step) {
            for (let lat = minLat; lat <= maxLat; lat += step) {
              allDots.push([lng, lat]);
            }
          }
        });

        render();
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    };

    const rotation: [number, number, number] = [0, -20, 0];
    const speed = active ? 0.5 : 0.25;

    const timer = d3.timer(() => {
      rotation[0] += speed;
      projection.rotate(rotation);
      render();
    });

    loadData();

    return () => {
      timer.stop();
    };
  }, [width, height, accentColor, active]);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span className="font-pixel" style={{ fontSize: '0.32rem', color: '#749A96', letterSpacing: '0.15em' }}>
            LOADING...
          </span>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'block', borderRadius: 0 }} />
    </div>
  );
}
