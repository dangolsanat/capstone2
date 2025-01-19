import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const mockTheme = {
  background: '#fff',
  text: '#000',
  primary: '#333',
  transparent: 'rgba(0,0,0,0.1)',
};

const themeContextValue = {
  isDarkMode: false,
  toggleTheme: jest.fn(),
};

const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeContext.Provider value={themeContextValue}>
        <ThemeProvider theme={mockTheme}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </ThemeContext.Provider>
    </BrowserRouter>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render }; 