import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { Notification } from 'enl-components';
import { withStyles } from '@material-ui/core/styles';

import styles from 'enl-components/Forms/user-jss';

import * as actions from '@/app/redux/actions/tarifaPrecoActions'
import * as tarifaActions from '@/app/redux/actions/tarifaActions'
import * as tipoRecursoActions from '@/app/redux/actions/tipoRecursoActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import TarifaPrecoForm from './TarifaPrecoForm'
import DeleteDialog from '../../DialogModal/DeleteDialog';

const TarifaPreco = (props) => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idTarifaPreco, setIdTarifaPreco] = useState(null);
    const uid = props.match.params._id;

    useEffect(() => {
        if (props.tarifaPreco === undefined
            && uid) {
            props.onFetchTarifaPreco(uid);
        }
        props.onFetchTarifas();
        props.onFetchTiposRecursos();
    }, [])

    const formSubmit = (values) => {

        const tarifaPreco = {
            id: values.get('id'),
            tarifa_id: values.get('tarifa_id'),
            tipo_recurso_id: values.get('tipo_recurso_id'),
            valor: (values.get('valor').replace(".", "").replace(",", ".")),
        }

        if (tarifaPreco.id === undefined) {
            props.onCreateTarifaPreco(tarifaPreco)
        } else {
            props.onUpdateTarifaPreco(tarifaPreco)
        }

    }


    const handleDelete = (id) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdTarifaPreco(id)
    }

    const handleConfirmDelete = (id) => {
        props.onRemoveTarifaPreco(id, true);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdTarifaPreco(null)
    }

    const title = brand.name + ' - TarifaPreco';
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
            <TarifaPrecoForm onSubmit={(values) => formSubmit(values)} onDelete={(id) => handleDelete(id)}
                tarifas={props.tarifas} tiposRecursos={props.tiposRecursos} />
            {deleteDialogOpen ? (<DeleteDialog id={idTarifaPreco} handleConfirm={handleConfirmDelete} />) : null}
        </div>
    );
}

const reducer = 'tarifaPrecoReducer';
const mapStateToProps = state => ({
    tarifaPreco: state.getIn([reducer, 'tarifaPreco']),
    messageNotif: state.getIn([reducer]).notifMsg,
    tarifas: state.getIn(['tarifaReducer']).data,
    tiposRecursos: state.getIn(['tipoRecursoReducer']).data
});

const mapDispatchToProps = dispatch => ({
    onFetchTarifas: () => dispatch(tarifaActions.listTarifas()),
    onFetchTiposRecursos: () => dispatch(tipoRecursoActions.listTipoRecursos()),
    onFetchTarifaPreco: (id) => dispatch(actions.fetchTarifaPreco(id)),
    onCreateTarifaPreco: (values) => dispatch(actions.createTarifaPreco(values)),
    onRemoveTarifaPreco: (id) => dispatch(actions.removeTarifaPreco(id, true)),
    onUpdateTarifaPreco: (values) => dispatch(actions.updateTarifaPreco(values)),
    closeNotif: () => dispatch(closeNotifAction),
});

const TarifaPrecoMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(TarifaPreco);

export default (withStyles(styles)(TarifaPrecoMapped));