import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Field, reduxForm } from 'redux-form/immutable';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { initAction, clearAction, closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import {
    TextFieldRedux,
    SelectRedux,
    renderDatePicker,
    renderTextInput,
    renderCampoValor
} from 'enl-components/Forms/ReduxFormMUI';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
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

class ProjetoForm extends Component {

    render() {
        const trueBool = true;
        const {
            classes,
            clientes,
            handleSubmit,
            submitting,
            onDelete,
            initialValues
        } = this.props;
        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant="h5" component="h3" >
                                <FormattedMessage {...messages.cadastro} />
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <Field
                                        name="id"
                                        type="hidden"
                                        component={TextFieldRedux}
                                        ref={this.saveRef}
                                    />
                                </div>
                                <div>
                                    <FormControl className={classes.field} align="left">
                                        <InputLabel align="left" htmlFor="cliente_id">Cliente</InputLabel>
                                        <Field
                                            required
                                            name="cliente_id"
                                            id="cliente_id"
                                            component={SelectRedux}
                                            placeholder="Cliente"
                                            validate={[required]}
                                            required
                                            autoWidth={trueBool}
                                        >
                                            {clientes && clientes.map(val => (
                                                <MenuItem key={val.id} value={val.id}>
                                                    {val.razao_social}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                    </FormControl>
                                </div>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={3}>
                                        <Field
                                            name="codigo_projeto"
                                            component={renderTextInput}
                                            placeholder="Código"
                                            label="Código"
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
                                    <Grid item xs={12} sm={4}>
                                        <Field
                                            name="valor"
                                            component={renderCampoValor}
                                            placeholder="Valor"
                                            label="Valor"
                                            validate={[required]}
                                            required
                                            ref={this.saveRef}
                                            className={classes.field}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Field
                                            name="data_inicio"
                                            component={renderDatePicker}
                                            placeholder="Data início"
                                            label="Data início"
                                            validate={[required]}
                                            required
                                            ref={this.saveRef}
                                            className={classes.field}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Field
                                            name="data_fim"
                                            component={renderDatePicker}
                                            placeholder="Data fim"
                                            label="Data fim"
                                            validate={[required]}
                                            required
                                            ref={this.saveRef}
                                            className={classes.field}
                                        />
                                    </Grid>
                                </Grid>
                                <div>
                                    <Field
                                        name="local"
                                        component={TextFieldRedux}
                                        placeholder="Local"
                                        label="Local"
                                        validate={[required]}
                                        required
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

ProjetoForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
    init: bindActionCreators(initAction, dispatch),
    clear: () => dispatch(clearAction),
    closeNotif: () => dispatch(closeNotifAction),
});

const ReduxFormMapped = reduxForm({
    form: 'projeto',
    enableReinitialize: true,
})(ProjetoForm);

const reducer = 'projetoReducer';
const FormInit = connect(
    state => ({
        force: state,
        initialValues: state.getIn([reducer]).projeto,
        messageNotif: state.getIn([reducer]).notifMsg
    }),
    mapDispatchToProps,
)(ReduxFormMapped);

export default withStyles(styles)(FormInit);
