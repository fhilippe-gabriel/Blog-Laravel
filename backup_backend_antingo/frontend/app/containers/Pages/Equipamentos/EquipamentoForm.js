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
    TextFieldRedux,
    renderTextInput,
    SelectRedux
} from 'enl-components/Forms/ReduxFormMUI';
import { initAction } from 'enl-redux/actions/reduxFormActions';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
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

class EquipamentoForm extends Component {

    render() {
        const trueBool = true;
        const {
            classes,
            handleSubmit,
            submitting,
            messages,
            tipos_recursos,
            onDelete,
            initialValues,
        } = this.props;
        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant="h5" component="h3">
                                Cadastro de Equipamentos
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
                                        name="nome_recurso"
                                        component={renderTextInput}
                                        placeholder="Nome"
                                        label="Nome"
                                        validate={[required]}
                                        required
                                        ref={this.saveRef}
                                        className={classes.field}
                                    />
                                </div>
                                <div>
                                    <FormControl className={classes.field} align="left">
                                        <InputLabel align="left" htmlFor="cargo_id">Tipo Recurso</InputLabel>
                                        <Field
                                            required
                                            name="tipo_recurso_id"
                                            id="tipo_recurso_id"
                                            component={SelectRedux}
                                            placeholder="Cargo"
                                            autoWidth={trueBool}
                                        >
                                            {tipos_recursos && tipos_recursos.map(val => (
                                                <MenuItem key={val.id} value={val.id}>
                                                    {val.descricao}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </div>
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
                    </Grid>
                </Grid>
            </div>
        );
    }
}

EquipamentoForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
    init: bindActionCreators(initAction, dispatch),
});

const ReduxFormMapped = reduxForm({
    form: 'equipamento',
    enableReinitialize: true,
})(EquipamentoForm);

const reducer = 'equipamentoReducer';
const FormInit = connect(
    state => ({
        initialValues: state.getIn([reducer]).equipamento,
        messageNotif: state.getIn([reducer]).notifMsg
    }),
    mapDispatchToProps,
)(ReduxFormMapped);

export default withStyles(styles)(FormInit);
