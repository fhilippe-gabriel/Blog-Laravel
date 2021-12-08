import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from '../constants/notifConstants'
import {
    CREATE_EXAME,
    INIT_CREATE_EXAME,
    CREATE_EXAME_SUCCESS,
    UPDATE_EXAME_SUCCESS,
    SET_EXAME,
    SET_EXAMES,
    REMOVE_EXAME_SUCCESS
} from '../constants/exameConstants';

const exameState = {
    data: [],
    notifMsg: "",
    exame: null,
}

const setExame = (state, action) => {
    return updateObject(state, {
        exame: {
            ...action.payload.exame,
        }
    });
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export default function exameReducer(state = exameState, action) {
    switch (action.type) {
        case INIT_CREATE_EXAME:
            return {
                ...state,
                exame: null,
            }
        case CREATE_EXAME_SUCCESS:
            return {
                ...state,
                notifMsg: notif.saved,
                exame: null,
            }
        case CREATE_EXAME: return updateObject(state, { exame: null })
        case SET_EXAME: return setExame(state, action);
        case REMOVE_EXAME_SUCCESS:
            const id = action.id
            return {
                ...state,
                notifMsg: notif.removed,
                data: state.data.filter((data) => data.id !== id)
            }
        case UPDATE_EXAME_SUCCESS:
            return {
                ...state,
                notifMsg: action.payload.message,
            }
        case SET_EXAMES:
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
