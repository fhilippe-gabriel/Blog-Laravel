import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from '../constants/notifConstants'
import {
    CREATE_TIPORECURSO,
    INIT_CREATE_TIPORECURSO,
    CREATE_TIPORECURSO_SUCCESS,
    UPDATE_TIPORECURSO_SUCCESS,
    SET_TIPORECURSO,
    SET_TIPORECURSOS,
    REMOVE_TIPORECURSO_SUCCESS
} from '../constants/tipoRecursoConstants';

const tipoRecursoState = {
    data: [],
    notifMsg: "",
    tipoRecurso: null,
}

const setTipoRecurso = (state, action) => {
    return updateObject(state, {
        tipoRecurso: {
            ...action.payload.tipoRecurso,
        }
    });
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export default function tipoRecursoReducer(state = tipoRecursoState, action) {
    switch (action.type) {
        case INIT_CREATE_TIPORECURSO:
            return {
                ...state,
                tipoRecurso: null,
            }
        case CREATE_TIPORECURSO_SUCCESS:
            return {
                ...state,
                notifMsg: notif.saved,
                tipoRecurso: null,
            }
        case CREATE_TIPORECURSO: return updateObject(state, { tipoRecurso: null })
        case SET_TIPORECURSO: return setTipoRecurso(state, action);
        case REMOVE_TIPORECURSO_SUCCESS:
            const id = action.id
            return {
                ...state,
                notifMsg: notif.removed,
                data: state.data.filter((data) => data.id !== id)
            }
        case UPDATE_TIPORECURSO_SUCCESS:
            return {
                ...state,
                notifMsg: action.payload.message,
            }
        case SET_TIPORECURSOS:
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
