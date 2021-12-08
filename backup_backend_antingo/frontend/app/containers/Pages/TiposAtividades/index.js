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

import * as actions from '@/app/redux/actions/tipoAtividadeActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import GenericTable from '@/app/components/Tables/GenericTable';


const TiposAtividades = props => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idTipoAtividade, setIdTipoAtividade] = useState(null);
    const tableTitle = 'Lista de TipoAtividades';
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
            name: 'observacao',
            label: 'Observação',
            options: {
                customBodyRender: (val) => {
                    let parentStyle = {
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        boxSizing: 'border-box',
                        display: 'block',
                        width: '100%',
                    };
                    let cellStyle = {
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    };
                    return (
                        <div style={{ position: 'relative', height: '20px' }}>
                            <div style={parentStyle}>
                                <div style={cellStyle}>
                                    {val}
                                </div>
                            </div>
                        </div>
                    );
                }
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
        props.onListTipoAtividades()
    }, [])


    const handleEdit = (row) => {
        props.onInitUpdateTipoAtividade(props.pagination.data[row]['id']);
    }

    const handleCreate = () => {
        props.onInitCreateTipoAtividade()
    }

    const handleConfirm = (id) => {
        props.onRemoveTipoAtividade(id);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdTipoAtividade(null)
    }

    const handleDelete = (row) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdTipoAtividade(props.pagination.data[row]['id'])
    }

    const title = brand.name + ' - TipoAtividade';
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
            {deleteDialogOpen ? (<DeleteDialog id={idTipoAtividade} handleConfirm={handleConfirm} />) : null}
        </div>
    );
}

const reducer = 'tipoAtividadeReducer';
const mapStateToProps = state => ({
    pagination: state.getIn([reducer]),
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onListTipoAtividades: () => dispatch(actions.listTipoAtividades()),
    paginate: (params) => dispatch(actions.paginate(params)),
    onFormSubmit: (values) => dispatch(actions.createTipoAtividade(values)),
    onRemoveTipoAtividade: (id) => dispatch(actions.removeTipoAtividade(id)),
    onInitCreateTipoAtividade: () => dispatch(actions.initCreateTipoAtividade()),
    onInitUpdateTipoAtividade: (id) => dispatch(actions.initUpdateTipoAtividade(id)),
    closeNotif: () => dispatch(closeNotifAction),
})

const TiposAtividadesMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(TiposAtividades);


export default (withStyles(styles)(TiposAtividadesMapped));