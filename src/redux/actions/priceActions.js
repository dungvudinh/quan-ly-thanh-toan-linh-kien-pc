import { UPDATE_CLIENT_PRICE, UPDATE_FREELANCER_PRICE,ADD_CLIENT_ROW,DELETE_CLIENT_ROW,ADD_FREELANCER_ROW,DELETE_FREELANCER_ROW } from "../actionTypes";
export const updateClientPrice = (type, field, value) => ({
  type: UPDATE_CLIENT_PRICE,
  payload: { type, field, value: Number(value) || 0 },
});

export const updateFreelancerPrice = (type, field, value) => ({
  type: UPDATE_FREELANCER_PRICE,
  payload: { type, field, value: Number(value) || 0 },
});
export const addClientRow = (newType) => ({
  type: ADD_CLIENT_ROW,
  payload: { newType }
});

export const deleteClientRow = (type) => ({
  type: DELETE_CLIENT_ROW,
  payload: { type }
});

export const addFreelancerRow = (newType) => ({
  type: ADD_FREELANCER_ROW,
  payload: { newType }
});

export const deleteFreelancerRow = (type) => ({
  type: DELETE_FREELANCER_ROW,
  payload: { type }
});