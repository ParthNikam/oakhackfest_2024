// client/src/api/index.js
import axios from 'axios';

const baseURL = 'http://127.0.0.1:5000'; 

const api = axios.create({
  baseURL,
});

export const fetchLlamaResponse = (inputText, modelType) => api.post('/tasks', { inputText, modelType });


