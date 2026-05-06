'use client';

import { PaymentStatus } from "../store/paymentSlice";

interface Props {
  status: PaymentStatus;
  error?: string;
}

export default function StatusScreen({ status, error }: Props) {
  if (status === 'idle') return null;

  if (status === 'processing') {
    return (
      <div className="mt-4 p-4 border rounded text-center">
        <p className="text-blue-600 font-semibold">
          Processing payment...
        </p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="mt-4 p-4 border rounded text-center">
        <p className="text-green-600 font-semibold">
          Payment Successful 🎉
        </p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="mt-4 p-4 border rounded text-center">
        <p className="text-red-600 font-semibold">
          Payment Failed
        </p>
        {error && (
          <p className="text-sm text-gray-500 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (status === 'timeout') {
    return (
      <div className="mt-4 p-4 border rounded text-center">
        <p className="text-yellow-600 font-semibold">
          Request Timed Out ⏳
        </p>
        <p className="text-sm text-gray-500">
          Please try again
        </p>
      </div>
    );
  }

  return null;
}