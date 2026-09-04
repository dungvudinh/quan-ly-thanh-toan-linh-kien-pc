import { UPDATE_FREELANCER_PRICE } from "../actionTypes";
import { initialFreelancerPrices } from "../../data/mockData";
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
    
    default:
      return state;
  }
};