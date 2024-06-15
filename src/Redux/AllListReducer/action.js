import { serverUrl } from "../../api";
import * as types from "./actionTypes";
import axios from "axios";

// partcipants ---------------------------

export const getAllParticipants = (page="", limit="")=>(dispatch) => {
  dispatch({ type: types.GET_PARTICIPANTS_REQUEST });
  return axios
    .get(`${serverUrl}/participant/all/?page=${page}&limit=${limit}`)
    .then((res) => {
      return dispatch({
        type: types.GET_PARTICIPANTS_SUCCESS,
        payload: res.data.message,
      });
    })
    .catch((err) => {
      console.log(err);
      return dispatch({ type: types.GET_PARTICIPANTS_FAILURE });
    });
};


// admins ---------------------------

export const getAllAdmins =(dispatch) => {
  dispatch({ type: types.GET_ADMIN_REQUEST });
  return axios
    .get(`${serverUrl}/auth/alluser`)
    .then((res) => {
      console.log(res);
      return dispatch({
        type: types.GET_ADMIN_SUCCESS,
        payload: res.data.message,
      });
    })
    .catch((err) => {
      console.log(err);
      return dispatch({ type: types.GET_ADMIN_FAILURE });
    });
};


// get partcicipants by name --------------------------

export const getParticipantsByName = (name)=>(dispatch) => {
  dispatch({ type: types.GET_PARTICIPANTS_REQUEST });
  return axios
    .get(`${serverUrl}/participant/name/?name=${name}`)
    .then((res) => {
      return dispatch({
        type: types.GET_PARTICIPANTS_SUCCESS,
        payload: res.data.message,
      });
    })
    .catch((err) => {
      console.log(err);
      return dispatch({ type: types.GET_PARTICIPANTS_FAILURE });
    });
};

// cohort -------

export const getAllCohorts = (dispatch) => {
  dispatch({ type: types.GET_COHORTS_REQUEST });
  return axios
    .get(`${serverUrl}/cohort/all`)
    .then((res) => {
      return dispatch({
        type: types.GET_COHORTS_SUCCESS,
        payload: res.data.message,
      });
    })
    .catch((err) => {
      console.log(err);
      return dispatch({ type: types.GET_COHORTS_FAILURE });
    });
};

// activity --------------------------

export const getAllActivities = (dispatch) => {
  dispatch({ type: types.GET_ACTIVITIES_REQUEST });
  return axios
    .get(`${serverUrl}/activity/all`)
    .then((res) => {
      return dispatch({
        type: types.GET_ACTIVITIES_SUCCESS,
        payload: res.data.message,
      });
    })
    .catch((err) => {
      console.log(err);
      return dispatch({ type: types.GET_ACTIVITIES_FAILURE });
    });
};

// domains --------------

export const getAllDomains =(category="All")=> (dispatch) => {
  dispatch({ type: types.GET_DOMAINS_REQUEST });
  return axios
    .get(`${serverUrl}/domain/all/?category=${category}`)
    .then((res) => {
      console.log(res)
      return dispatch({
        type: types.GET_DOMAINS_SUCCESS,
        payload: res.data.message,
      });
    })
    .catch((err) => {
      console.log(err);
      return dispatch({ type: types.GET_DOMAINS_FAILURE });
    });
};

// sessions ----------------------

export const getAllSessions = (dispatch) => {
  dispatch({ type: types.GET_SESSIONS_REQUEST });
  return axios
    .get(`${serverUrl}/session/all`)
    .then((res) => {
      return dispatch({
        type: types.GET_SESSIONS_SUCCESS,
        payload: res.data.message,
      });
    })
    .catch((err) => {
      console.log(err);
      return dispatch({ type: types.GET_DOMAINS_FAILURE });
    });
};

// evaluation----------------------

export const getAllEvaluations = (dispatch) => {
  dispatch({ type: types.GET_EVALUATIONS_REQUEST });
  return axios
    .get(`${serverUrl}/evaluation/all`)
    .then((res) => {
      return dispatch({
        type: types.GET_EVALUATIONS_SUCCESS,
        payload: res.data.message,
      });
    })
    .catch((err) => {
      console.log(err);
      return dispatch({ type: types.GET_EVALUATIONS_FAILURE });
    });
};
