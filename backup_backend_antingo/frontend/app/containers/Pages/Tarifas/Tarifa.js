import React, { useState,useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { Notification } from 'enl-components';
import { withStyles } from '@material-ui/core/styles';

import styles from 'enl-components/Forms/user-jss';

import * as actions from '@/app/redux/actions/tarifaActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import TarifaForm from './TarifaForm'
import DeleteDialog from '../../DialogModal/DeleteDialog';

const Tarifa = (props) => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idTarifa, setIdTarifa] = useState(null);
    const uid = props.match.params._id;
    
    useEffect(() => {
        if (props.tarifa === undefined
            && uid) {
            props.onFetchTarifa(uid);
        }
    }, [])

    const formSubmit = (values) => {

        const tarifa = {
            id: values.get('id'),
            descricao: values.get('descricao'),
        }

        if (tarifa.id === undefined) {
            props.onCreateTarifa(tarifa)
        } else {
            props.onUpdateTarifa(tarifa)
        }

    }


    const handleDelete = (id) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdTarifa(id)
    }

    const handleConfirmDelete = (id) => {
        props.onRemoveTarifa(id, true);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdTarifa(null)
    }

    const title = brand.name + ' - Tarifa';
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
            <TarifaForm onSubmit={(values) => formSubmit(values)} onDelete={(id) => handleDelete(id)} />
            {deleteDialogOpen ? (<DeleteDialog id={idTarifa} handleConfirm={handleConfirmDelete} />) : null}
        </div>
    );
}

const reducer = 'tarifaReducer';
const mapStateToProps = state => ({
    tarifa: state.getIn([reducer, 'tarifa']),
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onFetchTarifa: (id) => dispatch(actions.fetchTarifa(id)),
    onCreateTarifa: (values) => dispatch(actions.createTarifa(values)),
    onRemoveTarifa: (id) => dispatch(actions.removeTarifa(id, true)),
    onUpdateTarifa: (values) => dispatch(actions.updateTarifa(values)),
    closeNotif: () => dispatch(closeNotifAction),
});

const TarifaMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Tarifa);

export default (withStyles(styles)(TarifaMapped));