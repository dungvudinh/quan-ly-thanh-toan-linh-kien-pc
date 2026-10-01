import { ADD_MODEL, SET_MODELS,UPDATE_MODEL_PAID } from "../actionTypes";

export const setModels = (models)=>({type:SET_MODELS,payload:models})
export const updateModelPaid = (modelId, audience)=>({type:UPDATE_MODEL_PAID,payload:{modelId, audience}})
export const addModel = (newModel)=>({type:ADD_MODEL, payload:newModel})