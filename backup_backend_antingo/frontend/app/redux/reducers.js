/**
 * Combine all reducers in this file and export the combined reducers.
 */
import { reducer as form } from 'redux-form/immutable';
import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';
import history from 'utils/history';

// Global Reducers
import languageProviderReducer from 'containers/LanguageProvider/reducer';
import authReducer from './reducers/authReducer';
import uiReducer from './reducers/uiReducer';
import initval from './reducers/initFormReducer';
import clienteReducer from './reducers/clienteReducer';
import funcionarioReducer from './reducers/funcionarioReducer';
import jornadaReducer from './reducers/jornadaReducer';
import cargoReducer from './reducers/cargoReducer';
import exameReducer from './reducers/exameReducer';
import equipamentoReducer from './reducers/equipamentoReducer';
import tarifaReducer from './reducers/tarifaReducer';
import tarifaPrecoReducer from './reducers/tarifaPrecoReducer';
import atividadeReducer from './reducers/atividadeReducer';
import tipoRecursoReducer from './reducers/tipoRecursoReducer';
import tipoFaturamentoReducer from './reducers/tipoFaturamentoReducer';
import certificadoReducer from './reducers/certificadoReducer';
import projetoReducer from './reducers/projetoReducer';
import pontoMarcacaoReducer from './reducers/pontoMarcacaoReducer';
import tipoAtividadeReducer from './reducers/tipoAtividadeReducer';
import userReducer from './reducers/userReducer';

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    form,
    ui: uiReducer,
    initval,
    authReducer,
    clienteReducer,
    exameReducer,
    certificadoReducer,
    funcionarioReducer,
    projetoReducer,
    userReducer,
    jornadaReducer,
    cargoReducer,
    tipoAtividadeReducer,
    tipoFaturamentoReducer,
    tipoRecursoReducer,
    atividadeReducer,
    equipamentoReducer,
    tarifaReducer,
    tarifaPrecoReducer,
    pontoMarcacaoReducer,
    language: languageProviderReducer,
    router: connectRouter(history),
    ...injectedReducers,
  });

  // Wrap the root reducer and return a new root reducer with router state
  const mergeWithRouterState = connectRouter(history);
  return mergeWithRouterState(rootReducer);
}
