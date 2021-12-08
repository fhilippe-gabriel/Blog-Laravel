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

import * as actions from '@/app/redux/actions/atividadeActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import GenericTable from '@/app/components/Tables/GenericTable';


const Atividades = props => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idAtividade, setIdAtividade] = useState(null);
    const tableTitle = 'Lista de Atividades';
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
            label: 'Número',
            options: {
                filter: false,
                sort: false
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
        if (!props.data.length) {
            props.onListAtividades()
        }
    }, [])


    const handleEdit = (row) => {
        props.onInitUpdateAtividade(props.data[row]['id']);
    }

    const handleCreate = () => {
        props.onInitCreateAtividade()
    }

    const handleConfirm = (id) => {
        props.onRemoveAtividade(id);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdAtividade(null)
    }

    const handleDelete = (row) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdAtividade(props.data[row]['id'])
    }

    const title = brand.name + ' - Atividade';
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
                paginate={props.paginateAtividades}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleCreate={handleCreate}

            />
            {deleteDialogOpen ? (<DeleteDialog id={idAtividade} handleConfirm={handleConfirm} />) : null}
        </div>
    );
}

const reducer = 'atividadeReducer';
const mapStateToProps = state => ({
    data: state.getIn([reducer]).data,
    pagination: state.getIn([reducer]),
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onListAtividades: () => dispatch(actions.listAtividades()),
    paginateAtividades: (params) => dispatch(actions.paginateAtividades(params)),
    onFormSubmit: (values) => dispatch(actions.createAtividade(values)),
    onRemoveAtividade: (id) => dispatch(actions.removeAtividade(id)),
    onInitCreateAtividade: () => dispatch(actions.initCreateAtividade()),
    onInitUpdateAtividade: (id) => dispatch(actions.initUpdateAtividade(id)),
    closeNotif: () => dispatch(closeNotifAction),
})

const AtividadesMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Atividades);


export default (withStyles(styles)(AtividadesMapped));