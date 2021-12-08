import React, { useState,useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { Notification } from 'enl-components';
import { withStyles } from '@material-ui/core/styles';

import styles from 'enl-components/Forms/user-jss';

import * as actions from '@/app/redux/actions/tipoRecursoActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import TipoRecursoForm from './TipoRecursoForm'
import DeleteDialog from '../../DialogModal/DeleteDialog';

const TipoRecurso = (props) => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idTipoRecurso, setIdTipoRecurso] = useState(null);
    const uid = props.match.params._id;
    
    useEffect(() => {
        if (props.tipoRecurso === undefined
            && uid) {
            props.onFetchTipoRecurso(uid);
        }
    }, [])

    const formSubmit = (values) => {

        const tipoRecurso = {
            id: values.get('id'),
            numero: values.get('numero'),
            descricao: values.get('descricao'),
            observacao: values.get('observacao'),
        }

        if (tipoRecurso.id === undefined) {
            props.onCreateTipoRecurso(tipoRecurso)
        } else {
            props.onUpdateTipoRecurso(tipoRecurso)
        }

    }


    const handleDelete = (id) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdTipoRecurso(id)
    }

    const handleConfirmDelete = (id) => {
        props.onRemoveTipoRecurso(id, true);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdTipoRecurso(null)
    }

    const title = brand.name + ' - TipoRecurso';
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
            <TipoRecursoForm onSubmit={(values) => formSubmit(values)} onDelete={(id) => handleDelete(id)} />
            {deleteDialogOpen ? (<DeleteDialog id={idTipoRecurso} handleConfirm={handleConfirmDelete} />) : null}
        </div>
    );
}

const reducer = 'tipoRecursoReducer';
const mapStateToProps = state => ({
    tipoRecurso: state.getIn([reducer, 'tipoRecurso']),
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onFetchTipoRecurso: (id) => dispatch(actions.fetchTipoRecurso(id)),
    onCreateTipoRecurso: (values) => dispatch(actions.createTipoRecurso(values)),
    onRemoveTipoRecurso: (id) => dispatch(actions.removeTipoRecurso(id, true)),
    onUpdateTipoRecurso: (values) => dispatch(actions.updateTipoRecurso(values)),
    closeNotif: () => dispatch(closeNotifAction),
});

const TipoRecursoMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(TipoRecurso);

export default (withStyles(styles)(TipoRecursoMapped));