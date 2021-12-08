import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { Notification } from 'enl-components';
import { withStyles } from '@material-ui/core/styles';

import styles from 'enl-components/Forms/user-jss';

import * as actions from '@/app/redux/actions/projetoActions'
import * as clienteAction from '@/app/redux/actions/clienteActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import DeleteDialog from '../../DialogModal/DeleteDialog';
import ProjetoForm from './ProjetoForm'

const Projeto = props => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idProjeto, setIdProjeto] = useState(null);
    const uid = props.match.params._id;

    useEffect(() => {
        if (props.projeto === null
            && uid) {
            props.onFetchProjeto(uid);
        }
        props.listClientes();
    },[])

    const formSubmit = (values) => {

        const projeto = {
            id: values.get('id'),
            descricao: values.get('descricao'),
            local: values.get('local'),
            valor: (values.get('valor').replace(".","").replace(",", ".")),
            data_inicio: values.get('data_inicio'),
            data_fim: values.get('data_fim'),
            cliente_id: values.get('cliente_id'),
            codigo_projeto: values.get('codigo_projeto')

        }
        if (projeto.id === undefined) {
            props.onCreateProjeto(projeto)

        } else {
            props.onUpdateProjeto(projeto)
        }

    }

    const handleDelete = (id) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdProjeto(id)
    }

    const handleConfirmDelete = (id) => {
        props.onRemoveProjeto(id, true);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdProjeto(null)
    }

    const title = brand.name + ' - Projeto';
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
            <ProjetoForm clientes={props.clientes} onDelete={(id) => handleDelete(id)} onSubmit={(values) => formSubmit(values)} />
            {deleteDialogOpen ? (<DeleteDialog id={idProjeto} handleConfirm={handleConfirmDelete} />) : null}
        </div>
    );
}

const reducer = 'projetoReducer';
const mapStateToProps = state => ({
    projeto: state.getIn([reducer]).projeto,
    messageNotif: state.getIn([reducer]).notifMsg,
    clientes: state.getIn(['clienteReducer']).data,
});

const mapDispatchToProps = dispatch => ({
    onFetchProjeto: (id) => dispatch(actions.fetchProjeto(id)),
    onCreateProjeto: (values) => dispatch(actions.createProjeto(values)),
    onUpdateProjeto: (values) => dispatch(actions.updateProjeto(values)),
    onRemoveProjeto: (id) => dispatch(actions.removeProjeto(id, true)),
    closeNotif: () => dispatch(closeNotifAction),
    listClientes: () => dispatch(clienteAction.listClientes()),
});

const ProjetoMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Projeto);


export default (withStyles(styles)(ProjetoMapped));
