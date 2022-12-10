import * as action from "../actions/actionTypes";
import axios from "axios";
import { useSelector } from "react-redux";

const url = "https://suelacarameloapp-backend-production.up.railway.app";
/*const url = "http://localhost:3001"; */

export function clearPage() {
  return async function (dispatch) {
    try {
      dispatch({
        type: action.CLEAR_STATE,
      });

      return "Success";
    } catch (error) {
      return "Server Error, try again later";
    }
  };
}
export function getNoticeDetail(id) {
  return async function (dispatch) {
    try {
      let json = await axios.get(`${url}/notices/${id}`);
      dispatch({
        type: action.GET_NOTICE_DETAIL,
        payload: json.data,
      });

      return "Success";
    } catch (error) {
      return "Server Error, try again later";
    }
  };
}

//----------CATEGORY------------
export function changeCategory(category) {
  return async function (dispatch) {
    try {
      // let json = await axios.get(`${url}/notices`);
      dispatch({
        type: action.CHANGE_CATEGORY,
        payload: category,
      });

      return "Success";
    } catch (error) {
      return "Server Error, try again later";
    }
  };
}

//------------GET ALL------------
export function getAllNotices(category) {
  return async function (dispatch) {
    try {
      let json = await axios.get(`${url}/notices`);

      if (!category) {
        const filters = json.data.filter((cat) => cat.category === "A1");

        dispatch({
          type: action.GET_ALL_NOTICES,
          payload: filters.length > 0 ? filters.reverse() : json.data.reverse(),
        });
      } else {
        const filters = json.data.filter((cat) => cat.category === category);

        dispatch({
          type: action.GET_ALL_NOTICES,
          payload: filters.length > 0 ? filters : json.data,
        });
      }

      return "Success";
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}

//-----------CREATE------------------
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
      return "Server Error, try again later", console.log(error);
    }
  };
}
