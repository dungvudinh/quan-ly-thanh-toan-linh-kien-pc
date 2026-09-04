import { SET_THEME } from "../actionTypes";
const initState = {
    theme:localStorage.getItem('theme') || 'light'
}
export default function themeReducer(state = initState, action)
{
    switch(action.type)
    {
        case SET_THEME:
            localStorage.setItem('theme', action.payload)
            return {...state, theme:action.payload}
        default:
            return state
    }
}