import React, { Fragment, useState } from 'react';
import { MaterialDropZone } from 'enl-components';

import { makeStyles } from '@material-ui/core/styles';
import { Field, reduxForm } from 'redux-form/immutable';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';

import { connect } from 'react-redux';
import { Notification } from 'enl-components';
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import Button from '@material-ui/core/Button';
import {
    SelectRedux
} from 'enl-components/Forms/ReduxFormMUI';



const useStyles = makeStyles((theme) => ({
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
        marginBottom: 20,
        marginTop: 10
    },
    buttonInit: {
        marginBottom: 50,
        marginTop: 2,
        textAlign: 'center'
    },
}));

const UploadPonto = (props) => {

    const [file, setFile] = useState([]);
    const [nomeArquivo, setNomeArquivo] = useState('');
    const [cliente, setCliente] = useState(null);
    const classes = useStyles();

    const {
        clientes,
        upload,
    } = props;

    const handleClienteChange = (event) => {
        setCliente(event.target.value);
    }

    return (
        <div>
            <Typography variant="h6" id="modal-title">
                Upload de arquivos
                    </Typography>
            <Typography variant="subtitle1" id="simple-modal-description">
                Algum texto útil com ajuda sobre os pontos
            </Typography>
            <Fragment>
                <form onSubmit={upload}>
                    <Grid container>
                        <Grid item xs={12} sm={12}>
                            <Field
                                required
                                name="cliente_id"
                                id="cliente_id"
                                className={classes.field}
                                component={SelectRedux}
                                placeholder="Cliente"
                                onChange={handleClienteChange}
                            >
                                {clientes && clientes.map(val => (
                                    <MenuItem key={val.id} value={val.id}>
                                        {val.razao_social}
                                    </MenuItem>
                                ))}
                            </Field>
                        </Grid>
                    </Grid>
                    <Notification close={() => props.closeNotif()} message={nomeArquivo} />
                    <Grid container marginTop={5}>
                        <Grid item xs={12} sm={12}>
                            <MaterialDropZone
                                acceptedFiles={['application/vnd.ms-excel', '.csv']}
                                files={file}
                                maxSize={5000000}
                                filesLimit={1}
                                onDrop={files => {
                                    setFile(files)
                                    setNomeArquivo('Arquivo : ' + files[0].name)
                                    console.log(files[0].name)
                                }}
                                text="Arraste o arquivo ou clique aqui"
                            />

                        </Grid>
                    </Grid>
                    <div className={classes.buttonInit}>
                        <Button onClick={() => upload(file, cliente)} color="primary" variant="contained" type="button">
                            Enviar
                             </Button>
                    </div>
                </form>
                
            </Fragment>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    closeNotif: () => dispatch(closeNotifAction)
})

const ReduxFormMapped = reduxForm({
    form: 'uploadPonto',
    enableReinitialize: true,
})(UploadPonto);

const FormInit = connect(
    null,
    mapDispatchToProps,
)(ReduxFormMapped);

export default (FormInit);
