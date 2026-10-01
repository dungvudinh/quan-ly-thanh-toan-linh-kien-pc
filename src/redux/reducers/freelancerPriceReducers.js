import { UPDATE_FREELANCER_PRICE,ADD_FREELANCER_ROW,DELETE_FREELANCER_ROW } from "../actionTypes";
import { initialFreelancerPrices } from "../../data/mockData";

const createDefaultFreelancerRow = () => ({
  price: 0,
  bonus: 0,
  similar1: 0,
  similar2: 0
});
export default function freelancerPricesReducer(state = initialFreelancerPrices, action) {
  switch (action.type) {
    case UPDATE_FREELANCER_PRICE: {
      const { type, field, value } = action.payload;
      return {
        ...state,
        [type]: {
          ...state[type],
          [field]: value,
        },
      };
    }
    case ADD_FREELANCER_ROW: {
      const { newType } = action.payload;
      if (state[newType]) return state;
      return {
        ...state,
        [newType]: createDefaultFreelancerRow()
      };
    }
    case DELETE_FREELANCER_ROW: {
      const { type } = action.payload;
      const newState = { ...state };
      delete newState[type];
      return newState;
    }
    default:
      return state;
  }
};