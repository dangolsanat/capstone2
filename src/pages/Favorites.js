import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import CocktailCard from '../components/CocktailCard';
import RecipeDisplay from '../components/RecipeDisplay';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Container = styled.div`
  height: calc(100vh - 5rem);
  width: 100%;
  overflow: hidden;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  margin-top: 4rem;
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

const Favorites = ({ searchResults, selectedLetter, search, showContent }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [favorites, setFavorites] = useState([]);
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [displayedCocktails, setDisplayedCocktails] = useState([]);
  const [favoriteCocktails, setFavoriteCocktails] = useState([]);
  const [letterCocktails, setLetterCocktails] = useState([]);

  // Add this function to handle cocktail selection
  const handleCocktailClick = async (cocktail) => {
    try {
      // Fetch detailed cocktail information when clicked
      const response = await axios.get(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktail.idDrink}`
      );
      const detailedCocktail = response.data.drinks[0] || cocktail;
      setSelectedCocktail(detailedCocktail);
      setDisplayedCocktails([detailedCocktail]); // Show only the selected cocktail
    } catch (error) {
      console.error('Error fetching cocktail details:', error);
      setSelectedCocktail(cocktail);
      setDisplayedCocktails([cocktail]);
    }
  };

  // Update the useEffect for letter selection
  useEffect(() => {
    if (selectedLetter) {
      const fetchCocktailsByLetter = async () => {
        try {
          const response = await axios.get(
            `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${selectedLetter.toLowerCase()}`
          );
          const letterResults = response.data.drinks || [];
          setLetterCocktails(letterResults);
          setDisplayedCocktails(letterResults);
        } catch (error) {
          console.error('Error fetching cocktails by letter:', error);
        }
      };
      fetchCocktailsByLetter();
    } else if (!search) {
      // If no letter is selected and no search, show favorites
      setDisplayedCocktails(favoriteCocktails);
    }
  }, [selectedLetter, search, favoriteCocktails]);

  // Update the search results effect
  useEffect(() => {
    if (search && searchResults?.length > 0) {
      const filteredFavorites = searchResults.filter(cocktail => 
        favorites.includes(cocktail.idDrink)
      );
      setDisplayedCocktails(filteredFavorites);
    } else if (selectedLetter) {
      setDisplayedCocktails(letterCocktails);
    } else {
      setDisplayedCocktails(favoriteCocktails);
    }
  }, [searchResults, favorites, favoriteCocktails, letterCocktails, selectedLetter, search]);

  // Add this effect to refresh data when the page is visited
  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, location.key]); // Now location is properly defined

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      // First, get favorite IDs from Supabase
      const { data: favoriteData, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      if (!favoriteData) return;

      setFavorites(favoriteData.map(f => f.cocktail_id));

      // Then fetch full cocktail data for each favorite
      const cocktailPromises = favoriteData.map(fav =>
        axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${fav.cocktail_id}`)
          .then(response => response.data.drinks?.[0])
          .catch(error => {
            console.error('Error fetching cocktail:', error);
            return null;
          })
      );

      const cocktails = await Promise.all(cocktailPromises);
      const validCocktails = cocktails.filter(cocktail => cocktail !== null);

      setFavoriteCocktails(validCocktails);
      if (!selectedLetter && !search) {
        setDisplayedCocktails(validCocktails);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (cocktail) => {
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('cocktail_id', cocktail.idDrink);

    setFavorites(prev => prev.filter(id => id !== cocktail.idDrink));
    setFavoriteCocktails(prev => prev.filter(c => c.idDrink !== cocktail.idDrink));
    setDisplayedCocktails(prev => prev.filter(c => c.idDrink !== cocktail.idDrink));

    if (selectedCocktail?.idDrink === cocktail.idDrink) {
      setSelectedCocktail(null);
    }
  };

  const handleBack = () => {
    setSelectedCocktail(null);
    if (search && searchResults?.length > 0) {
      const filteredFavorites = searchResults.filter(cocktail => 
        favorites.includes(cocktail.idDrink)
      );
      setDisplayedCocktails(filteredFavorites);
    } else if (selectedLetter) {
      setDisplayedCocktails(letterCocktails);
    } else {
      setDisplayedCocktails(favoriteCocktails);
    }
  };

  // Make sure to call fetchFavorites when the component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  return (
    <>
      <Container show={true}>
        {selectedCocktail && (
          <BackButton onClick={handleBack}>
            ← Back to {selectedLetter ? 'all cocktails' : 'favorites'}
          </BackButton>
        )}
        <CocktailGrid isSingleCard={selectedCocktail !== null}>
          {displayedCocktails.map((cocktail) => (
            <CocktailCard 
              key={cocktail.idDrink}
              cocktail={cocktail}
              isMagnified={selectedCocktail?.idDrink === cocktail.idDrink}
              onSelect={handleCocktailClick}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </CocktailGrid>
      </Container>
      <RecipeDisplay cocktail={selectedCocktail} />
    </>
  );
};

export default Favorites; 