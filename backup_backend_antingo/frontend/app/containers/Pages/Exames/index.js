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

import * as actions from '@/app/redux/actions/exameActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import GenericTable from '@/app/components/Tables/GenericTable';


const Exames = props => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idExame, setIdExame] = useState(null);
    const tableTitle = 'Lista de Exames';
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
            name: 'nome_exame',
            label: 'Nome',
            options: {
                filter: true
            }
        },
        {
            name: 'tipo_exame',
            label: 'Tipo',
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
        props.onListExames()
    }, [])


    const handleEdit = (row) => {
        props.onInitUpdateExame(props.pagination.data[row]['id']);
    }

    const handleCreate = () => {
        props.onInitCreateExame()
    }

    const handleConfirm = (id) => {
        props.onRemoveExame(id);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdExame(null)
    }

    const handleDelete = (row) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdExame(props.pagination.data[row]['id'])
    }

    const title = brand.name + ' - Exame';
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
            {deleteDialogOpen ? (<DeleteDialog id={idExame} handleConfirm={handleConfirm} />) : null}
        </div>
    );
}

const reducer = 'exameReducer';
const mapStateToProps = state => ({
    pagination: state.getIn([reducer]),
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onListExames: () => dispatch(actions.listExames()),
    paginate: (params) => dispatch(actions.paginate(params)),
    onFormSubmit: (values) => dispatch(actions.createExame(values)),
    onRemoveExame: (id) => dispatch(actions.removeExame(id)),
    onInitCreateExame: () => dispatch(actions.initCreateExame()),
    onInitUpdateExame: (id) => dispatch(actions.initUpdateExame(id)),
    closeNotif: () => dispatch(closeNotifAction),
})

const ExamesMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Exames);


export default (withStyles(styles)(ExamesMapped));