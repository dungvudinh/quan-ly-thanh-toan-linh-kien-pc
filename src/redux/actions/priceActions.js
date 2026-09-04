import { UPDATE_CLIENT_PRICE, UPDATE_FREELANCER_PRICE } from "../actionTypes";
export const updateClientPrice = (type, field, value) => ({
  type: UPDATE_CLIENT_PRICE,
  payload: { type, field, value: Number(value) || 0 },
});

export const updateFreelancerPrice = (type, field, value) => ({
  type: UPDATE_FREELANCER_PRICE,
  payload: { type, field, value: Number(value) || 0 },
});