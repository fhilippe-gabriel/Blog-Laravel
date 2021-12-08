import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { withStyles } from '@material-ui/core/styles';
import { Notification } from 'enl-components';
import styles from 'enl-components/Forms/user-jss';

import DeleteDialog from '../../DialogModal/DeleteDialog';

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from '@material-ui/icons/Edit';

import * as actions from '@/app/redux/actions/clienteActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import GenericTable from '@/app/components/Tables/GenericTable';


const Clientes = props => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idCliente, setIdCliente] = useState(null);
    const tableTitle = 'Lista de Clientes';
    const tableColumns = [
        {
            name: 'id',
            label: 'Id',
            options: {
                filter: false,
                display: false
            }
        },
        {
            name: 'nome_fantasia',
            label: 'Nome Fantasia',
            options: {
                filter: true
            }
        },
        {
            name: 'razao_social',
            label: 'Razão Social',
            options: {
                filter: true,
            }
        },
        {
            name: 'contato_nome',
            label: 'Nome do Contato',
            options: {
                filter: false,
                sort: false,
            }
        },
        {
            name: 'contato_cargo',
            label: 'Cargo',
            options: {
                filter: false,
                sort: false,
            }
        },
        {
            name: "Editar",
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRenderLite: (rowData) => {
                    return (
                        <React.Fragment>
                            <Tooltip title={"Editar"}>
                                <IconButton className={classes.iconButton} onClick={(evt) => {
                                    evt.stopPropagation()
                                    handleEdit(rowData)
                                }}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                        </React.Fragment>
                    );
                }
            }
        },
        {
            name: "Deletar",
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRenderLite: (rowData, rowIndex) => {
                    return (
                        <React.Fragment>
                            <Tooltip title={"Deletar"}>
                                <IconButton className={classes.iconButton} onClick={(evt) => {
                                    evt.stopPropagation()
                                    handleDelete(rowData)
                                }}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </React.Fragment>
                    );
                }
            }
        },
    ]

    useEffect(() => {
        props.onListClientes()
    }, [])


    const handleEdit = (row) => {
        props.onInitUpdateCliente(props.data[row]['id']);
    }

    const handleCreate = () => {
        props.onInitCreateCliente()
    }

    const handleConfirm = (id) => {
        props.onRemoveCliente(id);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdCliente(null)
    }

    const handleDelete = (row) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdCliente(props.data[row]['id'])
    }

    const title = brand.name + ' - Cliente';
    const description = brand.desc;
    const { classes } = props;
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
            <GenericTable title={tableTitle} columns={tableColumns}
                data={props.data}
                pagination={props.pagination}
                paginate={props.paginateClientes}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleCreate={handleCreate}

            />
            {deleteDialogOpen ? (<DeleteDialog id={idCliente} handleConfirm={handleConfirm} />) : null}
        </div>
    );
}

const reducer = 'clienteReducer';
const mapStateToProps = state => ({
    data: state.getIn([reducer]).data,
    pagination: state.getIn([reducer]),
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onListClientes: () => dispatch(actions.listClientes()),
    paginateClientes: (params) => dispatch(actions.paginateClientes(params)),
    onFormSubmit: (values) => dispatch(actions.createCliente(values)),
    onRemoveCliente: (id) => dispatch(actions.removeCliente(id)),
    onInitCreateCliente: () => dispatch(actions.initCreateCliente()),
    onInitUpdateCliente: (id) => dispatch(actions.initUpdateCliente(id)),
    closeNotif: () => dispatch(closeNotifAction),
})

const ClientesMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Clientes);


export default (withStyles(styles)(ClientesMapped));