import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SearchInput from './SearchInput';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import lightLogo from '../assets/light.png';
import darkLogo from '../assets/dark.png';
import moeImage from '../assets/moe.png';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 65rem;
  height: 100vh;
  overflow-y: auto;
  padding: 2rem;
  padding-top: 5rem;
  margin-right: ${props => props.hasRecipe ? '40%' : '0'};
  transition: margin 0.3s ease;

  @media (max-width: 1200px) {
    margin-right: ${props => props.hasRecipe ? '45%' : '0'};
  }

  @media (max-width: 768px) {
    padding: 1rem;
    padding-top: 5rem;
    margin-right: 0;
  }
`;

const SearchContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  z-index: 1000;

  @media (max-width: 768px) {
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 400px;
  }
`;

const BrandLogo = styled.img`
  width: ${props => props.isHome && !props.showContent ? '800px' : '100px'};
  margin: 1rem auto;
  display: block;
  position: fixed;
  top: ${props => props.isHome && !props.showContent ? '50%' : '1rem'};
  left: 50%;
  transform: ${props => props.isHome && !props.showContent ? 
    'translate(-50%, -50%)' : 'translateX(-50%)'};
  z-index: 1000;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: ${props => props.isHome && !props.showContent ? '90%' : '80px'};
  }
`;

const MoeImage = styled.img`
  position: fixed;
  bottom: 2rem;
  right: -10rem;
  width: 800px;
  z-index: 2;
  opacity: 0.9;
  pointer-events: none;

  @media (max-width: 1200px) {
    width: 600px;
  }

  @media (max-width: 768px) {
    width: 400px;
    right: -5rem;
  }
`;

const Layout = ({ children, selectedLetter }) => {
  const { isDarkMode } = useTheme();
  const [searchType, setSearchType] = useState('name');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [hasRecipe, setHasRecipe] = useState(false);

  const isHome = location.pathname === '/';
  const showLogo = !search && !selectedLetter && !searchResults?.length;
  const showContent = search || selectedLetter || searchResults?.length;

  // Clear search when changing pages
  useEffect(() => {
    setSearch('');
    setSearchResults([]);
  }, [location.pathname]);

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleSearchTypeChange = () => {
    setSearchType(prev => prev === 'name' ? 'ingredient' : 'name');
    setSearch('');
    setSearchResults([]);
  };

  // Updated search functionality
  useEffect(() => {
    const searchCocktails = async () => {
      if (!search) {
        setSearchResults([]);
        return;
      }

      try {
        let response;
        if (searchType === 'name') {
          response = await axios.get(
            `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(search)}`
          );
          setSearchResults(response.data.drinks || []);
        } else {
          // Search by ingredient
          response = await axios.get(
            `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(search)}`
          );
          
          if (response.data.drinks) {
            // Get full details for first 10 cocktails
            const detailedPromises = response.data.drinks
              .slice(0, 10)
              .map(drink => 
                axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.idDrink}`)
                  .then(res => res.data.drinks[0])
                  .catch(() => null)
              );

            const detailedResults = await Promise.all(detailedPromises);
            setSearchResults(detailedResults.filter(drink => drink !== null));
          } else {
            setSearchResults([]);
          }
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    };

    const timeoutId = setTimeout(searchCocktails, 300);
    return () => clearTimeout(timeoutId);
  }, [search, searchType]);

  const handleLogoClick = () => {
    navigate('/');
    setSearch('');
    setSearchResults([]);
  };

  return (
    <LayoutContainer>
      <BrandLogo 
        src={isDarkMode ? darkLogo : lightLogo} 
        alt="Cocktail App Logo"
        onClick={handleLogoClick}
        isHome={isHome}
        showContent={showContent}
      />
      <MainContent hasRecipe={hasRecipe}>
        {React.cloneElement(children, { 
          searchResults,
          selectedLetter,
          search,
          showContent,
          onRecipeDisplay: setHasRecipe
        })}
      </MainContent>
      <SearchContainer>
        <SearchInput 
          onSearch={handleSearch}
          searchType={searchType}
          onSearchTypeChange={handleSearchTypeChange}
          value={search}
        />
      </SearchContainer>
      <MoeImage src={moeImage} alt="Moe" />
    </LayoutContainer>
  );
};

export default Layout; 