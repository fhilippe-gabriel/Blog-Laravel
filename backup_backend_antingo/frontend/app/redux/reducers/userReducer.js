import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from '../constants/notifConstants'
import {
    CREATE_USER,
    INIT_CREATE_USER,
    CREATE_USER_SUCCESS,
    UPDATE_USER_SUCCESS,
    SET_USER,
    SET_USERS,
    REMOVE_USER_SUCCESS
} from '../constants/userConstants';

const userState = {
    data: [],
    notifMsg: "",
    user: null,
}


const setUser = (state, action) => {
    return updateObject(state, {
        user: {
            ...action.payload.user,
        }
    });
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export default function userReducer(state = userState, action) {
    switch (action.type) {
        case INIT_CREATE_USER:
            return {
                ...state,
                user: null,
            }
        case CREATE_USER_SUCCESS:
            return {
                ...state,
                notifMsg: notif.saved,
                user: null,
            }
        case CREATE_USER: return updateObject(state, { user: null })
        case SET_USER: return setUser(state, action);
        case REMOVE_USER_SUCCESS:
            const id = action.id
            return {
                ...state,
                notifMsg: notif.removed,
                data: state.data.filter((data) => data.id !== id)
            }
        case UPDATE_USER_SUCCESS:
            return {
                ...state,
                notifMsg: action.payload.message,
            }
        case SET_USERS:
            return {
                ...state,
                ...action.payload,
            }
        case CLOSE_NOTIF:
            return {
                ...state,
                notifMsg: '',
            }
        default:
            return state;
    }
}
