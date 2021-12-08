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

import * as actions from '@/app/redux/actions/jornadaActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import GenericTable from '@/app/components/Tables/GenericTable';


const Jornadas = props => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idJornada, setIdJornada] = useState(null);
    const tableTitle = 'Lista de Jornadas';
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
            name: 'hora_inicio',
            label: 'Hora Início',
            options: {
                filter: true
            }
        },
        {
            name: 'hora_fim',
            label: 'Hora Fim',
            options: {
                filter: true,
            }
        },
        {
            name: 'percentual',
            label: 'Percentual',
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
        props.onListJornadas()
    }, [])


    const handleEdit = (row) => {
        props.onInitUpdateJornada(props.data[row]['id']);
    }

    const handleCreate = () => {
        props.onInitCreateJornada()
    }

    const handleConfirm = (id) => {
        props.onRemoveJornada(id);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdJornada(null)
    }

    const handleDelete = (row) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdJornada(props.data[row]['id'])
    }

    const title = brand.name + ' - Jornada';
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
            {deleteDialogOpen ? (<DeleteDialog id={idJornada} handleConfirm={handleConfirm} />) : null}
        </div>
    );
}

const reducer = 'jornadaReducer';
const mapStateToProps = state => ({
    data: state.getIn([reducer]).data,
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onListJornadas: () => dispatch(actions.listJornadas()),
    onFormSubmit: (values) => dispatch(actions.createJornada(values)),
    onRemoveJornada: (id) => dispatch(actions.removeJornada(id)),
    onInitCreateJornada: () => dispatch(actions.initCreateJornada()),
    onInitUpdateJornada: (id) => dispatch(actions.initUpdateJornada(id)),
    closeNotif: () => dispatch(closeNotifAction),
})

const JornadasMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Jornadas);


export default (withStyles(styles)(JornadasMapped));