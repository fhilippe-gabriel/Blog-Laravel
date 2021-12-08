import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { Notification } from 'enl-components';
import { withStyles } from '@material-ui/core/styles';

import styles from 'enl-components/Forms/user-jss';

import * as actions from '@/app/redux/actions/equipamentoActions'
import * as tipoRecursoActions from '@/app/redux/actions/tipoRecursoActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import EquipamentoForm from './EquipamentoForm'
import DeleteDialog from '../../DialogModal/DeleteDialog';

const Equipamento = (props) => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idEquipamento, setIdEquipamento] = useState(null);
    const uid = props.match.params._id;

    useEffect(() => {
        if (props.equipamento === undefined
            && uid) {
            props.onFetchEquipamento(uid);
        }
        if (!props.tipos_recursos.length) {
            props.onFetchTiposRecursos();
        }
    }, [])

    const formSubmit = (values) => {

        const equipamento = {
            id: values.get('id'),
            numero: values.get('numero'),
            nome_recurso: values.get('nome_recurso'),
            observacao: values.get('observacao'),
            tipo_recurso_id: values.get('tipo_recurso_id'),
        }

        if (equipamento.id === undefined) {
            props.onCreateEquipamento(equipamento)
        } else {
            props.onUpdateEquipamento(equipamento)
        }

    }


    const handleDelete = (id) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdEquipamento(id)
    }

    const handleConfirmDelete = (id) => {
        props.onRemoveEquipamento(id, true);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdEquipamento(null)
    }

    const title = brand.name + ' - Equipamento';
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
            <EquipamentoForm onSubmit={(values) => formSubmit(values)}
                tipos_recursos={props.tipos_recursos} onDelete={(id) => handleDelete(id)} />
            {deleteDialogOpen ? (<DeleteDialog id={idEquipamento} handleConfirm={handleConfirmDelete} />) : null}
        </div>
    );
}

const reducer = 'equipamentoReducer';
const mapStateToProps = state => ({
    equipamento: state.getIn([reducer, 'equipamento']),
    messageNotif: state.getIn([reducer]).notifMsg,
    tipos_recursos: state.getIn(['tipoRecursoReducer']).data,
});

const mapDispatchToProps = dispatch => ({
    onFetchEquipamento: (id) => dispatch(actions.fetchEquipamento(id)),
    onCreateEquipamento: (values) => dispatch(actions.createEquipamento(values)),
    onRemoveEquipamento: (id) => dispatch(actions.removeEquipamento(id, true)),
    onUpdateEquipamento: (values) => dispatch(actions.updateEquipamento(values)),
    onFetchTiposRecursos: () => dispatch(tipoRecursoActions.listTipoRecursos()),
    closeNotif: () => dispatch(closeNotifAction),
});

const EquipamentoMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Equipamento);

export default (withStyles(styles)(EquipamentoMapped));