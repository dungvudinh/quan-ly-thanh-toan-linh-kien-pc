import { legacy_createStore as createStore, combineReducers } from "redux";
import themeReducer from "./reducers/themeReducers";
import tabReducer from "./reducers/tabReducers";
import modelsReducer from "./reducers/modelReducer";
import clientInvoiceReducer from "./reducers/clientInvoiceReducers";
import clientPricesReducer from "./reducers/clientPriceReducers";
import freelancerPricesReducer from "./reducers/freelancerPriceReducers";
import freelancerInvoiceReducer from "./reducers/freelancerInvoiceReducers";
const rootReducer = combineReducers({
    theme:themeReducer,
    tab:tabReducer,
    models:modelsReducer,
    clientInvoice:clientInvoiceReducer,
    clientPrices:clientPricesReducer,
    freelancerPrices:freelancerPricesReducer,
    freelancerInvoice:freelancerInvoiceReducer
})
const store = createStore(rootReducer);
export default store;