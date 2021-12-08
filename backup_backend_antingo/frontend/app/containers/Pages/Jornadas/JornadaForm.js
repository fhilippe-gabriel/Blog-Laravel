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
    TextFieldRedux, renderTextInput
} from 'enl-components/Forms/ReduxFormMUI';
import { initAction, clearAction } from 'enl-redux/actions/reduxFormActions';
import MaskedInput from 'react-text-mask';


// validation functions
const required = value => (value == null ? 'Required' : undefined);

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

class JornadaForm extends Component {

    renderDatePicker = ({ input: { onChange, value }, label, className }) => (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
                label={label}
                value={!value ? null : new Date(value)}
                clearable
                onChange={onChange}
                className={className}
                animateYearScrolling={false}
            />
        </MuiPickersUtilsProvider>
    )


    render() {
        const trueBool = true;
        const {
            classes,
            handleSubmit,
            submitting,
            messages,
            onDelete,
            initialValues,
        } = this.props;
        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant="h5" component="h3">
                                Cadastro de Tipo de Atividade
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
                                        name="numero"
                                        type="number"
                                        component={renderTextInput}
                                        placeholder="Número"
                                        label="Número"
                                        validate={required}
                                        required
                                        ref={this.saveRef}
                                        className={classes.field}
                                    />
                                </div>
                                <div>
                                    <Field
                                        name="descricao"
                                        component={renderTextInput}
                                        placeholder="Descrição"
                                        label="Descrição"
                                        validate={[required]}
                                        required
                                        ref={this.saveRef}
                                        className={classes.field}
                                    />
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

JornadaForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
    init: bindActionCreators(initAction, dispatch),
    clear: () => dispatch(clearAction),
    // closeNotif: () => dispatch(closeNotifAction),
});

const ReduxFormMapped = reduxForm({
    form: 'jornada',
    enableReinitialize: true,
})(JornadaForm);

const reducer = 'jornadaReducer';
const FormInit = connect(
    state => ({
        initialValues: state.getIn([reducer]).jornada,
        messageNotif: state.getIn([reducer]).notifMsg
    }),
    mapDispatchToProps,
)(ReduxFormMapped);

export default withStyles(styles)(FormInit);
