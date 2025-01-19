import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import lightLogo from '../assets/light.png';
import darkLogo from '../assets/dark.png';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import RecipeDisplay from '../components/RecipeDisplay';
import CocktailCard from '../components/CocktailCard';

const Container = styled.div`
  height: calc(100vh - 20rem);
  width: 100%;
  overflow: hidden;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  margin-top: ${props => props.show ? '4rem' : '0'};
`;

const CocktailsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 4px;
  }
`;

const CocktailGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.isSingleCard ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))'};
  gap: 1.5rem;
  justify-items: center;
  padding: ${props => props.isSingleCard ? '2rem' : '1rem'};
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const Home = ({ selectedLetter, searchResults, showContent }) => {
  console.log('Home - Props received:', { selectedLetter, searchResults });
  
  const [cocktails, setCocktails] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [displayedCocktails, setDisplayedCocktails] = useState([]);

  const showLogo = !searchResults?.length && !selectedLetter && !selectedCocktail && displayedCocktails.length === 0;

  useEffect(() => {
    if (user) {
      // Fetch user's favorites
      const fetchFavorites = async () => {
        const { data } = await supabase
          .from('favorites')
          .select('cocktail_id')
          .eq('user_id', user.id);
        setFavorites(data?.map(f => f.cocktail_id) || []);
      };
      fetchFavorites();
    }
  }, [user]);

  useEffect(() => {
    console.log('Home - selectedLetter changed:', selectedLetter);
    if (selectedLetter) {
      const fetchCocktailsByLetter = async () => {
        try {
          const response = await axios.get(
            `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${selectedLetter.toLowerCase()}`
          );
          console.log('Home - Fetched cocktails for letter:', response.data.drinks);
          setDisplayedCocktails(response.data.drinks || []);
        } catch (error) {
          console.error('Error fetching cocktails by letter:', error);
          setDisplayedCocktails([]);
        }
      };
      fetchCocktailsByLetter();
    }
  }, [selectedLetter]);

  useEffect(() => {
    console.log('Home - displayedCocktails useEffect triggered:', { 
      selectedCocktail, 
      searchResults, 
      selectedLetter 
    });
    if (selectedCocktail) {
      setDisplayedCocktails([selectedCocktail]);
    } else if (searchResults?.length > 0) {
      console.log('Home - Setting displayed cocktails from searchResults:', searchResults);
      setDisplayedCocktails(searchResults);
    }
  }, [searchResults, selectedCocktail]);

  const toggleFavorite = async (cocktail) => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }

    const isFavorite = favorites.includes(cocktail.idDrink);
    
    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('cocktail_id', cocktail.idDrink);
      setFavorites(favorites.filter(id => id !== cocktail.idDrink));
    } else {
      await supabase
        .from('favorites')
        .insert([{
          user_id: user.id,
          cocktail_id: cocktail.idDrink,
          cocktail_name: cocktail.strDrink
        }]);
      setFavorites([...favorites, cocktail.idDrink]);
    }
  };

  const handleCocktailClick = async (cocktail) => {
    try {
      const response = await axios.get(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktail.idDrink}`
      );
      const detailedCocktail = response.data.drinks[0] || cocktail;
      setSelectedCocktail(detailedCocktail);
      setDisplayedCocktails([detailedCocktail]);
    } catch (error) {
      console.error('Error fetching cocktail details:', error);
      setSelectedCocktail(cocktail);
      setDisplayedCocktails([cocktail]);
    }
  };

  const handleBack = () => {
    setSelectedCocktail(null);
    if (searchResults?.length > 0) {
      setDisplayedCocktails(searchResults);
    } else if (selectedLetter) {
      // If we have a selected letter, fetch those cocktails again
      const fetchCocktailsByLetter = async () => {
        try {
          const response = await axios.get(
            `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${selectedLetter.toLowerCase()}`
          );
          setDisplayedCocktails(response.data.drinks || []);
        } catch (error) {
          console.error('Error fetching cocktails by letter:', error);
          setDisplayedCocktails([]);
        }
      };
      fetchCocktailsByLetter();
    }
  };

  console.log('Home - Current displayedCocktails:', displayedCocktails);

  return (
    <>
      <Container show={showContent}>
        <CocktailsContainer>
          {selectedCocktail && (
            <BackButton onClick={handleBack}>
              ← Back to all cocktails
            </BackButton>
          )}
          <CocktailGrid isSingleCard={selectedCocktail !== null}>
            {displayedCocktails.map((cocktail) => (
              <CocktailCard 
                key={cocktail.idDrink}
                cocktail={cocktail}
                isMagnified={selectedCocktail?.idDrink === cocktail.idDrink}
                onSelect={setSelectedCocktail}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            ))}
          </CocktailGrid>
        </CocktailsContainer>
      </Container>
      <RecipeDisplay cocktail={selectedCocktail} />
    </>
  );
};

export default Home;