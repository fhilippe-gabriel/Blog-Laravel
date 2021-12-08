import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { withStyles } from '@material-ui/core/styles';
import { Notification } from 'enl-components';
// import styles from 'enl-components/Forms/user-jss';
import { MaterialDropZone } from 'enl-components';

import DeleteDialog from '../../DialogModal/DeleteDialog';

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import * as actions from '@/app/redux/actions/pontoMarcacaoActions'
import * as ui from '@/app/redux/actions/uiActions'
import * as clienteActions from '@/app/redux/actions/clienteActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import GenericTable from '@/app/components/Tables/GenericTable';
import UploadPonto from './UploadPonto';

function getModalStyle() {
    return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    };
}

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing(50),
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4),
    },
});

const PontosMarcacoes = props => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [idPontoMarcacao, setIdPontoMarcacao] = useState(null);
    const tableTitle = 'Lista de Marcações';
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
            name: 'hora_entrada',
            label: 'Entrada',
            options: {
                filter: true
            }
        },
        {
            name: 'hora_saida',
            label: 'Saída',
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
        props.onListPontosMarcacoes()
        props.onListClientes()
    }, [])


    const handleEdit = (row) => {
        props.onInitUpdatePontoMarcacao(props.pagination.data[row]['id']);
    }

    const handleCreate = () => {
        props.onInitCreatePontoMarcacao()
    }

    const handleConfirm = (id) => {
        props.onRemovePontoMarcacao(id);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdPontoMarcacao(null)
    }

    const handleDelete = (row) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdPontoMarcacao(props.pagination.data[row]['id'])
    }

    const handleImport = () => {
        props.toggleModal(!modalOpen)
    }

    const handleClose = () => {
        props.toggleModal(!modalOpen)
    }

    const upload = (file,cliente_id) => {
        let formData = new FormData();

        formData.append('cliente_id', cliente_id)
        formData.append('csv_file', file[0])

        props.onUpload(formData);
    }

    const title = brand.name + ' - PontoMarcacao';
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
                handleImport={handleImport}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleCreate={handleCreate}

            />
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={props.modal}
                onClose={handleClose}
            >
                <div style={getModalStyle()} className={classes.paper}>
                    <UploadPonto upload={upload} clientes={props.clientes} />
                </div>
            </Modal>
            {deleteDialogOpen ? (<DeleteDialog id={idPontoMarcacao} handleConfirm={handleConfirm} />) : null}
        </div >
    );
}

const reducer = 'pontoMarcacaoReducer';
const mapStateToProps = state => ({
    pagination: state.getIn([reducer]),
    messageNotif: state.getIn([reducer]).notifMsg,
    clientes: state.getIn(['clienteReducer']).data,
    modal: state.getIn(['ui']).get('modalFormOpen')
});

const mapDispatchToProps = dispatch => ({
    onListPontosMarcacoes: () => dispatch(actions.listPontosMarcacoes()),
    paginate: (params) => dispatch(actions.paginate(params)),
    onFormSubmit: (values) => dispatch(actions.createPontoMarcacao(values)),
    onUpload: (values) => dispatch(actions.uploadPontoMarcacao(values)),
    onRemovePontoMarcacao: (id) => dispatch(actions.removePontoMarcacao(id)),
    onInitCreatePontoMarcacao: () => dispatch(actions.initCreatePontoMarcacao()),
    onInitUpdatePontoMarcacao: (id) => dispatch(actions.initUpdatePontoMarcacao(id)),
    closeNotif: () => dispatch(closeNotifAction),
    onListClientes: () => dispatch(clienteActions.listClientes(true)),
    toggleModal: () => dispatch(ui.toggleModal())
})

const PontosMarcacoesMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(PontosMarcacoes);


export default (withStyles(styles)(PontosMarcacoesMapped));
