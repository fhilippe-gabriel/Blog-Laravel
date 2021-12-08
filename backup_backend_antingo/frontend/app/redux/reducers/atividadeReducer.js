import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from '../constants/notifConstants'
import {
    CREATE_ATIVIDADE,
    INIT_CREATE_ATIVIDADE,
    CREATE_ATIVIDADE_SUCCESS,
    UPDATE_ATIVIDADE_SUCCESS,
    SET_ATIVIDADE,
    SET_ATIVIDADES,
    REMOVE_ATIVIDADE_SUCCESS
} from '../constants/atividadeConstants';

const atividadeState = {
    data: [],
    notifMsg: "",
    atividade: null,
}

const setAtividade = (state, action) => {
    return updateObject(state, {
        atividade: {
            ...action.payload.atividade,
        }
    });
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export default function atividadeReducer(state = atividadeState, action) {
    switch (action.type) {
        case INIT_CREATE_ATIVIDADE:
            return {
                ...state,
                atividade: null,
            }
        case CREATE_ATIVIDADE_SUCCESS:
            return {
                ...state,
                notifMsg: notif.saved,
                atividade: null,
            }
        case CREATE_ATIVIDADE: return updateObject(state, { atividade: null })
        case SET_ATIVIDADE: return setAtividade(state, action);
        case REMOVE_ATIVIDADE_SUCCESS:
            const id = action.id
            return {
                ...state,
                notifMsg: notif.removed,
                data: state.data.filter((data) => data.id !== id)
            }
        case UPDATE_ATIVIDADE_SUCCESS:
            return {
                ...state,
                notifMsg: action.payload.message,
            }
        case SET_ATIVIDADES:
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
