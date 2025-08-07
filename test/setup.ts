// Setup file for Jest tests
import 'reflect-metadata';

// Mock JWT guard
jest.mock('../src/auth/jwt-auth.guard', () => ({
  JwtAuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}));
