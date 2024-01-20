// reducers/index.js
import { combineReducers } from 'redux';
import lmaoReducer from './lmao'; 

const rootReducer = combineReducers({
  lmao: lmaoReducer,
});

export default rootReducer;
