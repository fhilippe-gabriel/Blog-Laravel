import React, { Component } from 'react';
import { Field } from 'redux-form/immutable';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
    SelectRedux,
    renderDatePicker,
} from 'enl-components/Forms/ReduxFormMUI';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { Map } from 'immutable';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

export const funcionarioExameForm = ({ fields, exames, classes, handleNewEntry, meta: { touched, error, submitFailed } }) => (
    <Grid container spacing={1}>
        <Fab color="primary" aria-label="add" color="secondary" onClick={() => fields.push(new Map())}>
            <AddIcon />
        </Fab>
        {(touched || submitFailed) && error && <span>{error}</span>}
        {fields.map((exame, index) => (
            <Grid item xs={12} m={6} key={index}>
                <Typography align="left" variant="h5" component="h3">
                    Exame #{index + 1}
                </Typography>

                <Grid container spacing={1}>
                    <Grid item xs={12} sm={4}>
                        <FormControl className={classes.field} align="left">
                            <InputLabel align="left">Exame</InputLabel>
                            <Field
                                required
                                name={`${exame}.pivot.exame_id`}
                                component={SelectRedux}
                                placeholder="Exame"
                                className={classes.field}
                            >
                                {exames && exames.map(val => (
                                    <MenuItem key={val.id} value={val.id}>
                                        {val.nome_exame}
                                    </MenuItem>
                                ))}
                            </Field>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2} sm={1}>
                        <FormControl className={classes.btnAdd} align="center">
                            <Fab color="primary" aria-label="add" color="secondary" onClick={() => handleNewEntry("exame")}>
                                <AddIcon />
                            </Fab>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Field
                            required
                            name={`${exame}.pivot.data_realizacao`}
                            type="text"
                            component={renderDatePicker}
                            label="Data da realização"
                            className={classes.field}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <DeleteIcon
                            style={{ marginTop: 20 }}
                            onClick={() => fields.remove(index)}
                        />
                    </Grid>
                </Grid>
            </Grid>
        ))}
    </Grid>
);

export const funcionarioCertificadoForm = ({ fields, certificados, handleNewEntry, classes, meta: { touched, error, submitFailed } }) => (
    <Grid container spacing={1}>
        <Fab color="primary" aria-label="add" color="secondary" onClick={() => fields.push(new Map())}>
            <AddIcon />
        </Fab>
        {(touched || submitFailed) && error && <span>{error}</span>}
        {fields.map((certificado, index) => (
            <Grid item xs={12} m={6} key={index}>
                <Typography align="left" variant="h5" component="h3">
                    Certificado #{index + 1}
                </Typography>

                <Grid container spacing={1}>
                    <Grid item xs={12} sm={4}>
                        <FormControl className={classes.field} align="left">
                            <InputLabel align="left">Certificado</InputLabel>
                            <Field
                                required
                                name={`${certificado}.pivot.certificado_id`}
                                component={SelectRedux}
                                placeholder="certificado"
                                className={classes.field}
                            >
                                {certificados && certificados.map(val => (
                                    <MenuItem key={val.id} value={val.id}>
                                        {val.nome_certificado}
                                    </MenuItem>
                                ))}
                            </Field>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2} sm={1}>
                        <FormControl className={classes.btnAdd} align="center">
                            <Fab color="primary" aria-label="add" color="secondary" onClick={() => handleNewEntry("certificado")}>
                                <AddIcon />
                            </Fab>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Field
                            required
                            name={`${certificado}.pivot.data_realizacao`}
                            type="text"
                            component={renderDatePicker}
                            label="Data da realização"
                            className={classes.field}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <DeleteIcon
                            style={{ marginTop: 20 }}
                            onClick={() => fields.remove(index)}
                        />
                    </Grid>
                </Grid>
            </Grid>
        ))}
    </Grid>
);
