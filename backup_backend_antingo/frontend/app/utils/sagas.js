import { all } from 'redux-saga/effects';
import authSagas from 'enl-redux/sagas/authSagas';
import clienteSagas from 'enl-redux/sagas/clienteSagas';
import funcionarioSagas from 'enl-redux/sagas/funcionarioSagas';
import jornadaSagas from 'enl-redux/sagas/jornadaSagas';
import cargoSagas from 'enl-redux/sagas/cargoSagas';
import exameSagas from 'enl-redux/sagas/exameSagas';
import equipamentoSagas from 'enl-redux/sagas/equipamentoSagas';
import tarifaSagas from 'enl-redux/sagas/tarifaSagas';
import tarifaPrecoSagas from 'enl-redux/sagas/tarifaPrecoSagas';
import atividadeSagas from 'enl-redux/sagas/atividadeSagas';
import tipoRecursoSagas from 'enl-redux/sagas/tipoRecursoSagas';
import tipoFaturamentoSagas from 'enl-redux/sagas/tipoFaturamentoSagas';
import certificadoSagas from 'enl-redux/sagas/certificadoSagas';
import projetoSagas from 'enl-redux/sagas/projetoSagas';
import pontoMarcacaoSagas from 'enl-redux/sagas/pontoMarcacaoSagas';
import tipoAtividadeSagas from 'enl-redux/sagas/tipoAtividadeSaga';
import userSagas from 'enl-redux/sagas/userSagas';


export default function* sagas() {
  yield all([
    ...authSagas,
    ...clienteSagas,
    ...jornadaSagas,
    ...projetoSagas,
    ...exameSagas,
    ...certificadoSagas,
    ...cargoSagas,
    ...userSagas,
    ...funcionarioSagas,
    ...equipamentoSagas,
    ...tipoAtividadeSagas,
    ...tipoRecursoSagas,
    ...tipoFaturamentoSagas,
    ...tarifaSagas,
    ...pontoMarcacaoSagas,
    ...tarifaPrecoSagas,
    ...atividadeSagas
  ]);
}
