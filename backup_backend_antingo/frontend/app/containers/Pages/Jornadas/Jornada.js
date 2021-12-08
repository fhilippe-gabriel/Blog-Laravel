import React, { useState,useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { Notification } from 'enl-components';
import { withStyles } from '@material-ui/core/styles';

import styles from 'enl-components/Forms/user-jss';

import * as actions from '@/app/redux/actions/jornadaActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import JornadaForm from './JornadaForm'
import DeleteDialog from '../../DialogModal/DeleteDialog';

const Jornada = (props) => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idJornada, setIdJornada] = useState(null);
    const uid = props.match.params._id;
    
    useEffect(() => {
        if (props.jornada === undefined
            && uid) {
            props.onFetchJornada(uid);
        }
    }, [])

    const formSubmit = (values) => {

        const jornada = {
            id: values.get('id'),
            numero: values.get('numero'),
            descricao: values.get('descricao'),
            observacao: values.get('observacao'),
        }

        if (jornada.id === undefined) {
            props.onCreateJornada(jornada)
        } else {
            props.onUpdateJornada(jornada)
        }

    }

    

    const handleDelete = (id) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdJornada(id)
    }

    const handleConfirmDelete = (id) => {
        props.onRemoveJornada(id, true);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdJornada(null)
    }

    const title = brand.name + ' - Jornada';
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
            <JornadaForm onSubmit={(values) => formSubmit(values)} onDelete={(id) => handleDelete(id)} />
            {deleteDialogOpen ? (<DeleteDialog id={idJornada} handleConfirm={handleConfirmDelete} />) : null}
        </div>
    );
}

const reducer = 'jornadaReducer';
const mapStateToProps = state => ({
    jornada: state.getIn([reducer, 'jornada']),
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onFetchJornada: (id) => dispatch(actions.fetchJornada(id)),
    onCreateJornada: (values) => dispatch(actions.createJornada(values)),
    onRemoveJornada: (id) => dispatch(actions.removeJornada(id, true)),
    onUpdateJornada: (values) => dispatch(actions.updateJornada(values)),
    closeNotif: () => dispatch(closeNotifAction),
});

const JornadaMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Jornada);

export default (withStyles(styles)(JornadaMapped));