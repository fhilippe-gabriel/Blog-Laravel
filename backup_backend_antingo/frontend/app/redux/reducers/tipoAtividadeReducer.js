import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from '../constants/notifConstants'
import {
    CREATE_TIPOATIVIDADE,
    INIT_CREATE_TIPOATIVIDADE,
    CREATE_TIPOATIVIDADE_SUCCESS,
    UPDATE_TIPOATIVIDADE_SUCCESS,
    SET_TIPOATIVIDADE,
    SET_TIPOATIVIDADES,
    REMOVE_TIPOATIVIDADE_SUCCESS
} from '../constants/tipoAtividadeConstants';

const tipoAtividadeState = {
    data: [],
    notifMsg: "",
    tipoAtividade: null,
}


const setTipoAtividade = (state, action) => {
    return updateObject(state, {
        tipoAtividade: {
            ...action.payload.tipoAtividade,
        }
    });
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export default function tipoAtividadeReducer(state = tipoAtividadeState, action) {
    switch (action.type) {
        case INIT_CREATE_TIPOATIVIDADE:
            return {
                ...state,
                tipoAtividade: null,
            }
        case CREATE_TIPOATIVIDADE_SUCCESS:
            return {
                ...state,
                notifMsg: notif.saved,
                tipoAtividade: null,
            }
        case CREATE_TIPOATIVIDADE: return updateObject(state, { tipoAtividade: null })
        case SET_TIPOATIVIDADE: return setTipoAtividade(state, action);
        case REMOVE_TIPOATIVIDADE_SUCCESS:
            const id = action.id
            return {
                ...state,
                notifMsg: notif.removed,
                data: state.data.filter((data) => data.id !== id)
            }
        case UPDATE_TIPOATIVIDADE_SUCCESS:
            return {
                ...state,
                notifMsg: action.payload.message,
            }
        case SET_TIPOATIVIDADES:
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
