"use client";

import { useEffect, useState, useRef } from "react";
import type { ChartData } from "./StockChart";

function calcSMA(data: ChartData[], period: number) {
  const prices = data.map((d) => d.close);
  const result: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) { result.push(NaN); continue; }
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(sum / period);
  }
  return result;
}

function calcRSI(data: ChartData[], period = 14) {
  const prices = data.map((d) => d.close);
  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? -diff : 0);
  }
  const avgGain: number[] = [];
  const avgLoss: number[] = [];
  for (let i = 0; i < gains.length; i++) {
    if (i < period) { avgGain.push(NaN); avgLoss.push(NaN); continue; }
    if (i === period) {
      avgGain.push(gains.slice(0, period).reduce((a, b) => a + b, 0) / period);
      avgLoss.push(losses.slice(0, period).reduce((a, b) => a + b, 0) / period);
    } else {
      avgGain.push((avgGain[i - 1] * (period - 1) + gains[i]) / period);
      avgLoss.push((avgLoss[i - 1] * (period - 1) + losses[i]) / period);
    }
  }
  const rsi: number[] = [];
  for (let i = 0; i < avgGain.length; i++) {
    if (Number.isNaN(avgGain[i])) { rsi.push(NaN); continue; }
    const rs = avgLoss[i] === 0 ? 100 : avgGain[i] / avgLoss[i];
    rsi.push(+(100 - 100 / (1 + rs)).toFixed(1));
  }
  return rsi;
}

function calcMACD(data: ChartData[]) {
  const prices = data.map((d) => d.close);
  const ema12 = calcEMA(prices, 12);
  const ema26 = calcEMA(prices, 26);
  const macdLine: (number | null)[] = ema12.map((v, i) => (v != null && ema26[i] != null ? +(v - ema26[i]!).toFixed(2) : null));
  const validMacd = macdLine.filter((v): v is number => v != null);
  const signal = calcEMA(validMacd, 9);
  const padded: (number | null)[] = Array.from({ length: macdLine.length - signal.length }, () => null);
  return { macdLine, signal: [...padded, ...signal] };
}

function calcEMA(prices: number[], period: number) {
  const k = 2 / (period + 1);
  const result: (number | null)[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) { result.push(null); continue; }
    if (i === period - 1) {
      result.push(prices.slice(0, period).reduce((a, b) => a + b, 0) / period);
    } else {
      const prev = result[i - 1]!;
      result.push(+(prices[i] * k + prev * (1 - k)).toFixed(2));
    }
  }
  return result;
}

function calcVolatility(data: ChartData[], period = 20) {
  const prices = data.map((d) => d.close);
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  const vol: number[] = [];
  for (let i = 0; i < returns.length; i++) {
    if (i < period - 1) { vol.push(NaN); continue; }
    const slice = returns.slice(i - period + 1, i + 1);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const variance = slice.reduce((a, b) => a + (b - mean) ** 2, 0) / period;
    vol.push(+(Math.sqrt(variance) * 100).toFixed(2));
  }
  return vol;
}

function signal(rsi: number | null, macd: number | null, signalLine: number | null, smaShort: number | null | undefined, smaLong: number | null | undefined, _price: number) {
  const breakdown: { name: string; value: string; contribution: number }[] = [];
  let score = 0;

  if (rsi != null) {
    let contrib = 0;
    if (rsi < 35) contrib = 2;
    else if (rsi < 45) contrib = 1;
    else if (rsi > 70) contrib = -2;
    else if (rsi > 60) contrib = -1;
    score += contrib;
    breakdown.push({ name: "RSI (14)", value: rsi.toFixed(2), contribution: contrib });
  } else {
    breakdown.push({ name: "RSI (14)", value: "—", contribution: 0 });
  }

  if (macd != null && signalLine != null) {
    const contrib = macd > signalLine ? 1 : -1;
    score += contrib;
    breakdown.push({ name: "MACD cross", value: `${macd.toFixed(4)} / ${signalLine.toFixed(4)}`, contribution: contrib });
  } else {
    breakdown.push({ name: "MACD cross", value: "—", contribution: 0 });
  }

  if (smaShort != null && smaLong != null && !Number.isNaN(smaShort) && !Number.isNaN(smaLong)) {
    const contrib = smaShort > smaLong ? 1 : -1;
    score += contrib;
    breakdown.push({ name: "SMA (20/50)", value: `${smaShort.toFixed(2)} / ${smaLong.toFixed(2)}`, contribution: contrib });
  } else {
    breakdown.push({ name: "SMA (20/50)", value: "—", contribution: 0 });
  }

  let label: string, color: string;
  if (score >= 2) { label = "Buy"; color = "var(--semantic-success)"; }
  else if (score <= -2) { label = "Sell"; color = "var(--semantic-error)"; }
  else { label = "Hold"; color = "var(--ink-muted)"; }

  return { label, color, score, breakdown };
}

export default function StockAnalysis({ symbol, data }: { symbol: string; data: ChartData[] }) {
  const [analyzing, setAnalyzing] = useState(false);
  const prevDataRef = useRef(data);

  useEffect(() => {
    if (prevDataRef.current !== data) {
      setAnalyzing(true);
      prevDataRef.current = data;
      const timer = setTimeout(() => setAnalyzing(false), 900);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (data.length < 50) return null;

  const prices = data.map((d) => d.close);
  const latest = prices[prices.length - 1];
  const sma20 = calcSMA(data, 20);
  const sma50 = calcSMA(data, 50);
  const rsiArr = calcRSI(data);
  const macd = calcMACD(data);
  const vol = calcVolatility(data);

  const rsiVal = rsiArr[rsiArr.length - 1] ?? null;
  const macdVal = macd.macdLine[macd.macdLine.length - 1] ?? null;
  const signalVal = macd.signal[macd.signal.length - 1] ?? null;
  const sma20Val = Number.isNaN(sma20[sma20.length - 1]) ? undefined : sma20[sma20.length - 1];
  const sma50Val = Number.isNaN(sma50[sma50.length - 1]) ? undefined : sma50[sma50.length - 1];
  const volVal = Number.isNaN(vol[vol.length - 1]) ? null : vol[vol.length - 1];
  const decision = signal(rsiVal, macdVal, signalVal, sma20Val, sma50Val, latest);

  const metrics = [
    { label: "RSI (14)", value: rsiVal != null ? rsiVal.toFixed(2) : "—", interpretation: rsiVal != null ? (rsiVal > 70 ? "Overbought" : rsiVal < 30 ? "Oversold" : "Neutral") : "—" },
    { label: "MACD", value: macdVal != null ? macdVal.toFixed(4) : "—", interpretation: macdVal != null && signalVal != null ? (macdVal > signalVal ? "Bullish" : "Bearish") : "—" },
    { label: "MACD signal", value: signalVal != null ? signalVal.toFixed(4) : "—", interpretation: "" },
    { label: "SMA (20)", value: sma20Val != null ? `$${sma20Val.toFixed(2)}` : "—", interpretation: sma20Val != null && sma50Val != null ? (sma20Val > sma50Val ? "Above 50-day" : "Below 50-day") : "—" },
    { label: "SMA (50)", value: sma50Val != null ? `$${sma50Val.toFixed(2)}` : "—", interpretation: "Long-term trend" },
    { label: "Volatility", value: volVal != null ? `${volVal.toFixed(2)}%` : "—", interpretation: volVal != null ? (volVal > 3 ? "High" : volVal < 1 ? "Low" : "Moderate") : "—" },
    { label: "Current price", value: `$${latest.toFixed(2)}`, interpretation: "" },
  ];

  const arrow = decision.label === "Buy" ? "▲" : decision.label === "Sell" ? "▼" : "◆";
  const arrowColor = decision.label === "Buy" ? "var(--semantic-success)" : decision.label === "Sell" ? "var(--semantic-error)" : "var(--ink-muted)";

  return (
    <div className={`border border-[var(--hairline)] h-full ${analyzing ? "analyzing-active" : ""}`}>
      <div
        className="flex items-center gap-4 px-5 py-5"
        style={{ borderBottom: "1px solid var(--hairline)" }}
      >
        <span
          className="signal-arrow text-[40px] leading-none flex-shrink-0"
          style={{ color: arrowColor }}
        >
          <span key={arrow + decision.label} className="value-flash">{arrow}</span>
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[11px] leading-[1.33] tracking-[0.32px] uppercase text-[var(--ink-subtle)]">
              {symbol} · Technical signal
            </p>
            {analyzing && (
              <span className="flex items-center gap-[3px]" aria-label="Analyzing">
                <span className="analyzing-dot w-[4px] h-[4px] rounded-full bg-[var(--primary)]" />
                <span className="analyzing-dot w-[4px] h-[4px] rounded-full bg-[var(--primary)]" />
                <span className="analyzing-dot w-[4px] h-[4px] rounded-full bg-[var(--primary)]" />
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-3">
            <p
              className="text-[32px] leading-[1.1] tracking-[-0.3px]"
              style={{ fontWeight: 300, color: arrowColor }}
            >
              <span key={decision.label} className="value-flash">{decision.label}</span>
            </p>
            <span
              className="text-[20px] leading-[1.1] tracking-[-0.2px] font-mono"
              style={{ fontWeight: 300, color: arrowColor, opacity: 0.6 }}
            >
              <span key={String(decision.score)} className="value-flash">{decision.score >= 0 ? "+" : ""}{decision.score}</span>
            </span>
          </div>
          {decision.label === "Buy" && (
            <p className="text-[13px] leading-[1.4] text-[var(--ink-muted)] mt-1">
              Bullish momentum — RSI, MACD, and trend alignment support entry
            </p>
          )}
          {decision.label === "Sell" && (
            <p className="text-[13px] leading-[1.4] text-[var(--ink-muted)] mt-1">
              Bearish pressure — indicators suggest downside risk
            </p>
          )}
          {decision.label === "Hold" && (
            <p className="text-[13px] leading-[1.4] text-[var(--ink-muted)] mt-1">
              Mixed signals — wait for clearer direction
            </p>
          )}
        </div>
      </div>
      <div className="metrics-scan grid grid-cols-2 gap-px bg-[var(--hairline)]">
        {metrics.map((m) => (
          <div key={m.label} className="bg-[var(--canvas)] p-3">
            <p className="text-[11px] leading-[1.33] tracking-[0.32px] uppercase text-[var(--ink-subtle)] mb-0.5">
              {m.label}
            </p>
            <p className="text-[16px] leading-[1.4] tracking-normal text-[var(--ink)] font-mono truncate"
               style={{ fontWeight: 300 }}>
              <span key={m.value} className="value-flash">{m.value}</span>
            </p>
            {m.interpretation && (
              <p className="text-[11px] leading-[1.33] tracking-[0.32px] text-[var(--ink-muted)] mt-0.5 truncate">
                <span key={m.interpretation} className="value-flash">{m.interpretation}</span>
              </p>
            )}
          </div>
        ))}
      </div>
      <div
        className="px-5 py-3 flex flex-wrap items-center gap-x-3 gap-y-1"
        style={{ borderTop: "1px solid var(--hairline)" }}
      >
        <span className="text-[12px] leading-[1.29] tracking-[0.16px] text-[var(--ink-muted)]">
          Score:
        </span>
        {decision.breakdown.map((b, i) => (
          <span key={b.name} className="text-[12px] font-mono leading-[1.29] tracking-[0.16px] whitespace-nowrap">
            <span className="text-[var(--ink-subtle)]">{b.name}:</span>
            <span className="text-[var(--ink)]"> {b.value} </span>
            <span
              className="font-semibold"
              style={{
                color: b.contribution > 0 ? "var(--semantic-success)" : b.contribution < 0 ? "var(--semantic-error)" : "var(--ink-muted)",
              }}
            >
              ({b.contribution >= 0 ? "+" : ""}{b.contribution})
            </span>
            {i < decision.breakdown.length - 1 && (
              <span className="text-[var(--hairline)] ml-1">·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
