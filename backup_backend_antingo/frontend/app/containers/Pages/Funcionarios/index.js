import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { withStyles } from '@material-ui/core/styles';
import { Notification } from 'enl-components';
import styles from 'enl-components/Forms/user-jss';
import { format } from 'date-fns'

import DeleteDialog from '../../DialogModal/DeleteDialog';

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from '@material-ui/icons/Edit';

import * as actions from '@/app/redux/actions/funcionarioActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import GenericTable from '@/app/components/Tables/GenericTable';


const Funcionarios = props => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idFuncionario, setIdFuncionario] = useState(null);
    const tableTitle = 'Lista de Funcionários';
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
            name: 'nome',
            label: 'Nome',
            options: {
                filter: true
            }
        },
        {
            name: 'data_admissao',
            label: 'Data de Admissão',
            options: {
                filter: true,
                customBodyRender: (value) => (
                    <p>{format(new Date(value), 'dd/MM/yyyy')}</p>
                )
            }
        },
        {
            name: 'salario',
            label: 'Salário',
            options: {
                sort: false,
                filter: false
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
        props.onListFuncionarios()
    }, [])


    const handleEdit = (row) => {
        props.onInitUpdateFuncionario(props.pagination.data[row]['id']);
    }

    const handleCreate = () => {
        props.onInitCreateFuncionario()
    }

    const handleConfirm = (id) => {
        props.onRemoveFuncionario(id);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdFuncionario(null)
    }

    const handleDelete = (row) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdFuncionario(props.pagination.data[row]['id'])
    }

    const title = brand.name + ' - Funcionario';
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
            {deleteDialogOpen ? (<DeleteDialog id={idFuncionario} handleConfirm={handleConfirm} />) : null}
        </div>
    );
}

const reducer = 'funcionarioReducer';
const mapStateToProps = state => ({
    pagination: state.getIn([reducer]),
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onListFuncionarios: () => dispatch(actions.listFuncionarios()),
    paginate: (params) => dispatch(actions.paginateFuncionarios(params)),
    onFormSubmit: (values) => dispatch(actions.createFuncionario(values)),
    onRemoveFuncionario: (id) => dispatch(actions.removeFuncionario(id)),
    onInitCreateFuncionario: () => dispatch(actions.initCreateFuncionario()),
    onInitUpdateFuncionario: (id) => dispatch(actions.initUpdateFuncionario(id)),
    closeNotif: () => dispatch(closeNotifAction),
})

const FuncionariosMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Funcionarios);


export default (withStyles(styles)(FuncionariosMapped));