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

import * as actions from '@/app/redux/actions/tarifaPrecoActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import GenericTable from '@/app/components/Tables/GenericTable';


const TarifasPrecos = props => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idTarifaPreco, setIdTarifaPreco] = useState(null);
    const tableTitle = 'Lista de TarifaPrecos';
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
            name: 'tarifas',
            label: 'Tarifa',
            options: {
                filter: true,
                customBodyRenderLite: (dataIndex) => {
                    let val = props.pagination.data[dataIndex].tarifas.descricao;
                    return val;
                }
            }
        },
        {
            name: 'tipo_recurso',
            label: 'Tipo Recurso',
            options: {
                filter: true,
                customBodyRenderLite: (dataIndex) => {
                    let val = props.pagination.data[dataIndex].tipos_recursos.descricao;
                    return val;
                }
            }
        },
        {
            name: 'valor',
            label: 'Valor',
            options: {
                filter: false,
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
        props.onListTarifaPrecos()
    }, [])


    const handleEdit = (row) => {
        props.onInitUpdateTarifaPreco(props.pagination.data[row]['id']);
    }

    const handleCreate = () => {
        props.onInitCreateTarifaPreco()
    }

    const handleConfirm = (id) => {
        props.onRemoveTarifaPreco(id);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdTarifaPreco(null)
    }

    const handleDelete = (row) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdTarifaPreco(props.pagination.data[row]['id'])
    }

    const title = brand.name + ' - TarifaPreco';
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
                data={props.pagination.data}
                pagination={props.pagination}
                paginate={props.onListTarifaPrecos}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleCreate={handleCreate}
            />
            {deleteDialogOpen ? (<DeleteDialog id={idTarifaPreco} handleConfirm={handleConfirm} />) : null}
        </div>
    );
}

const reducer = 'tarifaPrecoReducer';
const mapStateToProps = state => ({
    pagination: state.getIn([reducer]),
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onListTarifaPrecos: (params) => dispatch(actions.listTarifaPrecos(params)),
    onFormSubmit: (values) => dispatch(actions.createTarifaPreco(values)),
    onRemoveTarifaPreco: (id) => dispatch(actions.removeTarifaPreco(id)),
    onInitCreateTarifaPreco: () => dispatch(actions.initCreateTarifaPreco()),
    onInitUpdateTarifaPreco: (id) => dispatch(actions.initUpdateTarifaPreco(id)),
    closeNotif: () => dispatch(closeNotifAction),
})

const TarifasPrecosMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(TarifasPrecos);


export default (withStyles(styles)(TarifasPrecosMapped));
