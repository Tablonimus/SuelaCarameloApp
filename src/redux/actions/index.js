import * as action from "../actions/actionTypes";
import axios from "axios";
import { useSelector } from "react-redux";

// const url = "https://suelacarameloapp-backend-production.up.railway.app";

// const url = "https://suelacaramelobackend-production.up.railway.app";//USADA CON RAILWAY
const url ="https://suela-caramelo-app-back-end.vercel.app"
// const url = "http://localhost:3001";

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

//------------GET ALL------------TODO LOS FILTROS AL BACK CAMPEON---------------
export function getAllTeams(category) {
  return async function (dispatch) {
    try {
      let json = await axios.get(`${url}/teams`);

      if (!category) {
        const filters = json.data.filter((cat) => cat.category === "A1");
        dispatch({
          type: action.GET_ALL_TEAMS,
          payload: {
            filtered:
              filters.length > 0
                ? filters.sort((a, b) => {
                    return a.id - b.id;
                  })
                : json.data.sort((a, b) => {
                    return a.id - b.id;
                  }),
            copy: json.data,
          },
        });
      } else {
        const filters = json.data.filter((cat) => cat.category === category);
        dispatch({
          type: action.GET_ALL_TEAMS,
          payload: {
            filtered:
              filters.length > 0
                ? filters.sort((a, b) => {
                    return a.id - b.id;
                  })
                : json.data.sort((a, b) => {
                    return a.id - b.id;
                  }),
            copy: json.data,
          },
        });
      }

      return "Success";
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}
export function getAllMatches(category) {
  return async function (dispatch) {
    try {
      let json = await axios.get(`${url}/matchs`);

      if (!category) {
        const filters = json.data.filter((cat) => cat.category === "A1");
        dispatch({
          type: action.GET_ALL_MATCHES,
          payload: {
            filtered:
              filters.length > 0 ? filters.reverse() : json.data.reverse(),
            copy: json.data,
          },
        });
      } else {
        const filters = json.data.filter((cat) => cat.category === category);
        
        dispatch({
          type: action.GET_ALL_MATCHES,
          payload: {
            filtered:
              filters.length > 0 ? filters.reverse() : json.data.reverse(),
            copy: json.data,
          },
        });
      }

      return "Success";
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}
export function getAllNotices(category) {
  return async function (dispatch) {
    try {
      let json = await axios.get(`${url}/notices`);

      if (!category) {
        const filters = json.data.filter((cat) => cat.category === "A1");
        dispatch({
          type: action.GET_ALL_NOTICES,
          payload: {
            filtered:
              filters.length > 0 ? filters.reverse() : json.data.reverse(),
            copy: json.data,
          },
        });
      } else {
        const filters = json.data.filter((cat) => cat.category === category);
        dispatch({
          type: action.GET_ALL_NOTICES,
          payload: {
            filtered:
              filters.length > 0 ? filters.reverse() : json.data.reverse(),
            copy: json.data,
          },
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
      const data = {
        title: payload.title,
        subtitle: payload.subtitle,
        images: payload.images,
        videos: payload.videos,
        content: payload.content,
        category: payload.category,
        teams: [payload.team1, payload.team2],
      };
      console.log("DATATATATAT", data);
      let json = await axios.post(`${url}/notices`, data);
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
export function createMatch(payload) {
  return async function (dispatch) {
    try {
      const data = {
        place: payload.place,
        date: payload.date,
        time: payload.time,
        local: payload.local,
        visitor: payload.visitor,
        category: payload.category,
        teams: [payload.local, payload.visitor],
      };
      let json = await axios.post(`${url}/matchs`, data);
      dispatch({
        type: action.CREATE_MATCH,
        payload: json.data,
      });

      return "Success";
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}
export function createTeam(payload) {
  return async function (dispatch) {
    try {
      let json = await axios.post(`${url}/teams`, payload);
      dispatch({
        type: action.CREATE_TEAM,
        payload: json.data,
      });

      return "Success";
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}
