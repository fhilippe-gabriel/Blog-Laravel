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
    renderCampoValor, renderTextInput, SelectRedux
} from 'enl-components/Forms/ReduxFormMUI';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { initAction } from 'enl-redux/actions/reduxFormActions';
import { required } from '@/app/utils/formValidation';
import FloatingPanel from '../../Panel/FloatingPanel';
import TipoRecursoForm from '../TiposRecursos/TipoRecursoForm';
import * as actions from '@/app/redux/actions/tipoRecursoActions'
import * as uiActions from '@/app/redux/actions/uiActions'

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

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
    btnAdd: {
        marginTop: 10
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

const TarifaPrecoForm = (props) => {


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

    const formSubmit = (values) => {

        const tipoRecurso = {
            id: values.get('id'),
            numero: values.get('numero'),
            descricao: values.get('descricao'),
            observacao: values.get('observacao'),
        }

        props.onCreateTipoRecurso(tipoRecurso)
    }

    const renderForm = (form) => {
        if (form === 'recurso') {
            return (<TipoRecursoForm modalMode={true} onSubmit={(values) => formSubmit(values)} />)
        }

    }

    const trueBool = true;
    const {
        classes,
        handleSubmit,
        submitting,
        tarifas,
        tiposRecursos,
        onDelete,
        toggleModal,
        initialValues,
    } = props;

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h5" component="h3">
                            Cadastro de Tarifa Preço
                            </Typography>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <Field
                                    name="id"
                                    type="hidden"
                                    component={renderTextInput}

                                />
                            </div>
                            <div>
                                <FormControl className={classes.field} align="left">
                                    <InputLabel align="left" htmlFor="cargo_id">Tarifa</InputLabel>
                                    <Field
                                        required
                                        name="tarifa_id"
                                        id="tarifa_id"
                                        required
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
                            </div>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={5}>
                                    <FormControl className={classes.field} align="left">
                                        <InputLabel align="left" htmlFor="cargo_id">Tipo Recurso</InputLabel>
                                        <Field
                                            required
                                            name="tipo_recurso_id"
                                            id="tipo_recurso_id"
                                            required
                                            component={SelectRedux}
                                            placeholder="Tipo Recurso"
                                            autoWidth={trueBool}
                                        >
                                            {tiposRecursos && tiposRecursos.map(val => (
                                                <MenuItem key={val.id} value={val.id}>
                                                    {val.descricao}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2} sm={1}>
                                    <FormControl className={classes.btnAdd} align="center">
                                        <Fab color="primary" aria-label="add" color="secondary" onClick={() => handleNewEntry("recurso")}>
                                            <AddIcon />
                                        </Fab>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field
                                        name="valor"
                                        component={renderCampoValor}
                                        placeholder="Valor"
                                        label="Valor"
                                        validate={[required]}
                                        required
                                        className={classes.field}
                                    />
                                </Grid>
                            </Grid>
                            <div>
                                <Field
                                    name="observacao"
                                    component={renderTextInput}
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

TarifaPrecoForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
    init: bindActionCreators(initAction, dispatch),
    onCreateTipoRecurso: (values) => dispatch(actions.createTipoRecursoModal(values)),
    toggleModal: () => dispatch(uiActions.toggleModal())
});

const ReduxFormMapped = reduxForm({
    form: 'tarifaPreco',
    enableReinitialize: true,
})(TarifaPrecoForm);

const reducer = 'tarifaPrecoReducer';
const FormInit = connect(
    state => ({
        initialValues: state.getIn([reducer]).tarifaPreco,
        messageNotif: state.getIn([reducer]).notifMsg,
        modal: state.getIn(['ui']).get('modalFormOpen')
    }),
    mapDispatchToProps,
)(ReduxFormMapped);

export default withStyles(styles)(FormInit);
