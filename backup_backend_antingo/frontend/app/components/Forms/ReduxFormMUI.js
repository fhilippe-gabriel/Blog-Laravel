import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import RadioGroup from '@material-ui/core/RadioGroup';
import MomentUtils from '@date-io/moment';
import * as mask from '@/app/utils/mask';
import currencyFormatter from '@/app/utils/currencyFormatter';
import MaskedInput from 'react-text-mask';
import NumberFormat from 'react-number-format';
import FormHelperText from '@material-ui/core/FormHelperText';

/* Textfield */
export const TextFieldRedux = ({ meta: { touched, error }, input, ...rest }) => {
  const [val, setVal] = useState('');
  return (
    <TextField
      {...rest}
      {...input}
      value={val || input.value}
      onChange={(e) => setVal(e.target.value)}
      error={touched && Boolean(error)}
    />
  );
};


TextFieldRedux.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object,
};

TextFieldRedux.defaultProps = {
  meta: null,
};
/* End */

/* Select */
export const SelectRedux = ({ meta: { touched, invalid, error }, input, children, ...rest }) => (
  <React.Fragment>
    <Select
      {...input}
      {...rest}
    >
      {children}
    </Select>
    <FormHelperText
      error={touched && invalid}>{touched && error}</FormHelperText>
  </React.Fragment>

);

SelectRedux.propTypes = {
  input: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};
/* End */

/* Checkbox */
export const CheckboxRedux = ({ input, ...rest }) => (
  <Checkbox
    checked={input.value === '' ? false : input.value}
    {...input}
    {...rest}
  />
);

CheckboxRedux.propTypes = {
  input: PropTypes.object.isRequired,
};
/* End */

/* Switch */
export const SwitchRedux = ({ input, ...rest }) => (
  <Switch
    checked={input.value === '' ? false : input.value}
    {...input}
    {...rest}
  />
);

SwitchRedux.propTypes = {
  input: PropTypes.object.isRequired,
};
/* End */


export const renderTextInput = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => (
    <TextField
      label={label}
      placeholder={label}
      error={touched && invalid}
      helperText={touched && error}
      {...input}
      {...custom}
    />
  )

export const renderDatePicker = ({ meta: { touched, invalid, error }, input: { onChange, value, required }, label, className, ...rest }) => (
  <MuiPickersUtilsProvider utils={MomentUtils}>
    <KeyboardDatePicker
      label={label}
      value={value}
      variant="inline"
      format="DD/MM/yyyy"
      onChange={onChange}
      required={rest.required}
      className={className}
      animateYearScrolling={false}
      error={touched && invalid}
      helperText={touched && error}
    />
  </MuiPickersUtilsProvider>
)

export const renderRadioGroup = ({ input, ...rest }) => (
  <RadioGroup
    {...input}
    {...rest}
    valueselected={input.value}
    onChange={(event, value) => input.onChange(value)}
  />
);



export const renderCampoValor = ({
  label,
  input,
  inputRef,
  meta: { touched, invalid, error },
  ...custom
}) => (
    <TextField
      label={label}
      placeholder={label}
      error={touched && invalid}
      helperText={touched && error}
      {...input}
      {...custom}
      InputProps={{
        inputComponent: ValorFormat,
      }}
    />
  )


const ValorFormat = ({
  input,
  ...custom
}) => (
    <NumberFormat
      format={currencyFormatter}
      {...input}
      {...custom}
    />
  )

export const renderCPF = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => (
    <TextField
      label={label}
      placeholder={label}
      error={touched && invalid}
      helperText={touched && error}
      {...input}
      {...custom}
      InputProps={{
        inputComponent: cpfFormat,
      }}
    />
  )

const cpfFormat = ({
  inputRef,
  input,
  ...custom
}) => (
    <MaskedInput
      {...input}
      {...custom}
      mask={mask.cpf}
    />
  )


export const renderTelefone = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => (
    <TextField
      label={label}
      placeholder={label}
      error={touched && invalid}
      helperText={touched && error}
      {...input}
      {...custom}
      InputProps={{
        inputComponent: telefoneFormat,
      }}
    />
  )

const telefoneFormat = ({
  inputRef,
  input,
  ...custom
}) => (
    <MaskedInput
      {...input}
      {...custom}
      mask={mask.phoneNumber}
    />
  )


export const renderCNPJ = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => (
    <TextField
      label={label}
      placeholder={label}
      error={touched && invalid}
      helperText={touched && error}
      {...input}
      {...custom}
      InputProps={{
        inputComponent: cnpjFormat,
      }}
    />
  )

const cnpjFormat = ({
  input,
  ...custom
}) => (
    <MaskedInput
      {...input}
      {...custom}
      mask={mask.cnpj}
    />
  )