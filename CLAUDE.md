# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Swedish receipt generator web application built with React + TypeScript + Vite. Generates PDF receipts with Swedish-specific requirements (VAT handling, Bankgiro payments, Swedish locale formatting).

## Commands

```bash
npm run dev          # Start development server
npm run build        # TypeScript check + Vite build
npm run lint         # ESLint with zero warnings tolerance
npm test             # Run Jest tests
npm run dev-test     # Run Jest in watch mode
npm run coverage     # Run tests with coverage report
```

Run a single test file:
```bash
npx jest src/helpers/price-helpers.spec.ts
```

## Architecture

### Domain Layer (`src/domain/`)
Core business logic for receipt calculations:
- `ReceiptRow` - Class with factory method `fromFormModel()` that calculates VAT-exclusive prices, totals, and VAT amounts using `PriceCalculator`
- `receipt-total.ts` - Aggregates receipt rows, calculates totals grouped by Swedish VAT rates (25%, 12%, 6%, 0%)
- `PriceCalculator` - VAT calculation utilities

### Hooks (`src/hooks/`)
- `useForm` - Generic form generator that creates form elements from TypeScript types using dynamic property introspection via `generatePropertyInformation()`. Stores form state in localStorage
- `useStoredValues` - Generic CRUD hook for localStorage-backed collections with key generation
- `useLocalStorage` - Low-level localStorage hook with Date object hydration via `parseWithDateHydration()`

### Helpers (`src/helpers/`)
Pure utility functions (price formatting, rounding, parsing). Each has corresponding `.spec.ts` test file.

### PDF Generation (`src/use-pdf.tsx`)
Uses jsPDF to generate Swedish receipts with company info, customer info, itemized table, and footer.

## Testing Philosophy

The codebase follows strict unit testing with dependency mocking:
- Business logic is extracted into pure functions in `domain/` and `helpers/` for easy unit testing
- Hooks and components are tested via black-box testing (asserting on DOM output)
- Tests use real implementations of unit-tested modules for integration testing

## Key Types (`src/types.ts`)

- `CompanyInformation` - Company details including Swedish VAT number
- `CustomerInformation` - Customer identity and address
- `ReceiptInformationV2` - Receipt metadata (date, number, payment terms)

## Swedish Locale

The application uses Swedish locale for date formatting (`sv-SE`). The date selector has a known issue with non-Swedish locales.

## Git Commits

- Keep commit messages short and concise
- Do not include Claude attribution (Co-Authored-By) in commits
