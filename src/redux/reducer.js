import * as action from "../redux/actions/actionTypes";
import moment from "moment";

const initialState = {
  allNotices: [],
  noticeDetail: [],
  teams: [],
  category: "",

  copyAllNotices: [],
};

export default function rootReducer(state = initialState, { type, payload }) {
  switch (type) {
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
        allNotices: payload,
        copyAllNotices: payload,
      };
    }
    case action.CREATE_NOTICE: {
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
