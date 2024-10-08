import * as action from "../redux/actions/actionTypes";

const initialState = {
  allNotices: [],
  activeNumber: 1,
  positions: {},
  generalPositions: {},
  copyAllNotices: [],
  noticeDetail: [],
  fixtures: [],
  allMatches: [],
  category: "",
};

export default function rootReducer(state = initialState, { type, payload }) {
  switch (type) {
    case action.CREATE_MANY_TEAMS_BY_EXCEL: {
      return {
        ...state,
      };
    }
    case action.DELETE_NOTICE: {
      return {
        ...state,
      };
    }
    case action.COPY_ALL: {
      return {
        ...state,
        copyAllNotices: payload,
      };
    }
    case action.GET_NOTICE_DETAIL: {
      return {
        ...state,
        noticeDetail: payload,
      };
    }
    case action.CHANGE_CATEGORY: {
      return {
        ...state,
        category: payload,
      };
    }
    case action.POST_IMAGE: {
      return {
        ...state,
      };
    }
    case action.GET_ALL_NOTICES: {
      return {
        ...state,
        allNotices: payload.filtered,
        copyAllNotices: payload.copy,
      };
    }
    case action.GET_ALL_TEAMS: {
      return {
        ...state,
        allTeams: payload.filtered,
      };
    }
    case action.GET_ALL_MATCHES: {
      return {
        ...state,
        allMatches: payload.filtered,
      };
    }
    case action.GET_FIXTURES: {
      return {
        ...state,
        fixtures: payload.fixtures,
        activeNumber: payload.activeNumber,
      };
    }
    case action.GET_GENERAL_POSITIONS: {
      return {
        ...state,
        generalPositions: payload,
      };
    }
    case action.GET_POSITIONS: {
      return {
        ...state,
        positions: payload,
      };
    }
    case action.CREATE_FIXTURE: {
      return {
        ...state,
      };
    }
    case action.CREATE_NOTICE: {
      return {
        ...state,
      };
    }
    case action.CREATE_MATCH: {
      return {
        ...state,
      };
    }
    case action.CREATE_TEAM: {
      return {
        ...state,
      };
    }
    case action.CLEAR_STATE: {
      return {
        ...state,
        noticeDetail: [],
      };
    }

    default:
      return state;
  }
}
