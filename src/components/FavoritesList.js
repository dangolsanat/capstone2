import React, { useState } from 'react';
import DrinkModal from './DrinkModal';

const FavoritesList = () => {
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [favorites, setFavorites] = useState([]);

  return (
    <div className="favorites-container">
      {favorites.map(drink => (
        <div 
          key={drink.idDrink} 
          className="favorite-item"
          onClick={() => setSelectedDrink(drink)}
        >
          <img src={drink.strDrinkThumb} alt={drink.strDrink} />
          <h3>{drink.strDrink}</h3>
        </div>
      ))}
      
      {selectedDrink && (
        <DrinkModal 
          drink={selectedDrink} 
          onClose={() => setSelectedDrink(null)} 
        />
      )}
    </div>
  );
};

export default FavoritesList; 