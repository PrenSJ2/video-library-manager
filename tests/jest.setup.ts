// This file runs once before all tests.
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock the API_KEY environment variable for all tests that might need it.
process.env.GEMINI_API_KEY = 'test-api-key';

