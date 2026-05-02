import * as action from "./actionTypes";
import axios from "axios";

const BASE_URL = "https://suela-caramelo-app-back-end.vercel.app/sc";
// const BASE_URL = "http://localhost:3000/sc";

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
      let json = await axios.get(`${BASE_URL}/notices/${id}`);
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
      let json = await axios.get(`${BASE_URL}/teams`);
      
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
export function getAllPlayers(category) {
  return async function (dispatch) {
    try {
      let json = await axios.get(`${BASE_URL}/players`);

      if (!category) {
        const filters = json.data.filter((cat) => cat.category === "A1");
        dispatch({
          type: action.GET_ALL_PLAYERS,
          payload: {
            filtered: filters.length > 0 ? filters : json.data,
            copy: json.data,
          },
        });
      } else {
        const filters = json.data.filter((cat) => cat.category === category);
        dispatch({
          type: action.GET_ALL_PLAYERS,
          payload: {
            filtered: filters.length > 0 ? filters : json.data,
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
      let json = await axios.get(`${BASE_URL}/matchs`);

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
    console.log(category);

    try {
      let json = await axios.get(`${BASE_URL}/notices?category=${category}`);

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
      const { data } = await axios.get(
        `${BASE_URL}/fixtures?category=${category}`
      );
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
      const { data } = await axios.get(
        `${BASE_URL}/positions?category=${category}`
      );
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
export function getGeneralPositions(category) {
  return async function (dispatch) {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/positions/general?category=${category}`
      );
      console.log(data);
      dispatch({
        type: action.GET_GENERAL_POSITIONS,
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
      let json = await axios.post(`${BASE_URL}/notices`, notice);
      console.log();
      dispatch({
        type: action.CREATE_NOTICE,
        payload: json.data,
      });

      return alert("Noticia creada correctamente");
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
        // teams: [payload.local, payload.visitor],
      };
      let json = await axios.post(`${BASE_URL}/matchs`, data);
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
      let json = await axios.post(`${BASE_URL}/teams`, payload);
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
export function createPlayer(payload) {
  return async function (dispatch) {
    try {
      let json = await axios.post(`${BASE_URL}/players`, payload);
      dispatch({
        type: action.CREATE_PLAYER,
        payload: json.data,
      });

      return "Success";
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}
export function updateTeam(team) {
  return async function (dispatch) {
    try {
      let json = await axios.put(`${BASE_URL}/teams/${team.id}`, team);
      dispatch({
        type: action.UPDATE_TEAM,
        payload: json.data,
      });

      return "Success";
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}
export function updatePlayer(player) {
  return async function (dispatch) {
    try {
      let json = await axios.put(`${BASE_URL}/players/${player.id}`, player);
      dispatch({
        type: action.UPDATE_PLAYER,
        payload: json.data,
      });

      return "Success";
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}
export function deleteTeam(id) {
  return async function (dispatch) {
    try {
      let json = await axios.delete(`${BASE_URL}/teams/${id}`);
      dispatch({
        type: action.DELETE_TEAM,
      });

      return "Success";
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}
export function deletePlayer(id) {
  return async function (dispatch) {
    try {
      let json = await axios.delete(`${BASE_URL}/players/${id}`);
      dispatch({
        type: action.DELETE_PLAYER,
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
      let json = await axios.post(`${BASE_URL}/fixtures`, payload);

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
export function createGeneralPosition(payload) {
  return async function (dispatch) {
    try {
      let json = await axios.post(`${BASE_URL}/positions/general`, payload);

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
      let json = await axios.post(`${BASE_URL}/positions`, payload);

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
export function deleteNotice(id) {
  return async function (dispatch) {
    try {
      let json = await axios.delete(`${BASE_URL}/notices/${id}`);

      dispatch({
        type: action.DELETE_NOTICE,
      });

      return "Success";
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}
export function createPlayersByExcel(teamsObject) {
  return async function (dispatch) {
    try {
      let json = await axios.post(`${BASE_URL}/players`, teamsObject);

      dispatch({
        type: action.CREATE_MANY_TEAMS_BY_EXCEL,
        payload: json.data,
      });

      return alert("Jugadores creados correctamente.");
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}
export function createManyTeamsByExcel(teamsObject) {
  return async function (dispatch) {
    try {
      let json = await axios.post(
        `${BASE_URL}/teams/create-many?category=A1`,
        teamsObject
      );

      dispatch({
        type: action.CREATE_MANY_TEAMS_BY_EXCEL,
        payload: json.data,
      });

      return alert("Equipos creados correctamente.");
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}

//----------- SPONSORS & COUPONS ------------------
// Get all sponsors
export function getAllSponsors() {
  return async function (dispatch) {
    try {
      let json = await axios.get(`${BASE_URL}/sponsors`);

      dispatch({
        type: action.GET_ALL_SPONSORS,
        payload: json.data,
      });

      return "Success";
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}

// Create a new sponsor
export function createSponsor(sponsor) {
  return async function (dispatch) {
    try {
      let json = await axios.post(`${BASE_URL}/sponsors`, sponsor);

      dispatch({
        type: action.CREATE_SPONSOR,
        payload: json.data,
      });

      return alert("Sponsor creado correctamente");
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}

// Delete a sponsor
export function deleteSponsor(id) {
  return async function (dispatch) {
    try {
      let json = await axios.delete(`${BASE_URL}/sponsors/${id}`);

      dispatch({
        type: action.DELETE_SPONSOR,
      });

      return "Success";
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}

// Update a sponsor
export function updateSponsor(sponsor) {
  return async function (dispatch) {
    try {
      let json = await axios.put(`${BASE_URL}/sponsors/${sponsor.id}`, sponsor);

      dispatch({
        type: action.UPDATE_SPONSOR,
        payload: json.data,
      });

      return alert("Sponsor actualizado correctamente");
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}

// Get all coupons
export function getAllCoupons() {
  return async function (dispatch) {
    try {
      let json = await axios.get(`${BASE_URL}/coupons`);

      dispatch({
        type: action.GET_ALL_COUPONS,
        payload: json.data,
      });

      return "Success";
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}

// Create a new coupon
export function createCoupon(coupon) {
  return async function (dispatch) {
    try {
      let json = await axios.post(`${BASE_URL}/coupons`, coupon);

      dispatch({
        type: action.CREATE_COUPON,
        payload: json.data,
      });

      return alert("Cupón creado correctamente");
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}

// Delete a coupon
export function deleteCoupon(id) {
  return async function (dispatch) {
    try {
      let json = await axios.delete(`${BASE_URL}/coupons/${id}`);

      dispatch({
        type: action.DELETE_COUPON,
      });

      return "Success";
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}

// Update a coupon
export function updateCoupon(coupon) {
  return async function (dispatch) {
    try {
      let json = await axios.put(`${BASE_URL}/coupons/${coupon.id}`, coupon);

      dispatch({
        type: action.UPDATE_COUPON,
        payload: json.data,
      });

      return alert("Cupón actualizado correctamente");
    } catch (error) {
      return "Server Error, try again later", console.log(error);
    }
  };
}
