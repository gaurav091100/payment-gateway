'use client';

import { CardType } from "../types/payment";

interface Props {
  name: string;
  cardNumber: string;
  expiry: string;
  cardType: CardType;
}

export default function CardPreview({
  name,
  cardNumber,
  expiry,
  cardType,
}: Props) {
  const brandLabel = cardType === "unknown" ? "CARD" : cardType.toUpperCase();

  return (
    <div className="relative w-full lg:w-3/4 h-56 overflow-hidden rounded-3xl border border-white/20 bg-linear-to-r from-gray-800 to-gray-900 p-6 text-white shadow-lg">
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-cyan-300/20 blur-2xl" />

      <div className="relative flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.32em] text-white/80">Secure Payment</p>
        <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
          {brandLabel}
        </span>
      </div>

      <div className="relative mt-8 font-mono text-sm lg:text-2xl tracking-[0.18em]">
        {cardNumber || '•••• •••• •••• ••••'}
      </div>

      <div className="relative mt-10 flex items-end justify-between">
        <div>
          <p className="text-[10px] lg:text-xs uppercase tracking-[0.2em] text-white/70">Card Holder</p>
          <p className="text-sm font-semibold uppercase tracking-wide">
            {name || 'YOUR NAME'}
          </p>
        </div>

        <div>
          <p className="text-[10px] lg:text-xs uppercase tracking-[0.2em] text-white/70">Expires</p>
          <p className="text-xs lg:text-sm font-semibold tracking-widest">{expiry || 'MM/YY'}</p>
        </div>
      </div>
    </div>
  );
}