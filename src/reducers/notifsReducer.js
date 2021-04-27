// Import all actions
import * as actions from '../actions/notifsActions'

export const initialState = {
    notifData: {}
}

export default function notifsReducer(state = initialState, action) {
    switch (action.type) {
        case actions.SET_NOTIF_SUCCESS:
            return { ...state, notifData: action.payload }
        default:
            return state
    }
}