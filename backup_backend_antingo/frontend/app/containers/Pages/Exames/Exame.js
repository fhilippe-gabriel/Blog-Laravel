import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { Notification } from 'enl-components';
import { withStyles } from '@material-ui/core/styles';

import styles from 'enl-components/Forms/user-jss';

import * as actions from '@/app/redux/actions/exameActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import ExameForm from './ExameForm'
import DeleteDialog from '../../DialogModal/DeleteDialog';

const Exame = (props) => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idExame, setIdExame] = useState(null);
    const uid = props.match.params._id;

    useEffect(() => {
        if (props.exame === undefined
            && uid) {
            props.onFetchExame(uid);
        }
    }, [])

    const formSubmit = (values) => {

        const exame = {
            id: values.get('id'),
            nome_exame: values.get('nome_exame'),
            tipo_exame: values.get('tipo_exame'),
            validade_meses: values.get('validade_meses'),
            observacao: values.get('observacao'),
        }

        if (exame.id === undefined) {
            props.onCreateExame(exame)
        } else {
            props.onUpdateExame(exame)
        }

    }



    const handleDelete = (id) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdExame(id)
    }

    const handleConfirmDelete = (id) => {
        props.onRemoveExame(id, true);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdExame(null)
    }

    const title = brand.name + ' - Exame';
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
            <ExameForm onSubmit={(values) => formSubmit(values)} onDelete={(id) => handleDelete(id)} />
            {deleteDialogOpen ? (<DeleteDialog id={idExame} handleConfirm={handleConfirmDelete} />) : null}
        </div>
    );
}

const reducer = 'exameReducer';
const mapStateToProps = state => ({
    exame: state.getIn([reducer, 'exame']),
    messageNotif: state.getIn([reducer]).notifMsg,
    funcionarios: state.getIn(['funcionarioReducer']).data
});

const mapDispatchToProps = dispatch => ({
    onFetchExame: (id) => dispatch(actions.fetchExame(id)),
    onCreateExame: (values) => dispatch(actions.createExame(values)),
    onRemoveExame: (id) => dispatch(actions.removeExame(id, true)),
    onUpdateExame: (values) => dispatch(actions.updateExame(values)),
    closeNotif: () => dispatch(closeNotifAction),
});

const ExameMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Exame);

export default (withStyles(styles)(ExameMapped));