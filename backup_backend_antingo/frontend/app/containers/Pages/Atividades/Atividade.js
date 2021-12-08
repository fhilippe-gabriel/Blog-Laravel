import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { Notification } from 'enl-components';
import { withStyles } from '@material-ui/core/styles';

import styles from 'enl-components/Forms/user-jss';

import * as actions from '@/app/redux/actions/atividadeActions'
import * as projetoActions from '@/app/redux/actions/projetoActions'
import * as tarifaActions from '@/app/redux/actions/tarifaActions'
import * as clienteActions from '@/app/redux/actions/clienteActions'
import * as funcionarioActions from '@/app/redux/actions/funcionarioActions'
import * as tipoAtividadeActions from '@/app/redux/actions/tipoAtividadeActions'
import * as tipoFaturamentoActions from '@/app/redux/actions/tipoFaturamentoActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import AtividadeForm from './AtividadeForm'
import DeleteDialog from '../../DialogModal/DeleteDialog';

const Atividade = (props) => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idAtividade, setIdAtividade] = useState(null);
    const uid = props.match.params._id;

    useEffect(() => {
        if (props.atividade === undefined
            && uid) {
            props.onFetchAtividade(uid);
        }
        if (!props.tarifas.length) {
            props.onFetchTarifas();
        }
        if (!props.projetos.length) {
            props.onFetchProjetos();
        }
        if (!props.clientes.length) {
            props.onFetchClientes();
        }
        if (!props.funcionarios.length) {
            props.onFetchFuncionarios();
        }
        if (!props.tiposAtividades.length) {
            props.onFetchTiposAtividades();
        }
        if (!props.tiposFaturamentos.length) {
            props.onFetchTiposFaturamentos();
        }

    }, [])

    const formSubmit = (values) => {

        const atividade = {
            id: values.get('id'),
            numero: values.get('numero'),
            detalhes: values.get('detalhes'),
            descricao: values.get('descricao'),
            observacao: values.get('observacao'),
            data_inicio: values.get('data_inicio'),
            data_termino: values.get('data_termino'),
            quantidade_dias: values.get('quantidade_dias'),
            horas_previstas: values.get('horas_previstas'),
            horas_realizadas: values.get('horas_realizadas'),
            tarifa_id: values.get('tarifa_id'),
            projeto_id: values.get('projeto_id'),
            responsavel_id: values.get('responsavel_id'),
            tipo_atividade_id: values.get('tipo_atividade_id'),
            tipo_faturamento_id: values.get('tipo_faturamento_id'),
        }

        if (atividade.id === undefined) {
            props.onCreateAtividade(atividade)
        } else {
            props.onUpdateAtividade(atividade)
        }

    }


    const handleDelete = (id) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdAtividade(id)
    }

    const handleConfirmDelete = (id) => {
        props.onRemoveAtividade(id, true);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdAtividade(null)
    }
    
    const handleClienteSelect = (e) => {
        const cliente = props.clientes.filter(cliente => cliente.id === e.target.value);
        const data = {
            data: cliente[0].projetos
        }
        props.onSetProjetos(data)
    }

    const title = brand.name + ' - Atividade';
    const description = brand.desc;

    return (
        <div>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="twitter:title" content={title} />
                <meta property="twitter:description" content={description} />
            </Helmet>
            <Notification close={() => props.closeNotif()} message={props.messageNotif} />
            <AtividadeForm onSubmit={(values) => formSubmit(values)} onDelete={(id) => handleDelete(id)}
                tarifas={props.tarifas} responsaveis={props.funcionarios} projetos={props.projetos} clientes={props.clientes} handleClienteSelect={handleClienteSelect}
                tiposAtividades={props.tiposAtividades} tiposFaturamentos={props.tiposFaturamentos} />
            {deleteDialogOpen ? (<DeleteDialog id={idAtividade} handleConfirm={handleConfirmDelete} />) : null}
        </div>
    );
}

const reducer = 'atividadeReducer';
const mapStateToProps = state => ({
    atividade: state.getIn([reducer, 'atividade']),
    tiposAtividades: state.getIn(['tipoAtividadeReducer']).data,
    tiposFaturamentos: state.getIn(['tipoFaturamentoReducer']).data,
    tarifas: state.getIn(['tarifaReducer']).data,
    funcionarios: state.getIn(['funcionarioReducer']).data,
    projetos: state.getIn(['projetoReducer']).data,
    clientes: state.getIn(['clienteReducer']).data,
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onFetchAtividade: (id) => dispatch(actions.fetchAtividade(id)),
    onCreateAtividade: (values) => dispatch(actions.createAtividade(values)),
    onRemoveAtividade: (id) => dispatch(actions.removeAtividade(id, true)),
    onUpdateAtividade: (values) => dispatch(actions.updateAtividade(values)),
    onFetchTarifas: () => dispatch(tarifaActions.listTarifas()),
    onFetchTiposAtividades: () => dispatch(tipoAtividadeActions.listTipoAtividades()),
    onFetchTiposFaturamentos: () => dispatch(tipoFaturamentoActions.listTipoFaturamentos()),
    onFetchFuncionarios: () => dispatch(funcionarioActions.listFuncionarios(true)),
    onFetchProjetos: () => dispatch(projetoActions.listProjetos()),
    onSetProjetos: (projetos) => dispatch(projetoActions.setProjetos(projetos)),
    onFetchClientes: () => dispatch(clienteActions.listClientes()),
    closeNotif: () => dispatch(closeNotifAction),
});

const AtividadeMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Atividade);

export default (withStyles(styles)(AtividadeMapped));