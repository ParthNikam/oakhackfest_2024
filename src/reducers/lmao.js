// reducers/search.js
const initialState = {
  searchResults: [],
};

const lmaoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_ALL':
      return {
        ...state,
        lmaoResults: action.payload,
      };
    // Add more cases for other search-related actions if needed
    default:
      return state;
  }
};

export default lmaoReducer;
