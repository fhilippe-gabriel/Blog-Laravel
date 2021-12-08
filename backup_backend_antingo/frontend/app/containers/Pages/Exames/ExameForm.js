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
import {
    TextFieldRedux, renderTextInput, SelectRedux
} from 'enl-components/Forms/ReduxFormMUI';
import { initAction, clearAction } from 'enl-redux/actions/reduxFormActions';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { required } from '@/app/utils/formValidation';
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

const tipoExame = ['admissao', 'atestado', 'demissao'];

class ExameForm extends Component {


    render() {
        const trueBool = true;
        const {
            classes,
            funcionarios,
            handleSubmit,
            submitting,
            messages,
            onDelete,
            initialValues,
            modalMode
        } = this.props;
        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant="h5" component="h3">
                                Cadastro de Exame
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
                                <div>
                                    <Field
                                        name="nome_exame"
                                        component={renderTextInput}
                                        placeholder="Nome do exame"
                                        label="Nome do exame"
                                        validate={[required]}
                                        required
                                        ref={this.saveRef}
                                        className={classes.field}
                                    />
                                </div>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={9}>
                                        <FormControl className={classes.field} align="left">
                                            <InputLabel align="left" htmlFor="cliente_id">Tipo do Exame</InputLabel>
                                            <Field
                                                required
                                                name="tipo_exame"
                                                id="tipo_exame"
                                                component={SelectRedux}
                                                placeholder="Tipo do Exame"
                                                validate={required}
                                                autoWidth={trueBool}
                                            >
                                                {tipoExame && tipoExame.map(val => (
                                                    <MenuItem key={val} value={val}>
                                                        {val}
                                                    </MenuItem>
                                                ))}
                                            </Field>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <Field
                                            name="validade_meses"
                                            component={renderTextInput}
                                            placeholder="Validade do exame(meses)"
                                            label="Meses"
                                            type="number"
                                            ref={this.saveRef}
                                            className={classes.field}
                                        />
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
                                        ref={this.saveRef}
                                        className={classes.field}
                                    />
                                </div>
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
                </Grid >
            </div >
        );
    }
}

ExameForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
    init: bindActionCreators(initAction, dispatch),
    clear: () => dispatch(clearAction),
});

const ReduxFormMapped = reduxForm({
    form: 'exame',
    enableReinitialize: true,
})(ExameForm);

const reducer = 'exameReducer';
const FormInit = connect(
    state => ({
        initialValues: state.getIn([reducer]).exame,
        messageNotif: state.getIn([reducer]).notifMsg
    }),
    mapDispatchToProps,
)(ReduxFormMapped);

export default withStyles(styles)(FormInit);
