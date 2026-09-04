import { ADD_TO_CLIENT_INVOICE, REMOVE_FROM_CLIENT_INVOICE,CLEAR_CLIENT_INVOICE } from "../actionTypes";
export const addToClientInvoice = (modelId)=>({type:ADD_TO_CLIENT_INVOICE,payload:modelId})
export const removeFromClientInvoice = (modelId)=>({type:REMOVE_FROM_CLIENT_INVOICE,payload:modelId})
export const clearClientInvoice = ()=>({type:CLEAR_CLIENT_INVOICE})