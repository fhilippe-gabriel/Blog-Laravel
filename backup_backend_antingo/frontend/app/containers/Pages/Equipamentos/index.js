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

import * as actions from '@/app/redux/actions/equipamentoActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import GenericTable from '@/app/components/Tables/GenericTable';


const Equipamentos = props => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idEquipamento, setIdEquipamento] = useState(null);
    const tableTitle = 'Lista de Equipamentos';
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
            name: 'nome_recurso',
            label: 'Nome',
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
        props.onListEquipamentos()
    }, [])


    const handleEdit = (row) => {
        props.onInitUpdateEquipamento(props.pagination.data[row]['id']);
    }

    const handleCreate = () => {
        props.onInitCreateEquipamento()
    }

    const handleConfirm = (id) => {
        props.onRemoveEquipamento(id);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdEquipamento(null)
        props.onListEquipamentos()
    }

    const handleDelete = (row) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdEquipamento(props.pagination.data[row]['id'])
    }

    const title = brand.name + ' - Equipamento';
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
                paginate={props.paginate}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleCreate={handleCreate}

            />
            {deleteDialogOpen ? (<DeleteDialog id={idEquipamento} handleConfirm={handleConfirm} />) : null}
        </div>
    );
}

const reducer = 'equipamentoReducer';
const mapStateToProps = state => ({
    pagination: state.getIn([reducer]),
    messageNotif: state.getIn([reducer]).notifMsg,
});

const mapDispatchToProps = dispatch => ({
    onListEquipamentos: () => dispatch(actions.listEquipamentos()),
    paginate: (params) => dispatch(actions.paginateEquipamentos(params)),
    onFormSubmit: (values) => dispatch(actions.createEquipamento(values)),
    onRemoveEquipamento: (id) => dispatch(actions.removeEquipamento(id)),
    onInitCreateEquipamento: () => dispatch(actions.initCreateEquipamento()),
    onInitUpdateEquipamento: (id) => dispatch(actions.initUpdateEquipamento(id)),
    closeNotif: () => dispatch(closeNotifAction),
})

const EquipamentosMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Equipamentos);


export default (withStyles(styles)(EquipamentosMapped));