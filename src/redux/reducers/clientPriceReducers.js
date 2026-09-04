import { UPDATE_CLIENT_PRICE } from "../actionTypes";
import { initialClientPrices } from "../../data/mockData";
export default function clientPricesReducer(state = initialClientPrices, action) {
  switch (action.type) {
    case UPDATE_CLIENT_PRICE: {
      const { type, field, value } = action.payload;
      return {
        ...state,
        [type]: {
          ...state[type],
          [field]: value,
        },
      };
    }
    
    default:
      return state;
  }
};