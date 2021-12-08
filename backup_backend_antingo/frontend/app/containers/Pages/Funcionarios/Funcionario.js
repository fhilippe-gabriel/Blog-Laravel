import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { Notification } from 'enl-components';
import { withStyles } from '@material-ui/core/styles';

import styles from 'enl-components/Forms/user-jss';

import * as actions from '@/app/redux/actions/funcionarioActions'
import * as cargoActions from '@/app/redux/actions/cargoActions'
import * as certificadoActions from '@/app/redux/actions/certificadoActions'
import * as exameActions from '@/app/redux/actions/exameActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import FuncionarioForm from './FuncionarioForm'
import DeleteDialog from '../../DialogModal/DeleteDialog';

const Funcionario = (props) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idFuncionario, setIdFuncionario] = useState(null);
    const uid = props.match.params._id;

    useEffect(() => {
        if (props.funcionario === undefined
            && uid) {
            props.onFetchFuncionario(uid);
        }
        props.onFetchCargos();
        props.onFetchExames();
        props.onFetchCertificados();
    }, [])

    const formSubmit = (values) => {

        const examesSubmit = getExamesSubmitArray(values);
        const certificadosSubmit = getCertificadosSubmitArray(values);

        const funcionario = {
            id: values.get('id'),
            cpf: values.get('cpf'),
            nome: values.get('nome'),
            email: values.get('email'),
            apelido: values.get('apelido'),
            matricula: values.get('matricula'),
            celular: values.get('celular'),
            telefone_fixo: values.get('telefone_fixo'),
            pis: values.get('pis'),
            ctps: values.get('ctps'),
            rg: values.get('rg'),
            salario: values.get('salario') ? (values.get('salario').replace(".", "").replace(",", ".")) : '',
            status: values.get('status'),
            dia_pagamento: values.get('dia_pagamento'),
            cargo_id: values.get('cargo_id'),
            data_admissao: values.get('data_admissao'),
            exames: examesSubmit,
            certificados: certificadosSubmit,
        }

        if (funcionario.id === undefined) {
            props.onCreateFuncionario(funcionario)
        } else {
            props.onUpdateFuncionario(funcionario)
        }

    }

    const handleDelete = (id) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdFuncionario(id)
    }

    const handleConfirmDelete = (id) => {
        props.onRemoveFuncionario(id, true);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdFuncionario(null)
    }

    const title = brand.name + ' - Funcionario';
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
            <FuncionarioForm onSubmit={(values) => formSubmit(values)} onDelete={(id) => handleDelete(id)}
                cargos={props.cargos} certificados={props.certificados} exames={props.exames} />
            {deleteDialogOpen ? (<DeleteDialog id={idFuncionario} handleConfirm={handleConfirmDelete} />) : null}
        </div>
    );
}

const reducer = 'funcionarioReducer';
const mapStateToProps = state => ({
    funcionario: state.getIn([reducer, 'funcionario']),
    cargos: state.getIn(['cargoReducer']).data,
    exames: state.getIn(['exameReducer']).data,
    certificados: state.getIn(['certificadoReducer']).data,
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onFetchFuncionario: (id) => dispatch(actions.fetchFuncionario(id)),
    onCreateFuncionario: (values) => dispatch(actions.createFuncionario(values)),
    onRemoveFuncionario: (id) => dispatch(actions.removeFuncionario(id, true)),
    onUpdateFuncionario: (values) => dispatch(actions.updateFuncionario(values)),
    onFetchCargos: () => dispatch(cargoActions.listCargos(true)),
    onFetchExames: () => dispatch(exameActions.listExames(true)),
    onFetchCertificados: () => dispatch(certificadoActions.listCertificados(true)),
    closeNotif: () => dispatch(closeNotifAction),
});

const FuncionarioMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(Funcionario);

export default (withStyles(styles)(FuncionarioMapped));

function getExamesSubmitArray(values) {
    const exames = values.get('exames');
    if (exames) {
        const examesPivot = exames.map((exame) => exame.get('pivot'));
        const examesSubmit = examesPivot.map((exame => {
            if (exame) {
                return { 'exame_id': exame.get('exame_id'), 'data_realizacao': exame.get('data_realizacao') };
            }

        }));
        return examesSubmit;
    }
}

function getCertificadosSubmitArray(values) {
    const certificados = values.get('certificados');
    if (certificados) {
        const certificadosPivot = certificados.map((certificado) => certificado.get('pivot'));
        const certificadosSubmit = certificadosPivot.map((certificado => {
            if (certificado) {
                return { 'certificado_id': certificado.get('certificado_id'), 'data_realizacao': certificado.get('data_realizacao') };
            }

        }));
        return certificadosSubmit;
    }
}
