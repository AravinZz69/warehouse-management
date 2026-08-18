'use client';

import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeBadgeProps {
  value: string;
  format?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  className?: string;
}

export const BarcodeBadge: React.FC<BarcodeBadgeProps> = ({
  value,
  format = 'CODE128',
  width = 1.5,
  height = 40,
  fontSize = 12,
  className,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format,
          width,
          height,
          displayValue: true,
          fontSize,
          background: 'transparent',
          margin: 4,
        });
      } catch (err) {
        console.warn('JsBarcode render error:', err);
      }
    }
  }, [value, format, width, height, fontSize]);

  return (
    <div className={`inline-flex flex-col items-center justify-center p-2 rounded bg-surface-sub border border-border-subtle ${className || ''}`}>
      <svg ref={svgRef} className="max-w-full" />
    </div>
  );
};
