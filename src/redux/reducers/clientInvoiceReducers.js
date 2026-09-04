import { ADD_TO_CLIENT_INVOICE,REMOVE_FROM_CLIENT_INVOICE,CLEAR_CLIENT_INVOICE } from "../actionTypes";
const initialState = {
  ids:[]
}
export default function clientInvoiceReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CLIENT_INVOICE:
      return state.ids.includes(action.payload) ? state : { ...state, ids: [...state.ids, action.payload] };
    
    case REMOVE_FROM_CLIENT_INVOICE:
      return { ...state, ids: state.ids.filter((id) => id !== action.payload) };

    case CLEAR_CLIENT_INVOICE:
      return { ...state, ids: [] };
    
    default:
      return state;
  }
};