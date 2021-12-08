import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from '../constants/notifConstants'
import {
    CREATE_PROJETO,
    INIT_CREATE_PROJETO,
    CREATE_PROJETO_SUCCESS,
    UPDATE_PROJETO_SUCCESS,
    SET_PROJETO,
    SET_PROJETOS,
    REMOVE_PROJETO_SUCCESS
} from '../constants/projetoConstants';

const projetoState = {
    data: [],
    notifMsg: "",
    projeto: null
}

const setProjeto = (state, action) => {
    return updateObject(state, {
        projeto: {
            ...action.payload.projeto,
        }
    });
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export default function projetoReducer(state = projetoState, action) {
    switch (action.type) {
        case INIT_CREATE_PROJETO:
            return {
                ...state,
                projeto: null,
            }
        case CREATE_PROJETO_SUCCESS:
            return {
                ...state,
                notifMsg: notif.saved,
                projeto: null,
            }
        case CREATE_PROJETO: return updateObject(state, { projeto: null })
        case SET_PROJETO: return setProjeto(state, action);
        case REMOVE_PROJETO_SUCCESS:
            const id = action.id
            return {
                ...state,
                notifMsg: notif.removed,
                data: state.data.filter((data) => data.id !== id)
            }
        case UPDATE_PROJETO_SUCCESS:
            return {
                ...state,
                notifMsg: action.payload.message,
            }
        case SET_PROJETOS:
            return {
                ...state,
                ...action.payload
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
