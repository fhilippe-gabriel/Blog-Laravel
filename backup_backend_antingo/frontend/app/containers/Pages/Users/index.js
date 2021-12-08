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

import * as actions from '@/app/redux/actions/userActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import GenericTable from '@/app/components/Tables/GenericTable';


const Users = props => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idUser, setIdUser] = useState(null);
    const tableTitle = 'Lista de Usuários';
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
            name: 'name',
            label: 'Nome',
            options: {
                filter: true
            }
        },
        {
            name: 'email',
            label: 'Email',
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
        props.onListUsers()
    }, [])


    const handleEdit = (row) => {
        props.onInitUpdateUser(props.data[row]['id']);
    }

    const handleCreate = () => {
        props.onInitCreateUser()
    }

    const handleConfirm = (id) => {
        props.onRemoveUser(id);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdUser(null)
    }

    const handleDelete = (row) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdUser(props.data[row]['id'])
    }

    const title = brand.name + ' - Usuários';
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
            {deleteDialogOpen ? (<DeleteDialog id={idUser} handleConfirm={handleConfirm} />) : null}
        </div>
    );
}

const reducer = 'userReducer';
const mapStateToProps = state => ({
    data: state.getIn([reducer]).data,
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onListUsers: () => dispatch(actions.listUsers()),
    onFormSubmit: (values) => dispatch(actions.createUser(values)),
    onRemoveUser: (id) => dispatch(actions.removeUser(id)),
    onInitCreateUser: () => dispatch(actions.initCreateUser()),
    onInitUpdateUser: (id) => dispatch(actions.initUpdateUser(id)),
    closeNotif: () => dispatch(closeNotifAction),
})

const UsersMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Users);


export default (withStyles(styles)(UsersMapped));