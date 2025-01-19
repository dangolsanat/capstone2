import React from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputContainer = styled.div`
  position: relative;
  width: 300px;
  margin: 10px 0;

  input[type="text"] {
    font-size: 20px;
    width: 100%;
    border: none;
    border-bottom: 2px solid ${props => props.theme.border};
    padding: 5px 0;
    background-color: transparent;
    outline: none;
    color: ${props => props.theme.text};
  }

  .label {
    position: absolute;
    top: 0;
    left: 0;
    color: ${props => props.theme.textSecondary};
    transition: all 0.3s ease;
    pointer-events: none;
  }

  input[type="text"]:focus ~ .label,
  input[type="text"]:valid ~ .label {
    top: -20px;
    font-size: 16px;
    color: ${props => props.theme.primary};
  }

  .underline {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background-color: ${props => props.theme.primary};
    transform: scaleX(0);
    transition: all 0.3s ease;
  }

  input[type="text"]:focus ~ .underline,
  input[type="text"]:valid ~ .underline {
    transform: scaleX(1);
  }
`;

const SearchTypeToggle = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  text-align: left;
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const SearchInput = ({ onSearch, searchType, onSearchTypeChange, value }) => {
  return (
    <SearchContainer>
      <SearchTypeToggle onClick={onSearchTypeChange}>
        Search by {searchType === 'name' ? 'ingredient' : 'name'} instead
      </SearchTypeToggle>
      <InputContainer>
        <input
          type="text"
          id="search"
          required=""
          value={value}
          onChange={(e) => onSearch(e.target.value)}
        />
        <label htmlFor="search" className="label">
          Search by {searchType}...
        </label>
        <div className="underline"></div>
      </InputContainer>
    </SearchContainer>
  );
};

export default SearchInput; 