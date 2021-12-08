import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { Notification } from 'enl-components';
import { withStyles } from '@material-ui/core/styles';

import styles from 'enl-components/Forms/user-jss';

import * as actions from '@/app/redux/actions/certificadoActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import CertificadoForm from './CertificadoForm'
import DeleteDialog from '../../DialogModal/DeleteDialog';

const Certificado = (props) => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idCertificado, setIdCertificado] = useState(null);
    const uid = props.match.params._id;

    useEffect(() => {
        if (props.certificado === undefined
            && uid) {
            props.onFetchCertificado(uid);
        }
        props.listCertificadoSituacoes()
    }, [])

    const formSubmit = (values) => {

        const certificado = {
            id: values.get('id'),
            nome_certificado: values.get('nome_certificado'),
            validade_meses: values.get('validade_meses'),
            situacao: values.get('situacao'),
        }

        if (certificado.id === undefined) {
            props.onCreateCertificado(certificado)
        } else {
            props.onUpdateCertificado(certificado)
        }

    }



    const handleDelete = (id) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdCertificado(id)
    }

    const handleConfirmDelete = (id) => {
        props.onRemoveCertificado(id, true);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdCertificado(null)
    }

    const title = brand.name + ' - Certificado';
    const description = brand.desc;

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
            <CertificadoForm situacoes={props.situacoes} onSubmit={(values) => formSubmit(values)} onDelete={(id) => handleDelete(id)} />
            {deleteDialogOpen ? (<DeleteDialog id={idCertificado} handleConfirm={handleConfirmDelete} />) : null}
        </div>
    );
}

const reducer = 'certificadoReducer';
const mapStateToProps = state => ({
    certificado: state.getIn([reducer, 'certificado']),
    situacoes: state.getIn([reducer]).situacoes,
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onFetchCertificado: (id) => dispatch(actions.fetchCertificado(id)),
    onCreateCertificado: (values) => dispatch(actions.createCertificado(values)),
    onRemoveCertificado: (id) => dispatch(actions.removeCertificado(id, true)),
    onUpdateCertificado: (values) => dispatch(actions.updateCertificado(values)),
    listCertificadoSituacoes: () => dispatch(actions.listCertificadoSituacoes()),
    closeNotif: () => dispatch(closeNotifAction),
});

const CertificadoMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Certificado);

export default (withStyles(styles)(CertificadoMapped));