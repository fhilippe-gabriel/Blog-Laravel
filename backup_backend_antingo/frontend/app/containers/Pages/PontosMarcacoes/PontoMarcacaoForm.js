import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Field, reduxForm } from 'redux-form/immutable';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import { initAction, clearAction } from 'enl-redux/actions/reduxFormActions';
import {
    renderTextInput, SelectRedux, renderDatePicker
} from 'enl-components/Forms/ReduxFormMUI';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { required } from '@/app/utils/formValidation';


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

class PontoMarcacaoForm extends Component {

    render() {
        const trueBool = true;
        const {
            classes,
            handleSubmit,
            submitting,
            onDelete,
            funcionarios,
            clientes,
            initialValues,
            modalMode
        } = this.props;
        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant="h5" component="h3">
                                Cadastro de Marcações de Ponto
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <Field
                                        name="id"
                                        type="hidden"
                                        component={renderTextInput}
                                        ref={this.saveRef}
                                    />
                                </div>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={10}>
                                        <FormControl className={classes.field} align="left">
                                            <InputLabel align="left" htmlFor="cliente_id">Cliente</InputLabel>
                                            <Field
                                                id="cliente_id"
                                                name="cliente_id"
                                                component={SelectRedux}
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
                                    <Grid item xs={12} sm={2}>
                                        <Field
                                            name="data_ponto"
                                            component={renderDatePicker}
                                            placeholder="Data"
                                            label="Data"
                                            type="time"
                                            validate={[required]}
                                            required
                                            ref={this.saveRef}
                                            className={classes.field}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={12}>
                                        <FormControl className={classes.field} align="left">
                                            <InputLabel align="left" htmlFor="situacao">Funcionário</InputLabel>
                                            <Field
                                                required
                                                name="funcionario_id"
                                                id="funcionario_id"
                                                component={SelectRedux}
                                                validate={[required]}
                                                required
                                                placeholder="Funcionário"
                                                autoWidth={trueBool}
                                            >
                                                {funcionarios && funcionarios.map(val => (
                                                    <MenuItem key={val.id} value={val.id}>
                                                        {val.nome}
                                                    </MenuItem>
                                                ))}
                                            </Field>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={4}>
                                        <Field
                                            name="hora_entrada"
                                            component={renderTextInput}
                                            placeholder="Hora entrada"
                                            label="Hora entrada"
                                            type="time"
                                            validate={[required]}
                                            required
                                            ref={this.saveRef}
                                            className={classes.field}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Field
                                            name="hora_saida"
                                            component={renderTextInput}
                                            placeholder="Hora saída"
                                            label="Hora entrada"
                                            type="time"
                                            label="Hora saída"
                                            validate={[required]}
                                            required
                                            ref={this.saveRef}
                                            className={classes.field}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Field
                                            name="quantidade_horas"
                                            component={renderTextInput}
                                            placeholder="Quantidade de Horas"
                                            label="Quantidade de Horas"
                                            type="number"
                                            validate={[required]}
                                            required
                                            ref={this.saveRef}
                                            className={classes.field}
                                        />
                                    </Grid>
                                </Grid>

                                <div className={classes.root}>
                                    <Button variant="contained" color="primary" type="submit" disabled={submitting}>
                                        Salvar
                                    </Button>
                                    {(!modalMode) ? (
                                        <Button onClick={() => history.back()} color="secondary" type="button">
                                            Cancelar
                                        </Button>
                                    ) : null}
                                    {(initialValues && initialValues.get('id')) ? (
                                        <Button onClick={() => onDelete(initialValues.get('id'))} variant="contained" color="secondary" type="button">
                                            Excluir
                                        </Button>
                                    ) : null}
                                </div>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

PontoMarcacaoForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
    init: bindActionCreators(initAction, dispatch),
    clear: () => dispatch(clearAction),
    // closeNotif: () => dispatch(closeNotifAction),
});

const ReduxFormMapped = reduxForm({
    form: 'pontoMarcacao',
    enableReinitialize: true,
})(PontoMarcacaoForm);

const reducer = 'pontoMarcacaoReducer';
const FormInit = connect(
    state => ({
        initialValues: state.getIn([reducer]).pontoMarcacao,
        messageNotif: state.getIn([reducer]).notifMsg
    }),
    mapDispatchToProps,
)(ReduxFormMapped);

export default withStyles(styles)(FormInit);