import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Mock the Supabase client
jest.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn().mockImplementation(() => 
        Promise.resolve({ data: { session: null }, error: null })
      ),
      onAuthStateChange: jest.fn((callback) => {
        callback('SIGNED_OUT', null);
        return {
          data: {
            subscription: {
              unsubscribe: jest.fn()
            }
          }
        };
      }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    })),
  },
}));

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

global.URL.createObjectURL = jest.fn(() => 'mocked-url'); 