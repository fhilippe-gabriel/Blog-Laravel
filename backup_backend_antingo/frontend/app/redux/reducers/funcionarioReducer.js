import notif from 'enl-api/ui/notifMessage';
import { CLOSE_NOTIF } from '../constants/notifConstants'
import {
    CREATE_FUNCIONARIO,
    INIT_CREATE_FUNCIONARIO,
    CREATE_FUNCIONARIO_SUCCESS,
    UPDATE_FUNCIONARIO_SUCCESS,
    SET_FUNCIONARIO,
    SET_FUNCIONARIOS,
    REMOVE_FUNCIONARIO_SUCCESS
} from '../constants/funcionarioConstants';

const funcionarioState = {
    data: [],
    notifMsg: "",
    funcionario: null,
}


const setFuncionario = (state, action) => {
    return updateObject(state, {
        funcionario: {
            ...action.payload.funcionario,
        }
    });
};

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export default function funcionarioReducer(state = funcionarioState, action) {
    switch (action.type) {
        case INIT_CREATE_FUNCIONARIO:
            return {
                ...state,
                funcionario: null,
            }
        case CREATE_FUNCIONARIO_SUCCESS:
            return {
                ...state,
                notifMsg: notif.saved,
                funcionario: null,
            }
        case CREATE_FUNCIONARIO: return updateObject(state, { funcionario: null })
        case SET_FUNCIONARIO: return setFuncionario(state, action);
        case REMOVE_FUNCIONARIO_SUCCESS:
            const id = action.id
            return {
                ...state,
                notifMsg: notif.removed,
                data: state.data.filter((data) => data.id !== id)
            }
        case UPDATE_FUNCIONARIO_SUCCESS:
            return {
                ...state,
                notifMsg: action.payload.message,
            }
        case SET_FUNCIONARIOS:
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
