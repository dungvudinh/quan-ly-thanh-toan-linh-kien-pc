import { ADD_TO_FREELANCER_INVOICE, REMOVE_FROM_FREELANCER_INVOICE, CLEAR_FREELANCER_INVOICE } from "../actionTypes";
const initialState = {
  ids: []
};
export default function freelancerInvoiceReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_FREELANCER_INVOICE:
      return state.ids.includes(action.payload) ? state : { ...state, ids: [...state.ids, action.payload] };
    
    case REMOVE_FROM_FREELANCER_INVOICE:
      return { ...state, ids: state.ids.filter((id) => id !== action.payload) };
    
    case CLEAR_FREELANCER_INVOICE:
      return { ...state, ids: [] };
    
    default:
      return state;
  }
};