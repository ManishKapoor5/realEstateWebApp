import React, { useState } from 'react';
import axios from 'axios';

const SearchBox = ({ onSearchResults }) => {
  const [location, setLocation] = useState('Delhi NCR');
  const [propertyType, setPropertyType] = useState('Flat/Apartment');
  const [searchQuery, setSearchQuery] = useState('');
  const [buyRent, setBuyRent] = useState('Buy');
  const [isLoading, setIsLoading] = useState(false);

  const propertyTypes = ['Flat/Apartment', 'Villa', 'Builder Floor', 'Plot', 'Independent House'];
  
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/properties/search', {
        params: {
          location,
          propertyType,
          searchQuery,
          listingType: buyRent,
        }
      });
      
      onSearchResults(response.data);
    } catch (error) {
      console.error('Error searching properties:', error);
      alert('Failed to search properties. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-container bg-white rounded-lg p-4 shadow-md">
      <div className="tabs-container flex mb-4">
        <button 
          className={`flex-1 py-3 rounded-l-md ${buyRent === 'Buy' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setBuyRent('Buy')}
        >
          <span className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Buy
          </span>
        </button>
        <button 
          className={`flex-1 py-3 ${buyRent === 'Rent' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setBuyRent('Rent')}
        >
          <span className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
              <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 010 2h-2v-2z" />
            </svg>
            Rent
          </span>
        </button>
        <button 
          className={`flex-1 py-3 rounded-r-md ${buyRent === 'Commercial' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setBuyRent('Commercial')}
        >
          <span className="flex items-center justify-center">
            Commercial
          </span>
        </button>
      </div>
      
      <div className="search-inputs flex flex-wrap mb-4">
        <div className="location-dropdown w-full md:w-1/3 pr-0 md:pr-2 mb-2 md:mb-0">
          <div className="relative">
            <select
              className="w-full p-3 border rounded-md"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Pune">Pune</option>
            </select>
          </div>
        </div>
        
        <div className="search-query w-full md:w-2/3 mb-2 md:mb-0">
          <input
            type="text"
            placeholder="Search for locality, landmark, project or builder"
            className="w-full p-3 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="property-types flex flex-wrap gap-2 mb-4">
        {propertyTypes.map(type => (
          <button
            key={type}
            className={`px-4 py-2 border rounded-full text-sm ${propertyType === type ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-gray-300'}`}
            onClick={() => setPropertyType(type)}
          >
            {type}
          </button>
        ))}
      </div>
      
      <div className="search-button">
        <button
          className="w-full md:w-auto px-8 py-3 bg-purple-600 text-white rounded-md flex items-center justify-center"
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </span>
          ) : (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              Search
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchBox;