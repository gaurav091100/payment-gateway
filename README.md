# Payment Gateway Assignment

Next.js App Router + TypeScript implementation of a simulated payment gateway UI flow.

## Setup (Clone to Run)

### Prerequisites

- Node.js 20+ installed
- npm 10+ installed
- Git installed

### 1) Clone the repository

```bash
git clone https://github.com/gaurav091100/payment-gateway.git
```

### 2) Move into project folder

```bash
cd payment-gateway
```

### 3) Install dependencies

```bash
npm install
```

### 4) Start development server

```bash
npm run dev
```

### 5) Open in browser

Visit `http://localhost:3000`

### Optional checks

```bash
npm run lint
npm run build
```

## Implemented Features

- Real-time payment form validation with disabled submit until valid.
- Card number formatting and card-type detection (`visa`, `mastercard`, `amex`).
- Expiry and CVV validation (Amex CVV = 4, others = 3).
- Currency selector (`INR`, `USD`) and live card preview.
- Mock payment route at `/api/pay` with randomized outcomes:
  - Success ~60%
  - Failed ~25%
  - Timeout response after ~8 seconds ~15%
- Frontend timeout handling with `AbortController` at 6 seconds.
- Retry flow capped to 3 total attempts per transaction.
- Idempotent transaction ID reuse across retries (`crypto.randomUUID()`).
- Persistent transaction history via `localStorage`.
- Clickable transaction history entries with details panel.

## Assumptions

- This assignment focuses on frontend behavior and mocked gateway simulation only.
- Card validation is format/rule based (not full Luhn verification).
- Persisted transaction records from older versions default to `INR` if currency is missing.

## Architecture Notes

- `app/components/` contains presentation and page-level UI components.
- `app/store/` handles global payment lifecycle and transaction state with Redux Toolkit.
- `app/utils/` contains pure helpers for formatting, validation, mapping, and API calls.
- `app/types/` centralizes shared TypeScript types.
- `app/api/pay/route.ts` simulates gateway outcomes.

## Improvements With More Time

- Improve card UX with dynamic formatting for Amex (`4-6-5`) and stricter numeric input.
- Add localized currency formatting and amount precision controls.
- Enhance accessibility further with error summary and keyboard shortcuts.

## Screenshots

<img width="1790" height="889" alt="Screenshot 2026-05-07 021716" src="https://github.com/user-attachments/assets/90961db9-503c-4958-86cf-157b6d19bc3f" />

<img width="1773" height="880" alt="Screenshot 2026-05-07 021736" src="https://github.com/user-attachments/assets/ffa3b9de-0543-4029-8f1d-3039f8a9386e" />

<img width="449" height="796" alt="Screenshot 2026-05-07 025450" src="https://github.com/user-attachments/assets/df5d61a7-2292-48df-85af-d05dac6778b4" />

<img width="439" height="784" alt="Screenshot 2026-05-07 025502" src="https://github.com/user-attachments/assets/9a26df45-91d2-404e-b84e-35a52ecb91e7" />

<img width="441" height="738" alt="Screenshot 2026-05-07 025510" src="https://github.com/user-attachments/assets/6eb6a316-1b6b-4af1-bc15-0060a7bf8c21" />
