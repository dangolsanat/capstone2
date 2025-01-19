import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock the Supabase client
jest.mock('./supabaseClient', () => ({
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
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
    },
  },
}));

global.URL.createObjectURL = jest.fn(() => 'mocked-url'); 