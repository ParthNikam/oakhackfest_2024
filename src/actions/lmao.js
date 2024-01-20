import * as api from 'api';

export const getLlamaResponse = (query) => async (dispatch) => {
  try {
    console.log(query);
    const { data } = await api.fetchLlamaResponse(query); 
    dispatch({ type: "FETCH_ALL", payload: data });
    return data;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

