import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Field, reduxForm } from 'redux-form/immutable';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import {
    SelectRedux,
    renderDatePicker,
    renderTextInput,
    TextFieldRedux,
} from 'enl-components/Forms/ReduxFormMUI';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { initAction } from 'enl-redux/actions/reduxFormActions';
import { required, max } from '@/app/utils/formValidation';
import FloatingPanel from '../../Panel/FloatingPanel';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import TarifaForm from '../Tarifas/TarifaForm'
import * as tarifaActions from '@/app/redux/actions/tarifaActions'
import * as uiActions from '@/app/redux/actions/uiActions'

const styles = theme => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
        flexGrow: 1,
        padding: 30
    },
    btnAdd: {
        marginTop: 10
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    field: {
        width: '100%',
        marginBottom: 20
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

const AtividadeForm = props => {

    const [formModal, setFormModal] = useState([]);
    const [openForm, setOpenForm] = useState(false);

    useEffect(() => {
        setOpenForm(props.modal)
    }, [props.modal]);

    const handleNewEntry = (form) => {
        props.toggleModal()
        setOpenForm(props.modal)
        setFormModal(renderForm(form))
    }

    const tarifaSubmit = (values) => {
        const tarifa = {
            id: values.get('id'),
            descricao: values.get('descricao'),
        }
        props.onCreateTarifa(tarifa)
    }

    const renderForm = (form) => {
        if (form === 'tarifa') {
            return (<TarifaForm modalMode={true} onSubmit={(values) => tarifaSubmit(values)} />)
        }
        if (form === 'exame') {
            return (<ExameForm modalMode={true} onSubmit={(values) => exameSubmit(values)} />)
        }
        if (form === 'certificado') {
            props.listCertificadoSituacoes()
            return (<CertificadoForm situacoes={props.situacoes} modalMode={true} onSubmit={(values) => certificadoSubmit(values)} />)
        }
    }

    const trueBool = true;
    const {
        classes,
        handleSubmit,
        submitting,
        responsaveis,
        tarifas,
        projetos,
        clientes,
        tiposFaturamentos,
        tiposAtividades,
        onDelete,
        initialValues,
        toggleModal,
        handleClienteSelect
    } = props;
    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h5" component="h3">
                            Cadastro de Atividades
                            </Typography>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <Field
                                    name="id"
                                    type="hidden"
                                    component={renderTextInput}

                                />
                            </div>
                            <Grid item xs={12} sm={12}>
                                <FormControl className={classes.field} align="left">
                                    <InputLabel align="left" htmlFor="cliente_id">Cliente</InputLabel>
                                    <Field
                                        id="cliente_id"
                                        name="cliente_id"
                                        component={SelectRedux}
                                        onChange={handleClienteSelect}
                                        placeholder="Cliente"
                                        autoWidth={trueBool}
                                    >
                                        {clientes && clientes.map(val => (
                                            <MenuItem key={val.id} value={val.id}>
                                                {val.nome_fantasia}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControl className={classes.field} align="left">
                                    <InputLabel align="left" htmlFor="cargo_id">Projeto</InputLabel>
                                    <Field
                                        required
                                        name="projeto_id"
                                        id="projeto_id"
                                        component={SelectRedux}
                                        placeholder="Projeto"
                                        autoWidth={trueBool}
                                    >
                                        {projetos && projetos.map(val => (
                                            <MenuItem key={val.id} value={val.id}>
                                                {val.descricao}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                </FormControl>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={3}>
                                    <Field
                                        name="numero"
                                        component={renderTextInput}
                                        placeholder="Número"
                                        label="Número"
                                        validate={[required]}
                                        required

                                        className={classes.field}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <Field
                                        name="descricao"
                                        component={renderTextInput}
                                        placeholder="Descrição"
                                        label="Descrição"
                                        validate={[required]}
                                        required

                                        className={classes.field}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        name="data_inicio"
                                        component={renderDatePicker}
                                        placeholder="Data de Início"
                                        label="Data de Início"
                                        validate={[required]}
                                        required
                                        className={classes.field}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        name="data_termino"
                                        component={renderDatePicker}
                                        placeholder="Data de Término"
                                        label="Data de Término"
                                        validate={[required]}
                                        required
                                        className={classes.field}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={4}>
                                    <Field
                                        name="horas_previstas"
                                        component={renderTextInput}
                                        type="number"
                                        placeholder="Horas Previstas"
                                        label="Horas Previstas"
                                        validate={[required]}
                                        required
                                        className={classes.field}
                                        normalize={max(1000)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <FormControl className={classes.field} align="left">
                                        <InputLabel align="left" htmlFor="cargo_id">Tipo Atividade</InputLabel>
                                        <Field
                                            required
                                            name="tipo_atividade_id"
                                            id="tipo_atividade_id"
                                            component={SelectRedux}
                                            placeholder="Tipo"
                                            validate={[required]}
                                            required
                                            autoWidth={trueBool}
                                        >
                                            {tiposAtividades && tiposAtividades.map(val => (
                                                <MenuItem key={val.id} value={val.id}>
                                                    {val.descricao}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>

                                <Grid item xs={12} sm={4}>
                                    <Field
                                        name="horas_realizadas"
                                        component={renderTextInput}
                                        type="number"
                                        placeholder="Horas Realizadas"
                                        label="Horas Realizadas"
                                        validate={[required]}
                                        required

                                        className={classes.field}
                                        normalize={max(1000)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={7}>
                                    <FormControl className={classes.field} align="left">
                                        <InputLabel align="left" htmlFor="cargo_id">Tarifa</InputLabel>
                                        <Field
                                            required
                                            name="tarifa_id"
                                            id="tarifa_id"
                                            component={SelectRedux}
                                            placeholder="Tarifa"
                                            autoWidth={trueBool}
                                        >
                                            {tarifas && tarifas.map(val => (
                                                <MenuItem key={val.id} value={val.id}>
                                                    {val.descricao}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2} sm={1}>
                                    <FormControl className={classes.btnAdd} align="center">
                                        <Fab color="primary" aria-label="add" color="secondary" onClick={() => handleNewEntry("tarifa")}>
                                            <AddIcon />
                                        </Fab>
                                    </FormControl>
                                </Grid>

                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={4}>
                                    <Field
                                        name="quantidade_dias"
                                        component={renderTextInput}
                                        type="number"
                                        placeholder="Dias"
                                        label="Quantidade de dias"
                                        validate={[required]}
                                        required
                                        className={classes.field}
                                        normalize={max(1000)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <FormControl className={classes.field} align="left">
                                        <InputLabel align="left" htmlFor="cargo_id">Tipo de Faturamento</InputLabel>
                                        <Field
                                            required
                                            name="tipo_faturamento_id"
                                            id="tipo_faturamento_id"
                                            component={SelectRedux}
                                            placeholder="Tipo Faturamento"
                                            autoWidth={trueBool}
                                            validate={[required]}
                                            required
                                        >
                                            {tiposFaturamentos && tiposFaturamentos.map(val => (
                                                <MenuItem key={val.id} value={val.id}>
                                                    {val.descricao}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={12}>
                                    <FormControl className={classes.field} align="left">
                                        <InputLabel align="left" htmlFor="cargo_id">Responsável</InputLabel>
                                        <Field
                                            required
                                            name="responsavel_id"
                                            id="responsavel_id"
                                            component={SelectRedux}
                                            placeholder="Responsável"
                                            autoWidth={trueBool}
                                        >
                                            {responsaveis && responsaveis.map(val => (
                                                <MenuItem key={val.id} value={val.id}>
                                                    {val.nome}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>

                            </Grid>
                            <div>
                                <Field
                                    name="observacao"
                                    component={TextFieldRedux}
                                    placeholder="Observação"
                                    label="Observação"
                                    multiline={trueBool}
                                    rows={4}

                                    className={classes.field}
                                />
                            </div>
                            <div className={classes.root}>
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
                            </div>
                        </form>
                    </Paper>
                    <FloatingPanel title={"Cadastro Auxiliar"}
                        openForm={openForm}
                        closeForm={toggleModal}
                        children={formModal}
                        branch={"atividade"}>
                    </FloatingPanel>
                </Grid>
            </Grid>
        </div>
    );
}
AtividadeForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
    init: bindActionCreators(initAction, dispatch),
    onCreateTarifa: (values) => dispatch(tarifaActions.createTarifaModal(values)),
    toggleModal: () => dispatch(uiActions.toggleModal())
});

const ReduxFormMapped = reduxForm({
    form: 'atividade',
    enableReinitialize: true,
})(AtividadeForm);

const reducer = 'atividadeReducer';
const FormInit = connect(
    state => ({
        initialValues: state.getIn([reducer]).atividade,
        messageNotif: state.getIn([reducer]).notifMsg,
        modal: state.getIn(['ui']).get('modalFormOpen')
    }),
    mapDispatchToProps,
)(ReduxFormMapped);

export default withStyles(styles)(FormInit);
