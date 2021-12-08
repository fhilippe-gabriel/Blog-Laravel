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

import * as actions from '@/app/redux/actions/tipoFaturamentoActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import GenericTable from '@/app/components/Tables/GenericTable';


const TipoFaturamentos = props => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idTipoFaturamento, setIdTipoFaturamento] = useState(null);
    const tableTitle = 'Lista de Tipos Faturamentos';
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
            name: 'numero',
            label: 'numero',
            options: {
                filter: true
            }
        },
        {
            name: 'descricao',
            label: 'Descrição',
            options: {
                filter: true,
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
        props.onListTipoFaturamentos()
    }, [])


    const handleEdit = (row) => {
        props.onInitUpdateTipoFaturamento(props.data[row]['id']);
    }

    const handleCreate = () => {
        props.onInitCreateTipoFaturamento()
    }

    const handleConfirm = (id) => {
        props.onRemoveTipoFaturamento(id);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdTipoFaturamento(null)
    }

    const handleDelete = (row) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdTipoFaturamento(props.data[row]['id'])
    }

    const title = brand.name + ' - TipoFaturamento';
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
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleCreate={handleCreate}

            />
            {deleteDialogOpen ? (<DeleteDialog id={idTipoFaturamento} handleConfirm={handleConfirm} />) : null}
        </div>
    );
}

const reducer = 'tipoFaturamentoReducer';
const mapStateToProps = state => ({
    data: state.getIn([reducer]).data,
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onListTipoFaturamentos: () => dispatch(actions.listTipoFaturamentos()),
    onFormSubmit: (values) => dispatch(actions.createTipoFaturamento(values)),
    onRemoveTipoFaturamento: (id) => dispatch(actions.removeTipoFaturamento(id)),
    onInitCreateTipoFaturamento: () => dispatch(actions.initCreateTipoFaturamento()),
    onInitUpdateTipoFaturamento: (id) => dispatch(actions.initUpdateTipoFaturamento(id)),
    closeNotif: () => dispatch(closeNotifAction),
})

const TipoFaturamentosMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(TipoFaturamentos);


export default (withStyles(styles)(TipoFaturamentosMapped));