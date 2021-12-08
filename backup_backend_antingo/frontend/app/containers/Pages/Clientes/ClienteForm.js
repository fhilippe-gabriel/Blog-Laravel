import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from "react-dropzone";
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import { Field, reduxForm } from 'redux-form/immutable';
import Grid from '@material-ui/core/Grid';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import {
    TextFieldRedux,
    renderCNPJ,
    renderTextInput,
    renderTelefone
} from 'enl-components/Forms/ReduxFormMUI';
import { initAction, clearAction } from 'enl-redux/actions/reduxFormActions';
import { required } from '@/app/utils/formValidation';
import FormHelperText from '@material-ui/core/FormHelperText';

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
    avatar: {
        boxShadow: theme.shadows[7]
    },
    avatarBig: {
        width: 80,
        height: 80,
        margin: '-16px auto 10px',
        background: theme.palette.secondary.dark,
        boxShadow: theme.shadows[7]
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

function DropzoneField(props) {
    console.log(props);
    const {
        classes,
        meta: { touched, invalid, error },
        input: { onChange, onDrop }
    } = props;
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: onDrop
    });

    return (
        <div>
            <div {...getRootProps()}>
                <input {...getInputProps()}
                    error={touched && invalid}
                    helperText={touched && error} />
                <FormHelperText 
                    error={touched && invalid}>{touched && error}
                </FormHelperText>

                <Tooltip id="tooltip-upload" title={'upload'}>
                    <IconButton
                        className={classes.buttonUpload}
                        component="button"
                    >
                        <PhotoCamera />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );
}
class ClienteForm extends Component {

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
            onDelete,
            initialValues,
            onDrop,
            imgAvatar,
        } = this.props;
        let dropzoneRef;
        const acceptedFiles = ['image/jpeg', 'image/png', 'image/jpg'];
        const fileSizeLimit = 100000;
        const imgPreview = img => {
            if (img !== '') {
                return URL.createObjectURL(img);
            }
        };
        return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant="h5" component="h3">
                                Cadastro de Cliente
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
                                <Grid align="center" spacing={1}>
                                    <Grid container>
                                        <Avatar
                                            alt="Avatar"
                                            className={classes.avatarBig}
                                            src={imgAvatar ? imgPreview(imgAvatar) : (initialValues && initialValues.get('logo'))}
                                        />
                                    </Grid>
                                    <Grid align="center" >
                                        <Field name="logo" onDrop={onDrop} classes={classes} component={DropzoneField} />

                                    </Grid>
                                </Grid>

                                <div>
                                    <Field
                                        name="razao_social"
                                        component={TextFieldRedux}
                                        placeholder="Razão Social"
                                        label="Razão Social"
                                        validate={required}
                                        required
                                        ref={this.saveRef}
                                        className={classes.field}
                                    />
                                </div>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={8}>
                                        <Field
                                            name="nome_fantasia"
                                            component={TextFieldRedux}
                                            placeholder="Nome fantasia"
                                            label="Nome fantasia"
                                            ref={this.saveRef}
                                            className={classes.field}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Field
                                            name="cnpj"
                                            component={renderCNPJ}
                                            placeholder="CNPJ"
                                            label="CNPJ"
                                            validate={[required]}
                                            required
                                            ref={this.saveRef}
                                            className={classes.field}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={8}>
                                        <Field
                                            name="contato_nome"
                                            component={TextFieldRedux}
                                            placeholder="Nome do contato"
                                            label="Nome"
                                            ref={this.saveRef}
                                            className={classes.field}
                                        />
                                    </Grid>
                                    <Grid item xs={10} sm={4}>
                                        <Field
                                            name="contato_cargo"
                                            component={TextFieldRedux}
                                            placeholder="Cargo do contato"
                                            label="Cargo"
                                            ref={this.saveRef}
                                            className={classes.field}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={8}>
                                        <Field
                                            name="email"
                                            component={renderTextInput}
                                            placeholder="Email"
                                            label="Email"
                                            className={classes.field}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Field
                                            name="contato_fone"
                                            component={renderTelefone}
                                            placeholder="Telefone do contato"
                                            label="Telefone"
                                            ref={this.saveRef}
                                            className={classes.field}
                                        />
                                    </Grid>
                                </Grid>

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

ClienteForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
    init: bindActionCreators(initAction, dispatch),
    clear: () => dispatch(clearAction),
    // closeNotif: () => dispatch(closeNotifAction),
});

const ReduxFormMapped = reduxForm({
    form: 'cliente',
    enableReinitialize: true,
    multiPartForm: true
})(ClienteForm);

const reducer = 'clienteReducer';
const FormInit = connect(
    state => ({
        initialValues: state.getIn([reducer]).cliente,
        messageNotif: state.getIn([reducer]).notifMsg
    }),
    mapDispatchToProps,
)(ReduxFormMapped);

export default withStyles(styles)(FormInit);
