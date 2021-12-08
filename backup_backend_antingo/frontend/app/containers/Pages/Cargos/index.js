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

import * as actions from '@/app/redux/actions/cargoActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import GenericTable from '@/app/components/Tables/GenericTable';


const Cargos = props => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idCargo, setIdCargo] = useState(null);
    const tableTitle = 'Lista de Cargos';
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
            name: 'cargo',
            label: 'Cargo',
            options: {
                filter: true
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
        props.onListCargos()
    }, [])


    const handleEdit = (row) => {
        props.onInitUpdateCargo(props.pagination.data[row]['id']);
    }

    const handleCreate = () => {
        props.onInitCreateCargo()
    }

    const handleConfirm = (id) => {
        props.onRemoveCargo(id);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdCargo(null)
    }

    const handleDelete = (row) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdCargo(props.pagination.data[row]['id'])
    }

    const title = brand.name + ' - Cargo';
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
            {deleteDialogOpen ? (<DeleteDialog id={idCargo} handleConfirm={handleConfirm} />) : null}
        </div>
    );
}

const reducer = 'cargoReducer';
const mapStateToProps = state => ({
    pagination: state.getIn([reducer]),
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onListCargos: () => dispatch(actions.listCargos()),
    paginate: (params) => dispatch(actions.paginate(params)),
    onFormSubmit: (values) => dispatch(actions.createCargo(values)),
    onRemoveCargo: (id) => dispatch(actions.removeCargo(id)),
    onInitCreateCargo: () => dispatch(actions.initCreateCargo()),
    onInitUpdateCargo: (id) => dispatch(actions.initUpdateCargo(id)),
    closeNotif: () => dispatch(closeNotifAction),
})

const CargosMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Cargos);


export default (withStyles(styles)(CargosMapped));