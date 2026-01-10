import '@testing-library/jest-dom'

// Mock canvas getContext to prevent jsPDF errors in tests
HTMLCanvasElement.prototype.getContext = jest.fn(() => null);