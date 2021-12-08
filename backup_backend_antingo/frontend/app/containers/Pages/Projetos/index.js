import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { withStyles } from '@material-ui/core/styles';
import { Notification } from 'enl-components';
import { format } from 'date-fns'
import styles from 'enl-components/Forms/user-jss';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from '@material-ui/icons/Edit';
import DeleteDialog from '../../DialogModal/DeleteDialog';
import currencyFormatter from '@/app/utils/currencyFormatter'
import * as actions from '@/app/redux/actions/projetoActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import GenericTable from '@/app/components/Tables/GenericTable';


const Projetos = props => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idProjeto, setIdProjeto] = useState(null);
    const tableTitle = 'Lista de Projetos';
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
            name: 'descricao',
            label: 'Descrição',
            options: {
                filter: true
            }
        },
        {
            name: 'local',
            label: 'Local',
            options: {
                filter: true,
            }
        },
        {
            name: 'valor',
            label: 'Valor',
            options: {
                filter: true,
                customBodyRender: (value) => (
                    <p>{currencyFormatter(value, true)}</p>
                )
            }
        },
        {
            name: 'data_inicio',
            label: 'Data início',
            options: {
                filter: true,
                customBodyRender: (value) => (
                    <p>{format(new Date(value), 'dd/MM/yyyy')}</p>
                )
            },
        },
        {
            name: 'data_fim',
            label: 'Data fim',
            options: {
                filter: true,
                customBodyRender: (value) => (
                    <p>{format(new Date(value), 'dd/MM/yyyy')}</p>
                )
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
                customBodyRenderLite: (rowData) => {
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
        props.onListProjetos();
    }, [])


    const handleEdit = (row) => {
        props.initUpdateProjeto(props.pagination.data[row]['id']);
    }

    const handleCreate = () => {
        props.initCreateProjeto()
    }

    const handleConfirm = (id) => {
        props.onRemoveProjeto(id);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdProjeto(null)
    }

    const handleDelete = (row) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdProjeto(props.pagination.data[row]['id'])
    }

    const title = brand.name + ' - Projeto';
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
            {deleteDialogOpen ? (<DeleteDialog id={idProjeto} handleConfirm={handleConfirm} />) : null}
        </div>
    );
}

const reducer = 'projetoReducer';
const mapStateToProps = state => ({
    pagination: state.getIn([reducer]),
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onListProjetos: () => dispatch(actions.listProjetos()),
    paginate: (params) => dispatch(actions.paginateProjetos(params)),
    onFetchProjeto: (id) => dispatch(actions.fetchProjeto(id)),
    onFormSubmit: (values) => dispatch(actions.createProjeto(values)),
    onRemoveProjeto: (id) => dispatch(actions.removeProjeto(id)),
    initCreateProjeto: () => dispatch(actions.initCreateProjeto()),
    initUpdateProjeto: (id) => dispatch(actions.initUpdateProjeto(id)),
    closeNotif: () => dispatch(closeNotifAction),
})

const ProjetosMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Projetos);


export default (withStyles(styles)(ProjetosMapped));