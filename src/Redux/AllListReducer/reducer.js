import * as types from "./actionTypes";

const initialState = {
  cohortList: [],
  partcipantList: [],
  evalutionlist: [],
  sessionlist: [],
  domainList: [],
  activityList: [],
  adminList: [],
};

export const AllListReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    // participants -----------------------------

    case types.GET_PARTICIPANTS_REQUEST:
      return {
        ...state,
        partcipantList: [],
      };

    case types.GET_PARTICIPANTS_SUCCESS:
      return {
        ...state,
        partcipantList: payload,
      };

    case types.GET_PARTICIPANTS_FAILURE:
      return {
        ...state,

        partcipantList: [],
      };

    // admins -----------------------------

    case types.GET_ADMIN_REQUEST:
      return {
        ...state,
        adminList: [],
      };

    case types.GET_ADMIN_SUCCESS:
      return {
        ...state,
        adminList: payload,
      };

    case types.GET_ADMIN_FAILURE:
      return {
        ...state,
        adminList: [],
      };

    // cohorts----------------------------

    case types.GET_COHORTS_REQUEST:
      return {
        ...state,
        cohortList: [],
      };

    case types.GET_COHORTS_SUCCESS:
      return {
        ...state,
        cohortList: payload,
      };

    case types.GET_COHORTS_FAILURE:
      return {
        ...state,
        cohortList: [],
      };

    // sessions --------------------------------

    case types.GET_SESSIONS_REQUEST:
      return {
        ...state,
        sessionlist: [],
      };

    case types.GET_SESSIONS_SUCCESS:
      return {
        ...state,
        sessionlist: payload,
      };

    case types.GET_SESSIONS_FAILURE:
      return {
        ...state,
        sessionlist: [],
      };

    // domains--------------------------

    case types.GET_DOMAINS_REQUEST:
      return {
        ...state,
        domainList: [],
      };

    case types.GET_DOMAINS_SUCCESS:
      return {
        ...state,
        domainList: payload,
      };

    case types.GET_DOMAINS_FAILURE:
      return {
        ...state,
        domainList: [],
      };

    // activities----------------------

    case types.GET_ACTIVITIES_FAILURE:
      return {
        ...state,
        activityList: [],
      };

    case types.GET_ACTIVITIES_SUCCESS:
      return {
        ...state,
        activityList: payload,
      };

    case types.GET_ACTIVITIES_FAILURE:
      return {
        ...state,
        activityList: [],
      };

    // evaluations------------------------------
    case types.GET_EVALUATIONS_REQUEST:
      return {
        ...state,
        evalutionlist: [],
      };

    case types.GET_EVALUATIONS_SUCCESS:
      return {
        ...state,
        evalutionlist: payload,
      };

    case types.GET_EVALUATIONS_FAILURE:
      return {
        ...state,
        evalutionlist: [],
      };

    default:
      return state;
  }
};
