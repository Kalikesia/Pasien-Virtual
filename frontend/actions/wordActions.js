import{
    DATABASE_DISPLAY_REQUEST,
    DATABASE_DISPLAY_SUCCESS,
    DATABASE_DISPLAY_FAIL
} from "../constants/wordConstants"
import axios from "axios"

export const listWord = (filter) => async (dispatch, getState) => {
    try {
      dispatch({
        type: DATABASE_DISPLAY_REQUEST,
      });
  
      const { data } = await axios.get(`/api/word/displayDB`);
      dispatch({
        type: DATABASE_DISPLAY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({
        type: DATABASE_DISPLAY_FAIL,
        payload: message,
      });
    }
  };