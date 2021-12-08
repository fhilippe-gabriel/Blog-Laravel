import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from '../constants/notifConstants'
import {
    CREATE_JORNADA,
    INIT_CREATE_JORNADA,
    CREATE_JORNADA_SUCCESS,
    UPDATE_JORNADA_SUCCESS,
    SET_JORNADA,
    SET_JORNADAS,
    REMOVE_JORNADA_SUCCESS
} from '../constants/jornadaConstants';

const jornadaState = {
    data: [],
    notifMsg: "",
    jornada: null,
}

const setJornada = (state, action) => {
    return updateObject(state, {
        jornada: {
            ...action.payload.jornada,
        }
    });
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export default function jornadaReducer(state = jornadaState, action) {
    switch (action.type) {
        case INIT_CREATE_JORNADA:
            return {
                ...state,
                jornada: null,
            }
        case CREATE_JORNADA_SUCCESS:
            return {
                ...state,
                notifMsg: notif.saved,
                jornada: null,
            }
        case CREATE_JORNADA: return updateObject(state, { jornada: null })
        case SET_JORNADA: return setJornada(state, action);
        case REMOVE_JORNADA_SUCCESS:
            const id = action.id
            return {
                ...state,
                notifMsg: notif.removed,
                data: state.data.filter((data) => data.id !== id)
            }
        case UPDATE_JORNADA_SUCCESS:
            return {
                ...state,
                notifMsg: action.payload.message,
            }
        case SET_JORNADAS:
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
