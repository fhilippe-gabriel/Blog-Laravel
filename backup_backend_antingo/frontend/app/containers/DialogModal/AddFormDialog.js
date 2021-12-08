import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import Add from '@material-ui/icons/Add';
import { injectIntl, intlShape } from 'react-intl';
import messages from './message';
// import AddFormDialogForm from './AddFormDialogForm';
import CargoForm from '../Pages/Cargos/CargoForm'
import FloatingPanel from '../Panel/FloatingPanel';
import styles from './form-jss';

class AddFormDialog extends React.Component {
    constructor(props) {
        super(props);
    }
    sendValues = (values) => {
        const { submit } = this.props;
        setTimeout(() => {
            submit(values);
            this.setState({ });
        }, 500);
    }

    render() {
        const {
            classes,
            form,
            openForm,
            closeForm,
            avatarInit,
            addContact,
            processing,
            intl
        } = this.props;
        const branch = '';
        return (
            <div>
                <Tooltip title={"add contacts"}>
                    <Fab color="secondary" onClick={() => addContact()} className={classes.addBtn}>
                        <Add />
                    </Fab>
                </Tooltip>
                <FloatingPanel title={"add contacts"} openForm={openForm} branch={branch} closeForm={closeForm}>

                    <CargoForm onSubmit={(values) => formSubmit(values)} />
                    {/* <AddFormDialogForm
                        onSubmit={this.sendValues}
                        onDrop={this.onDrop}
                        imgAvatar={img === null ? avatarInit : img}
                        processing={processing}
                    /> */}
                </FloatingPanel>
            </div>
        );
    }
}

AddFormDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    submit: PropTypes.func.isRequired,
    addContact: PropTypes.func.isRequired,
    openForm: PropTypes.bool.isRequired,
    avatarInit: PropTypes.string.isRequired,
    closeForm: PropTypes.func.isRequired,
    processing: PropTypes.bool,
    intl: intlShape.isRequired
};

AddFormDialog.defaultProps = {
    processing: false
};

export default withStyles(styles)(injectIntl(AddFormDialog));
