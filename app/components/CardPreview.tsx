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
  return (
    <div className="w-full max-w-md h-52 rounded-2xl p-6 text-white bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
      
      {/* Card Type */}
      <div className="flex justify-end text-sm uppercase">
        {cardType}
      </div>

      {/* Card Number */}
      <div className="mt-6 text-lg tracking-widest">
        {cardNumber || '•••• •••• •••• ••••'}
      </div>

      {/* Bottom */}
      <div className="flex justify-between items-end mt-8">
        <div>
          <p className="text-xs opacity-70">Card Holder</p>
          <p className="uppercase">
            {name || 'YOUR NAME'}
          </p>
        </div>

        <div>
          <p className="text-xs opacity-70">Expires</p>
          <p>{expiry || 'MM/YY'}</p>
        </div>
      </div>
    </div>
  );
}