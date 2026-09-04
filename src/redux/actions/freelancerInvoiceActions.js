import { ADD_TO_FREELANCER_INVOICE, REMOVE_FROM_FREELANCER_INVOICE, CLEAR_FREELANCER_INVOICE } from "../actionTypes";
export const addToFreelancerInvoice = (modelId) => ({ type: ADD_TO_FREELANCER_INVOICE, payload: modelId });
export const removeFromFreelancerInvoice = (modelId) => ({ type: REMOVE_FROM_FREELANCER_INVOICE, payload: modelId });
export const clearFreelancerInvoice = () => ({ type: CLEAR_FREELANCER_INVOICE });