import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Field, reduxForm, FieldArray } from 'redux-form/immutable';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import {
    SelectRedux,
    renderDatePicker,
    renderCampoValor,
    renderCPF,
    renderTelefone,
    renderTextInput,
    renderRadioGroup
} from 'enl-components/Forms/ReduxFormMUI';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';

import { required, max, shortenThan } from '@/app/utils/formValidation';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from 'enl-components/TabPanel/TabPanel';
import FloatingPanel from '../../Panel/FloatingPanel';
import { initAction, clearAction } from 'enl-redux/actions/reduxFormActions';
import { funcionarioExameForm, funcionarioCertificadoForm } from './FuncionarioFormHelper'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CargoForm from '../Cargos/CargoForm'
import ExameForm from '../Exames/ExameForm'
import CertificadoForm from '../Certificados/CertificadoForm'
import * as cargoActions from '@/app/redux/actions/cargoActions'
import * as exameActions from '@/app/redux/actions/exameActions'
import * as certificadoActions from '@/app/redux/actions/certificadoActions'
import * as uiActions from '@/app/redux/actions/uiActions'
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
        flexGrow: 1,
        padding: 30
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    field: {
        width: '100%',
        // marginBottom: 20
    },
    btnAdd: {
        marginTop: 10
    },
    fieldBasic: {
        width: '100%',
        marginBottom: 20,
        marginTop: 10
    },
    inlineWrap: {
        display: 'flex',
        flexDirection: 'row'
    },
    buttonInit: {
        margin: theme.spacing(4),
        // textAlign: 'center'
    },
});


const FuncionarioForm = props => {

    const [abaAtiva, setAbaAtiva] = useState('funcionario');
    const [formModal, setFormModal] = useState();
    const [openForm, setOpenForm] = useState(false);

    React.useEffect(() => {
        setOpenForm(props.modal)
    }, [props.modal]);

    const handleNewEntry = (form) => {
        props.toggleModal()
        setOpenForm(props.modal)
        setFormModal(renderForm(form))
    }

    const cargoSubmit = (values) => {
        const cargo = {
            cargo: values.get('cargo'),
        }
        props.onCreateCargo(cargo)
    }

    const exameSubmit = (values) => {
        const exame = {
            nome_exame: values.get('nome_exame'),
            tipo_exame: values.get('tipo_exame'),
            validade_meses: values.get('validade_meses'),
            observacao: values.get('observacao'),
        }
        props.onCreateExame(exame)
    }

    const certificadoSubmit = (values) => {
        const certificado = {
            nome_certificado: values.get('nome_certificado'),
            validade_meses: values.get('validade_meses'),
            situacao: values.get('situacao'),
        }
        props.onCreateCertificado(certificado)
    }

    const renderForm = (form) => {
        if (form === 'cargo') {
            return (<CargoForm modalMode={true} onSubmit={(values) => cargoSubmit(values)} />)
        }
        if (form === 'exame') {
            return (<ExameForm modalMode={true} onSubmit={(values) => exameSubmit(values)} />)
        }
        if (form === 'certificado') {
            props.listCertificadoSituacoes()
            return (<CertificadoForm situacoes={props.situacoes}  modalMode={true} onSubmit={(values) => certificadoSubmit(values)} />)
        }
    }
    const handleTabChange = (event, newValue) => {
        setAbaAtiva(newValue);
    }

    const trueBool = true;
    const {
        classes,
        handleSubmit,
        submitting,
        messages,
        cargos,
        closeForm,
        exames,
        intl,
        certificados,
        onDelete,
        branch,
        toggleModal,
        initialValues,
    } = props;

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h5" component="h3">
                            Cadastro de Funcionário
                            </Typography>
                        <Paper className={classes.root}>
                            <Tabs
                                value={abaAtiva}
                                onChange={handleTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                                centered
                            >
                                <Tab label="Funcionário" value="funcionario" />
                                <Tab label="Exames" value="exames" />
                                <Tab label="Certificados" value="certificados" />
                            </Tabs>
                        </Paper>
                        <form onSubmit={handleSubmit}>
                            <TabPanel role="tabpanel" value={abaAtiva} index="funcionario">
                                <Field
                                    name="id"
                                    type="hidden"
                                    component={renderTextInput}
                                />

                                <Grid container spacing={1} justify="flex-start">
                                    <Grid item xs={12} sm={2}>
                                        <Field
                                            name="matricula"
                                            component={renderTextInput}
                                            placeholder="Matrícula"
                                            label="Matrícula"
                                            className={classes.field}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <Field
                                            name="nome"
                                            component={renderTextInput}
                                            placeholder="Nome"
                                            label="Nome"
                                            validate={required}
                                            required
                                            className={classes.field}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={2}>
                                        <Field
                                            name="cpf"
                                            component={renderCPF}
                                            placeholder="CPF"
                                            label="CPF"
                                            validate={[required]}
                                            required
                                            className={classes.field}
                                        />
                                    </Grid>
                                    <Grid item xs={10} sm={7}>
                                        <FormControl className={classes.field} align="left">
                                            <InputLabel align="left" htmlFor="cargo_id">Cargo</InputLabel>
                                            <Field
                                                required
                                                name="cargo_id"
                                                id="cargo_id"
                                                validate={required}
                                                required
                                                component={SelectRedux}
                                                placeholder="Cargo"
                                                autoWidth={trueBool}
                                            >
                                                {cargos && cargos.map(val => (
                                                    <MenuItem key={val.id} value={val.id}>
                                                        {val.cargo}
                                                    </MenuItem>
                                                ))}
                                            </Field>
                                        </FormControl>

                                    </Grid>
                                    <Grid item xs={2} sm={1}>
                                        <FormControl className={classes.btnAdd} align="center">
                                            <Fab color="primary" aria-label="add" color="secondary" onClick={() => handleNewEntry("cargo")}>
                                                <AddIcon />
                                            </Fab>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                {/* <Grid container spacing={1} mt={2}>
                                    <Grid item xs={12} sm={10}>
                                        <Divider variant="" />
                                    </Grid>
                                </Grid> */}
                                <Grid container spacing={1}>
                                    <Grid item xs={3}>
                                        <Field
                                            name="rg"
                                            component={renderTextInput}
                                            placeholder="RG"
                                            label="RG"

                                            className={classes.field}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <Field
                                            name="ctps"
                                            component={renderTextInput}
                                            placeholder="CTPS"
                                            label="CTPS"
                                            required

                                            className={classes.field}
                                            normalize={shortenThan(11)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Field
                                            name="pis"
                                            component={renderTextInput}
                                            placeholder="PIS"
                                            label="PIS"
                                            required

                                            className={classes.field}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={4}>
                                        <Field
                                            name="data_admissao"
                                            component={renderDatePicker}
                                            placeholder="Data de admissão"
                                            label="Data de admissão"
                                            validate={required}
                                            required
                                            className={classes.field}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <Field
                                            name="dia_pagamento"
                                            component={renderTextInput}
                                            type="number"
                                            placeholder="Dia do Pagamento"
                                            label="Dia do Pagamento"
                                            validate={required}
                                            required
                                            className={classes.field}
                                            normalize={max(31)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <Field
                                            name="salario"
                                            component={renderCampoValor}
                                            placeholder="Salário"
                                            label="Salário"
                                            validate={required}
                                            required
                                            className={classes.field}
                                        />
                                    </Grid>


                                </Grid>
                                {/* <Grid container spacing={1}>
                                    <Grid item xs={12} sm={10}>
                                        <Divider variant="middle" />
                                    </Grid>
                                </Grid> */}

                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={2}>
                                        <Field
                                            name="telefone_fixo"
                                            component={renderTelefone}
                                            placeholder="Telefone"
                                            label="Telefone"
                                            required
                                            className={classes.field}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <Field
                                            name="apelido"
                                            component={renderTextInput}
                                            placeholder="Apelido"
                                            label="Apelido"
                                            className={classes.field}
                                        />
                                    </Grid>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={2}>
                                            <Field
                                                name="celular"
                                                component={renderTelefone}
                                                placeholder="Celular"
                                                label="Celular"
                                                className={classes.field}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <Field
                                                name="email"
                                                component={renderTextInput}
                                                placeholder="Email"
                                                label="Email"
                                                className={classes.field}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field name="status" required className={classes.inlineWrap} component={renderRadioGroup}>
                                            <FormControlLabel value="ativo" control={<Radio />} label="Ativo" />
                                            <FormControlLabel value="inativo" control={<Radio />} label="Inativo" />
                                        </Field>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel value={abaAtiva} index="exames">
                                <FieldArray name="exames" classes={classes} exames={exames} handleNewEntry={handleNewEntry} component={funcionarioExameForm} />
                            </TabPanel>
                            <TabPanel value={abaAtiva} index="certificados">
                                <FieldArray name="certificados" classes={classes} certificados={certificados} handleNewEntry={handleNewEntry} component={funcionarioCertificadoForm} />
                            </TabPanel>
                            <Grid item xs={12} sm={10}>
                                <Button variant="contained" color="primary" type="submit" disabled={submitting}>
                                    Salvar
                                    </Button>
                                <Button onClick={() => history.back()} color="secondary" type="button">
                                    Cancelar
                                    </Button>
                                {(initialValues && initialValues.get('id')) ? (
                                    <Button onClick={() => onDelete(initialValues.get('id'))} variant="contained" color="secondary" type="button">
                                        Excluir
                                    </Button>
                                ) : null}
                            </Grid>
                        </form>
                    </Paper>
                </Grid>
                <FloatingPanel title={"Cadastro Auxiliar"} openForm={openForm} closeForm={toggleModal}>
                    {formModal}
                </FloatingPanel>
            </Grid>
        </div >
    );
}

FuncionarioForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
    init: bindActionCreators(initAction, dispatch),
    clear: () => dispatch(clearAction),
    onCreateCargo: (values) => dispatch(cargoActions.createCargoModal(values)),
    onCreateExame: (values) => dispatch(exameActions.createExameModal(values)),
    onCreateCertificado: (values) => dispatch(certificadoActions.createCertificadoModal(values)),
    listCertificadoSituacoes: () => dispatch(certificadoActions.listCertificadoSituacoes()),
    toggleModal: () => dispatch(uiActions.toggleModal())
});

const ReduxFormMapped = reduxForm({
    form: 'funcionario',
    enableReinitialize: true,
})(FuncionarioForm);

const reducer = 'funcionarioReducer';
const FormInit = connect(
    props => ({
        initialValues: props.getIn([reducer]).funcionario,
        messageNotif: props.getIn([reducer]).notifMsg,
        situacoes: props.getIn(['certificadoReducer']).situacoes,
        modal: props.getIn(['ui']).get('modalFormOpen')
    }),
    mapDispatchToProps,
)(ReduxFormMapped);

export default withStyles(styles)(FormInit);
