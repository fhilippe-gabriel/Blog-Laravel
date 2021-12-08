import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { Notification } from 'enl-components';
import { withStyles } from '@material-ui/core/styles';

import styles from 'enl-components/Forms/user-jss';

import * as actions from '@/app/redux/actions/pontoMarcacaoActions'
import * as funcionarioActions from '@/app/redux/actions/funcionarioActions'
import * as clienteActions from '@/app/redux/actions/clienteActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import PontoMarcacaoForm from './PontoMarcacaoForm'
import DeleteDialog from '../../DialogModal/DeleteDialog';

const PontoMarcacao = (props) => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idPontoMarcacao, setIdPontoMarcacao] = useState(null);
    const uid = props.match.params._id;

    useEffect(() => {
        if (props.pontoMarcacao === undefined
            && uid) {
            props.onFetchPontoMarcacao(uid);
        }
        props.onFetchClientes();
        props.onFetchFuncionarios();
    }, [])

    const formSubmit = (values) => {

        const pontoMarcacao = {
            id: values.get('id'),
            data_ponto: values.get('data_ponto'),
            hora_entrada: values.get('hora_entrada'),
            hora_saida: values.get('hora_saida'),
            quantidade_horas: values.get('quantidade_horas'),
            funcionario_id: values.get('funcionario_id'),
            cliente_id: values.get('cliente_id'),
        }

        if (pontoMarcacao.id === undefined) {
            props.onCreatePontoMarcacao(pontoMarcacao)
        } else {
            props.onUpdatePontoMarcacao(pontoMarcacao)
        }

    }



    const handleDelete = (id) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdPontoMarcacao(id)
    }

    const handleConfirmDelete = (id) => {
        props.onRemovePontoMarcacao(id, true);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdPontoMarcacao(null)
    }

    const title = brand.name + ' - PontoMarcacao';
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
            <PontoMarcacaoForm funcionarios={props.funcionarios}
                onSubmit={(values) => formSubmit(values)}
                clientes={props.clientes}
                onDelete={(id) => handleDelete(id)} />
            {deleteDialogOpen ? (<DeleteDialog id={idPontoMarcacao} handleConfirm={handleConfirmDelete} />) : null}
        </div>
    );
}

const reducer = 'pontoMarcacaoReducer';
const mapStateToProps = state => ({
    pontoMarcacao: state.getIn([reducer, 'pontoMarcacao']),
    funcionarios: state.getIn(['funcionarioReducer']).data,
    messageNotif: state.getIn([reducer]).notifMsg,
    clientes: state.getIn(['clienteReducer']).data
});

const mapDispatchToProps = dispatch => ({
    onFetchPontoMarcacao: (id) => dispatch(actions.fetchPontoMarcacao(id)),
    onCreatePontoMarcacao: (values) => dispatch(actions.createPontoMarcacao(values)),
    onRemovePontoMarcacao: (id) => dispatch(actions.removePontoMarcacao(id, true)),
    onUpdatePontoMarcacao: (values) => dispatch(actions.updatePontoMarcacao(values)),
    onFetchFuncionarios: () => dispatch(funcionarioActions.listFuncionarios(true)),
    onFetchClientes: () => dispatch(clienteActions.listClientes()),
    closeNotif: () => dispatch(closeNotifAction),
});

const PontoMarcacaoMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(PontoMarcacao);

export default (withStyles(styles)(PontoMarcacaoMapped));