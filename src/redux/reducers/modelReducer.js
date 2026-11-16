import { ADD_MODEL, SET_MODELS, UPDATE_MODEL_PAID } from "../actionTypes";
export default function modelsReducer(state = [], action) {
  switch (action.type) {
    case SET_MODELS:
      return action.payload;
    
    case UPDATE_MODEL_PAID: {
      const { modelIds, audience } = action.payload;
      const paidField = audience === 'client' ? 'clientPaid' : 'freelancerPaid';
      
      return state.map((model) =>
        modelIds.includes(model.id)
          ? { ...model, [paidField]: true }
          : model
      );
    }
    case ADD_MODEL:{
      const newModel = action.payload;
      const maxId = state.reduce((max, m) => Math.max(max, m.id), 0);
      return [...state, { ...newModel, id: maxId + 1 }];
    }
    default:
      return state;
  }
};
