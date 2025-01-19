import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  margin-bottom: 2rem;
`;

const FavoritesList = styled.div`
  margin-top: 2rem;
`;

const Profile = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id);

        if (!error && data) {
          setFavorites(data);
        }
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <Container>
      <ProfileCard>
        <Title>Profile</Title>
        <p>Email: {user?.email}</p>
        
        <FavoritesList>
          <h3>Favorite Cocktails</h3>
          {favorites.length === 0 ? (
            <p>No favorite cocktails yet!</p>
          ) : (
            <ul>
              {favorites.map((favorite) => (
                <li key={favorite.id}>{favorite.cocktail_name}</li>
              ))}
            </ul>
          )}
        </FavoritesList>
      </ProfileCard>
    </Container>
  );
};

export default Profile; 