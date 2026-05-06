'use client';

import { useEffect, useRef } from "react";
import { PaymentStatus } from "../types/payment";

interface Props {
  status: PaymentStatus;
  error?: string;
}

export default function StatusScreen({ status, error }: Props) {
  const statusRef = useRef<HTMLDivElement>(null);
  const baseClass =
    "mt-4 rounded-2xl border px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500";

  useEffect(() => {
    if (status !== 'idle') {
      statusRef.current?.focus();
    }
  }, [status]);


  
  if (status === 'idle'){
    return (
      <div className="rounded-2xl px-4 py-3 text-sm text-slate-600">
        <p className="mt-1">
          No payment initiated yet. Fill the form and click “Pay Now”.
        </p>
      </div>
    )
  }

  if (status === 'processing') {
    return (
      <div ref={statusRef} tabIndex={-1} aria-live="polite" className={`${baseClass} border-blue-200 bg-blue-50 text-blue-800`}>
        <p className="font-semibold">
          Processing payment...
        </p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div ref={statusRef} tabIndex={-1} aria-live="polite" className={`${baseClass} border-emerald-200 bg-emerald-50 text-emerald-800`}>
        <p className="font-semibold">
          Payment Successful
        </p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div ref={statusRef} tabIndex={-1} aria-live="polite" className={`${baseClass} border-red-200 bg-red-50 text-red-800`}>
        <p className="font-semibold">
          Payment Failed
        </p>
        {error && (
          <p className="mt-1 text-xs text-red-700/90">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (status === 'timeout') {
    return (
      <div ref={statusRef} tabIndex={-1} aria-live="polite" className={`${baseClass} border-amber-200 bg-amber-50 text-amber-800`}>
        <p className="font-semibold">
          Request Timed Out
        </p>
        <p className="mt-1 text-xs text-amber-700/90">
          Please try again
        </p>
      </div>
    );
  }

  return null;
}