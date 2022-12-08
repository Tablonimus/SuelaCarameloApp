import * as action from "../actions/actionTypes";
import axios from "axios";

const url = "http://localhost:3001";




export function postImage(archivo) {
  return async function (dispatch) {
    try {
      let json = await axios.post(
        `https://happytails2.herokuapp.com/home/images`,
        archivo
      );
      return dispatch({
        type: action.POST_IMAGE,
        payload: json.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}
//------------GET ALL------------
export function getAllNotices() {
  return async function (dispatch) {
    try {
      let json = await axios.get(`${url}/notices`);
      dispatch({
        type: action.GET_ALL_NOTICES,
        payload: json.data,
      });

      return "Success";
    } catch (error) {
      return "Server Error, try again later";
    }
  };
}
export function createNotice(payload) {
  return async function (dispatch) {
    try {
      let json = await axios.post(`${url}/notices`, payload);
      dispatch({
        type: action.CREATE_NOTICE,
        payload: json.data,
      });

      return "Success";
    } catch (error) {
      return "Server Error, try again later";
    }
  };
}
