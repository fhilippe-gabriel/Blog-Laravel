import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { Notification } from 'enl-components';
import { withStyles } from '@material-ui/core/styles';

import styles from 'enl-components/Forms/user-jss';

import * as actions from '@/app/redux/actions/clienteActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import ClienteForm from './ClienteForm'
import DeleteDialog from '../../DialogModal/DeleteDialog';

const Cliente = (props) => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idCliente, setIdCliente] = useState(null);
    const [logo, setLogo] = useState(props.cliente ? props.cliente.logo : '');
    const uid = props.match.params._id;

    useEffect(() => {
        if (props.cliente === undefined
            && uid) {
            props.onFetchCliente(uid);
        }
    }, [])

    const formSubmit = (values) => {
        let formData = new FormData();
        formData.append('id', values.get('id') || '')
        formData.append('cnpj', values.get('cnpj') || '')
        formData.append('razao_social', values.get('razao_social') || '')
        formData.append('nome_fantasia', values.get('nome_fantasia') || '')
        formData.append('contato_cargo', values.get('contato_cargo') || '')
        formData.append('contato_fone', values.get('contato_fone') || '')
        formData.append('contato_nome', values.get('contato_nome') || '')
        formData.append('email', values.get('email') || '')
        formData.append('logo', logo || '')

        const id = values.get('id');

        if (id === undefined) {
            props.onCreateCliente(formData)
        } else {
            props.onUpdateCliente(formData, id)
        }

    }


    const onDrop = (filesVal) => {
        setLogo(filesVal[0]);
    }

    const handleDelete = (id) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdCliente(id)
    }

    const handleConfirmDelete = (id) => {
        props.onRemoveCliente(id, true);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdCliente(null)
    }

    const title = brand.name + ' - Cliente';
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
            <ClienteForm onSubmit={(values) => formSubmit(values)}
                onDelete={(id) => handleDelete(id)}
                imgAvatar={logo}
                onDrop={onDrop} />
            {deleteDialogOpen ? (<DeleteDialog id={idCliente} handleConfirm={handleConfirmDelete} />) : null}
        </div>
    );
}

const reducer = 'clienteReducer';
const mapStateToProps = state => ({
    cliente: state.getIn([reducer, 'cliente']),
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onFetchCliente: (id) => dispatch(actions.fetchCliente(id)),
    onCreateCliente: (values) => dispatch(actions.createCliente(values)),
    onRemoveCliente: (id) => dispatch(actions.removeCliente(id, true)),
    onUpdateCliente: (values, id) => dispatch(actions.updateCliente(values, id)),
    closeNotif: () => dispatch(closeNotifAction),
});

const ClienteMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Cliente);

export default (withStyles(styles)(ClienteMapped));