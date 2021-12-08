import React, { useState,useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { Notification } from 'enl-components';
import { withStyles } from '@material-ui/core/styles';

import styles from 'enl-components/Forms/user-jss';

import * as actions from '@/app/redux/actions/tipoFaturamentoActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import TipoFaturamentoForm from './TipoFaturamentoForm'
import DeleteDialog from '../../DialogModal/DeleteDialog';

const TipoFaturamento = (props) => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idTipoFaturamento, setIdTipoFaturamento] = useState(null);
    const uid = props.match.params._id;
    
    useEffect(() => {
        if (props.tipoFaturamento === undefined
            && uid) {
            props.onFetchTipoFaturamento(uid);
        }
    }, [])

    const formSubmit = (values) => {

        const tipoFaturamento = {
            id: values.get('id'),
            numero: values.get('numero'),
            descricao: values.get('descricao'),
            observacao: values.get('observacao'),
        }

        if (tipoFaturamento.id === undefined) {
            props.onCreateTipoFaturamento(tipoFaturamento)
        } else {
            props.onUpdateTipoFaturamento(tipoFaturamento)
        }

    }


    const handleDelete = (id) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdTipoFaturamento(id)
    }

    const handleConfirmDelete = (id) => {
        props.onRemoveTipoFaturamento(id, true);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdTipoFaturamento(null)
    }

    const title = brand.name + ' - TipoFaturamento';
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
            <TipoFaturamentoForm onSubmit={(values) => formSubmit(values)} onDelete={(id) => handleDelete(id)} />
            {deleteDialogOpen ? (<DeleteDialog id={idTipoFaturamento} handleConfirm={handleConfirmDelete} />) : null}
        </div>
    );
}

const reducer = 'tipoFaturamentoReducer';
const mapStateToProps = state => ({
    tipoFaturamento: state.getIn([reducer, 'tipoFaturamento']),
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onFetchTipoFaturamento: (id) => dispatch(actions.fetchTipoFaturamento(id)),
    onCreateTipoFaturamento: (values) => dispatch(actions.createTipoFaturamento(values)),
    onRemoveTipoFaturamento: (id) => dispatch(actions.removeTipoFaturamento(id, true)),
    onUpdateTipoFaturamento: (values) => dispatch(actions.updateTipoFaturamento(values)),
    closeNotif: () => dispatch(closeNotifAction),
});

const TipoFaturamentoMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(TipoFaturamento);

export default (withStyles(styles)(TipoFaturamentoMapped));