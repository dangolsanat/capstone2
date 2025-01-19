const SearchResults = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="no-results">
        <h2>No drinks found</h2>
        <p>Try adjusting your search terms or try a different search.</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      {results.map(drink => (
        <div key={drink.idDrink} className="drink-card" onClick={() => onDrinkClick(drink)}>
          <img src={drink.strDrinkThumb} alt={drink.strDrink} />
          <h3>{drink.strDrink}</h3>
        </div>
      ))}
    </div>
  );
}; 