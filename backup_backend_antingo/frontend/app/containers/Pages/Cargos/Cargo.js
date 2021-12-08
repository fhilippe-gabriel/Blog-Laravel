import React, { useState,useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { Notification } from 'enl-components';
import { withStyles } from '@material-ui/core/styles';

import styles from 'enl-components/Forms/user-jss';

import * as actions from '@/app/redux/actions/cargoActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import CargoForm from './CargoForm'
import DeleteDialog from '../../DialogModal/DeleteDialog';

const Cargo = (props) => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idCargo, setIdCargo] = useState(null);
    const uid = props.match ? props.match.params._id : null;
    
    useEffect(() => {
        if (props.cargo === undefined
            && uid) {
            props.onFetchCargo(uid);
        }
    }, [])

    const formSubmit = (values) => {

        const cargo = {
            id: values.get('id'),
            cargo: values.get('cargo'),
            // descricao: values.get('descricao'),
            // detalhes: values.get('detalhes'),
        }

        if (cargo.id === undefined) {
            props.onCreateCargo(cargo)
        } else {
            props.onUpdateCargo(cargo)
        }

    }


    const handleDelete = (id) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdCargo(id)
    }

    const handleConfirmDelete = (id) => {
        props.onRemoveCargo(id, true);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdCargo(null)
    }

    const title = brand.name + ' - Cargo';
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
            <CargoForm onSubmit={(values) => formSubmit(values)} onDelete={(id) => handleDelete(id)} />
            {deleteDialogOpen ? (<DeleteDialog id={idCargo} handleConfirm={handleConfirmDelete} />) : null}
        </div>
    );
}

const reducer = 'cargoReducer';
const mapStateToProps = state => ({
    cargo: state.getIn([reducer, 'cargo']),
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onFetchCargo: (id) => dispatch(actions.fetchCargo(id)),
    onCreateCargo: (values) => dispatch(actions.createCargo(values)),
    onRemoveCargo: (id) => dispatch(actions.removeCargo(id, true)),
    onUpdateCargo: (values) => dispatch(actions.updateCargo(values)),
    closeNotif: () => dispatch(closeNotifAction),
});

const CargoMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Cargo);

export default (withStyles(styles)(CargoMapped));