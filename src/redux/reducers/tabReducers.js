import { SET_ACTIVE_TAB } from "../actionTypes";
const initState = {
    activeTab:localStorage.getItem('activeTab') || 'client-invoice'
}
export default function tabReducer(state = initState, action)
{
    switch(action.type)
    {
        case SET_ACTIVE_TAB:
            localStorage.setItem('activeTab', action.payload)
            return {...state, activeTab:action.payload}
        default:
            return state
    }
}