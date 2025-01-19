import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider as StyledThemeProvider, createGlobalStyle } from 'styled-components';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';
import Layout from './components/Layout';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    transition: all 0.3s ease;
  }
`;

const darkTheme = {
  background: '#1a1a1a',
  surface: '#2d2d2d',
  primary: '#bb86fc',
  text: '#ffffff',
  textSecondary: '#b3b3b3',
  border: '#404040',
  transparent: 'rgba(0, 0, 0, 0.6)'
};

const lightTheme = {
  background: '#f5f5f5',
  surface: '#ffffff',
  primary: '#6200ee',
  text: '#000000',
  textSecondary: '#666666',
  border: '#e0e0e0',
  transparent: 'rgba(0, 0, 0, 0.1)'
};

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.background};
`;

const ThemedApp = () => {
  const { isDarkMode } = useTheme();
  const [selectedLetter, setSelectedLetter] = useState(null);

  const handleLetterSelect = (letter) => {
    console.log('App - handleLetterSelect called with:', letter);
    setSelectedLetter(letter);
  };

  return (
    <StyledThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Router>
        <AppContainer>
          <Navbar onLetterSelect={handleLetterSelect} />
          <Routes>
            <Route path="/" element={
              <Layout selectedLetter={selectedLetter}>
                <Home />
              </Layout>
            } />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/signup" element={<Layout><SignUp /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/favorites" element={
              <Layout selectedLetter={selectedLetter}>
                <Favorites />
              </Layout>
            } />
          </Routes>
        </AppContainer>
      </Router>
    </StyledThemeProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemedApp />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 