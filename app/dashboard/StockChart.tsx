"use client";

import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries, ColorType } from "lightweight-charts";

const PRICES: Record<string, number> = {
  AAPL: 178, NVDA: 880, MSFT: 425, GOOGL: 175, AMZN: 185,
  TSLA: 245, META: 510, JPM: 195, V: 275, JNJ: 158,
};

function generateBars(count: number, basePrice: number) {
  const bars = [];
  const now = Date.now();
  let price = basePrice;
  for (let i = count - 1; i >= 0; i--) {
    const t = new Date(now - i * 60_000);
    const change = (Math.random() - 0.48) * basePrice * 0.02;
    const open = price;
    const close = +(price + change).toFixed(2);
    const high = +(Math.max(open, close) + Math.abs(change) * 0.5 + Math.random() * basePrice * 0.005).toFixed(2);
    const low = +(Math.min(open, close) - Math.abs(change) * 0.5 - Math.random() * basePrice * 0.005).toFixed(2);
    bars.push({ time: (t.getTime() / 1000) as any, open, high, low, close });
    price = close;
  }
  return bars;
}

export type ChartData = { time: number; open: number; high: number; low: number; close: number };

export function generateData(symbol: string, count = 390) {
  return { bars: generateBars(count, PRICES[symbol] ?? 100), basePrice: PRICES[symbol] ?? 100 };
}

export default function StockChart({ symbol, data }: { symbol: string; data: ChartData[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const el = container;

    function getHeight() {
      return Math.max(el.clientHeight, 300);
    }

    const chart = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#8c8c8c",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#f4f4f4" },
        horzLines: { color: "#f4f4f4" },
      },
      crosshair: {
        vertLine: { width: 1, color: "#0f62fe", style: 2 },
        horzLine: { width: 1, color: "#0f62fe", style: 2 },
      },
      timeScale: {
        borderColor: "#e0e0e0",
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: "#e0e0e0",
      },
      width: container.clientWidth,
      height: getHeight(),
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#24a148",
      downColor: "#da1e28",
      borderDownColor: "#da1e28",
      borderUpColor: "#24a148",
      wickDownColor: "#da1e28",
      wickUpColor: "#24a148",
    });

    series.setData(data as any);
    chart.timeScale().fitContent();

    const interval = setInterval(() => {
      const last = data[data.length - 1];
      if (!last) return;
      const change = (Math.random() - 0.48) * last.close * 0.01;
      const open = last.close;
      const close = +(open + change).toFixed(2);
      const bar = { time: (Date.now() / 1000) as any, open, high: Math.max(open, close) + Math.abs(change) * 0.3, low: Math.min(open, close) - Math.abs(change) * 0.3, close };
      data.push(bar);
      if (data.length > 500) data.shift();
      series.update(bar as any);
    }, 3000);

    const handleResize = () => {
      chart.applyOptions({ width: el.clientWidth, height: getHeight() });
    };
    window.addEventListener("resize", handleResize);

    const ro = new ResizeObserver(() => handleResize());
    ro.observe(el);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
      ro.disconnect();
      chart.remove();
    };
  }, [symbol, data]);

  return <div ref={containerRef} className="w-full flex-1" />;
}
