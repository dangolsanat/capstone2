import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../supabaseClient';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(255, 255, 255, 0.5);
  color: ${props => props.theme.text};
  position: relative;
  z-index: 10;
`;

const UserIconButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  position: relative;
  font-size: 24px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${props => props.theme.surface};
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  padding: 0.5rem;
  display: ${props => props.show ? 'block' : 'none'};
  border: 1px solid ${props => props.theme.border};
`;

const AlphabetButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.text};
  color: ${props => props.theme.text};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
`;

const ThemeToggle = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  font-size: 24px;
  cursor: pointer;
  padding: 0.5rem;
  margin-right: 1rem;
`;

const AlphabetContainer = styled.div`
  display: ${props => props.show ? 'flex' : 'none'};
  gap: 0.5rem;
  position: absolute;
  top: 100%;
  left: 0;
  padding: 1rem;
  background: ${props => props.theme.surface};
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 80vw;
  z-index: 1000;
`;

const LetterButton = styled.button`
  background: transparent;
  border: 1px solid ${props => props.theme.text};
  color: ${props => props.theme.text};
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${props => props.theme.primary};
    color: white;
  }
`;

const FavoritesButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  font-size: 24px;
  cursor: pointer;
  padding: 0.5rem;
  margin-right: 1rem;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
`;

const Navbar = ({ onLetterSelect }) => {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAlphabet, setShowAlphabet] = useState(false);
  
  const alphabet = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
    setShowDropdown(false);
  };

  const handleFavoritesClick = () => {
    navigate('/favorites', { state: { timestamp: Date.now() } });
  };

  return (
    <Nav>
      <div style={{ position: 'relative' }}>
        <AlphabetButton onClick={() => setShowAlphabet(!showAlphabet)}>
          A-Z
        </AlphabetButton>
        <AlphabetContainer show={showAlphabet}>
          {alphabet.map(letter => (
            <LetterButton 
              key={letter}
              onClick={() => {
                console.log('Letter button clicked:', letter);
                if (onLetterSelect) {
                  console.log('onLetterSelect exists, calling with:', letter);
                  onLetterSelect(letter);
                  setShowAlphabet(false);
                } else {
                  console.log('onLetterSelect is not defined!');
                }
              }}
            >
              {letter}
            </LetterButton>
          ))}
        </AlphabetContainer>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {user && (
          <FavoritesButton onClick={handleFavoritesClick}>
            ❤️
          </FavoritesButton>
        )}
        <ThemeToggle onClick={toggleTheme}>
          {isDarkMode ? '🌞' : '🌙'}
        </ThemeToggle>
        <div style={{ position: 'relative' }}>
          <UserIconButton onClick={() => setShowDropdown(!showDropdown)}>
            👤
          </UserIconButton>
          {showDropdown && (
            <DropdownMenu show={showDropdown}>
              {user ? (
                <>
                  <Link to="/profile" style={{ display: 'block', padding: '0.5rem', color: 'inherit', textDecoration: 'none' }}>
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    style={{ 
                      display: 'block', 
                      width: '100%',
                      padding: '0.5rem',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: 'inherit'
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={{ display: 'block', padding: '0.5rem', color: 'inherit', textDecoration: 'none' }}>
                    Login
                  </Link>
                  <Link to="/signup" style={{ display: 'block', padding: '0.5rem', color: 'inherit', textDecoration: 'none' }}>
                    Sign Up
                  </Link>
                </>
              )}
            </DropdownMenu>
          )}
        </div>
      </div>
    </Nav>
  );
};

export default Navbar;