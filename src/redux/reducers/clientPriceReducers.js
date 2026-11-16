import { UPDATE_CLIENT_PRICE,ADD_CLIENT_ROW,DELETE_CLIENT_ROW} from "../actionTypes";
import { SET_CLIENT_PRICES } from "../actionTypes";

const createDefaultClientRow = () => ({
  new: 0,
  similar1: 0,
  newModular: 0,
  bonus: 0,
  modularSimilar: 0
});

export default function clientPricesReducer(state = {}, action) {
  switch (action.type) {
    case SET_CLIENT_PRICES: return action.payload;
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
    case ADD_CLIENT_ROW: {
      const { newType } = action.payload;
      // Kiểm tra tránh trùng type
      if (state[newType]) return state;
      return {
        ...state,
        [newType]: createDefaultClientRow()
      };
    }
    case DELETE_CLIENT_ROW: {
      const { type } = action.payload;
      const newState = { ...state };
      delete newState[type];
      return newState;
    }
    default:
      return state;
  }
};
