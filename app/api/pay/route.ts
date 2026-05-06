import { NextRequest, NextResponse } from 'next/server';

function getRandomOutcome() {
  const rand = Math.random();

  if (rand < 0.6) return 'success';
  if (rand < 0.85) return 'failed';
  return 'timeout';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const outcome = getRandomOutcome();

    if (outcome === 'timeout') {
      // Simulate timeout response around 8 seconds total
      await new Promise((res) => setTimeout(res, 8000));
      return NextResponse.json({
        status: 'timeout',
        transactionId: body.transactionId,
      });
    }

    // Simulate normal processing delay
    await new Promise((res) => setTimeout(res, 2000));

    if (outcome === 'success') {
      return NextResponse.json({
        status: 'success',
        transactionId: body.transactionId,
      });
    }

    if (outcome === 'failed') {
      return NextResponse.json({
        status: 'failed',
        reason: 'Insufficient funds',
        transactionId: body.transactionId,
      });
    }

  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Something went wrong' },
      { status: 500 }
    );
  }
}