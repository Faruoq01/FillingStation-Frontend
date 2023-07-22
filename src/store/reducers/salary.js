import { SALARY, SEARCH_SALARY, LOGOUT } from "../types";

const initialState = {
  salary: [],
  searchData: [],
};

const salaryReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SALARY: {
      return {
        ...state,
        salary: payload,
        searchData: payload,
      };
    }

    case SEARCH_SALARY: {
      const search = state.searchData.filter(
        (data) =>
          !data.position.toUpperCase().indexOf(payload.toUpperCase()) ||
          !data.level.toUpperCase().indexOf(payload.toUpperCase())
      );
      return {
        ...state,
        salary: search,
      };
    }

    case LOGOUT: {
      return {
        ...state,
        salary: [],
        searchData: [],
      };
    }

    default: {
      return state;
    }
  }
};

export default salaryReducer;
