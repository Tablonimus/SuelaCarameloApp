import * as action from "./actionTypes";
import axios from "axios";


const url = "https://suela-caramelo-app-back-end.vercel.app/sc";
// 


// const url = "http://localhost:3000/sc";

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
      // let notice = notices.find((notice) => notice.id == id);

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
  
      let json = await axios.get(`${url}/notices?category=${category}`);

      dispatch({
        type: action.GET_ALL_NOTICES,
        payload: {
          filtered: json.data,
          copy: json.data,
        },
      });
      return "Success";
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}
export function getFixtures(category) {
  return async function (dispatch) {
    try {
      const { data } = await axios.get(`${url}/fixtures?category=${category}`);
      const { activeNumber, fixtures } = data;

      fixtures.sort((a, b) => (a.number > b.number ? 1 : -1));
      dispatch({
        type: action.GET_FIXTURES,
        payload: { activeNumber, fixtures },
      });

      return "Success";
    } catch (error) {
      console.log(error);
      return "Server Error, try again later";
    }
  };
}
export function getPositions(category) {
  return async function (dispatch) {
    try {
      const { data } = await axios.get(`${url}/positions?category=${category}`);
      console.log(data);
      dispatch({
        type: action.GET_POSITIONS,
        payload: data,
      });

      return "Success";
    } catch (error) {
      console.log(error);
      return "Server Error, try again later";
    }
  };
}

//-----------CREATE------------------
export function createNotice(notice) {
  return async function (dispatch) {
    try {
      let json = await axios.post(`${url}/notices`, notice);
      console.log();
      dispatch({
        type: action.CREATE_NOTICE,
        payload: json.data,
      });

      return alert("Noticia creada correctamente")
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
export function createFixture(payload) {
  return async function (dispatch) {
    try {
      let json = await axios.post(`${url}/fixtures`, payload);

      dispatch({
        type: action.CREATE_FIXTURE,
        payload: json.data,
      });

      return "Success";
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}
export function createPosition(payload) {
  return async function (dispatch) {
    try {
      let json = await axios.post(`${url}/positions`, payload);

      dispatch({
        type: action.CREATE_FIXTURE,
        payload: json.data,
      });

      return "Success";
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}
