import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from '../constants/notifConstants'
import {
    CREATE_PONTO_MARCACAO,
    INIT_CREATE_PONTO_MARCACAO,
    CREATE_PONTO_MARCACAO_SUCCESS,
    UPDATE_PONTO_MARCACAO_SUCCESS,
    SET_PONTO_MARCACAO,
    SET_PONTOS_MARCACOES,
    REMOVE_PONTO_MARCACAO_SUCCESS
} from '../constants/pontoMarcacaoConstants';

const pontoMarcacaoState = {
    data: [],
    notifMsg: "",
    pontoMarcacao: null,
    situacoes: [],
}

const setPontoMarcacao = (state, action) => {
    return updateObject(state, {
        pontoMarcacao: {
            ...action.payload.pontoMarcacao,
        }
    });
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export default function pontoMarcacaoReducer(state = pontoMarcacaoState, action) {
    switch (action.type) {
        case INIT_CREATE_PONTO_MARCACAO:
            return {
                ...state,
                pontoMarcacao: null,
            }
        case CREATE_PONTO_MARCACAO_SUCCESS:
            return {
                ...state,
                notifMsg: notif.saved,
                pontoMarcacao: null,
            }
        case CREATE_PONTO_MARCACAO: return updateObject(state, { pontoMarcacao: null })
        case SET_PONTO_MARCACAO: return setPontoMarcacao(state, action);
        case REMOVE_PONTO_MARCACAO_SUCCESS:
            const id = action.id
            return {
                ...state,
                notifMsg: notif.removed,
                data: state.data.filter((data) => data.id !== id)
            }
        case UPDATE_PONTO_MARCACAO_SUCCESS:
            return {
                ...state,
                notifMsg: action.payload.message,
            }
        case SET_PONTOS_MARCACOES:
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
