import React, { useState,useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { Notification } from 'enl-components';
import { withStyles } from '@material-ui/core/styles';

import styles from 'enl-components/Forms/user-jss';

import * as actions from '@/app/redux/actions/tipoAtividadeActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import TipoAtividadeForm from './TipoAtividadeForm'
import DeleteDialog from '../../DialogModal/DeleteDialog';

const TipoAtividade = (props) => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idTipoAtividade, setIdTipoAtividade] = useState(null);
    const uid = props.match.params._id;
    
    useEffect(() => {
        if (props.tipoAtividade === undefined
            && uid) {
            props.onFetchTipoAtividade(uid);
        }
    }, [])

    const formSubmit = (values) => {

        const tipoAtividade = {
            id: values.get('id'),
            numero: values.get('numero'),
            descricao: values.get('descricao'),
            observacao: values.get('observacao'),
        }

        if (tipoAtividade.id === undefined) {
            props.onCreateTipoAtividade(tipoAtividade)
        } else {
            props.onUpdateTipoAtividade(tipoAtividade)
        }

    }

    

    const handleDelete = (id) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdTipoAtividade(id)
    }

    const handleConfirmDelete = (id) => {
        props.onRemoveTipoAtividade(id, true);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdTipoAtividade(null)
    }

    const title = brand.name + ' - TipoAtividade';
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
            <TipoAtividadeForm onSubmit={(values) => formSubmit(values)} onDelete={(id) => handleDelete(id)} />
            {deleteDialogOpen ? (<DeleteDialog id={idTipoAtividade} handleConfirm={handleConfirmDelete} />) : null}
        </div>
    );
}

const reducer = 'tipoAtividadeReducer';
const mapStateToProps = state => ({
    tipoAtividade: state.getIn([reducer, 'tipoAtividade']),
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onFetchTipoAtividade: (id) => dispatch(actions.fetchTipoAtividade(id)),
    onCreateTipoAtividade: (values) => dispatch(actions.createTipoAtividade(values)),
    onRemoveTipoAtividade: (id) => dispatch(actions.removeTipoAtividade(id, true)),
    onUpdateTipoAtividade: (values) => dispatch(actions.updateTipoAtividade(values)),
    closeNotif: () => dispatch(closeNotifAction),
});

const TipoAtividadeMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(TipoAtividade);

export default (withStyles(styles)(TipoAtividadeMapped));