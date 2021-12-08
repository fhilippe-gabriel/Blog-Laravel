import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { Notification } from 'enl-components';
import { withStyles } from '@material-ui/core/styles';

import styles from 'enl-components/Forms/user-jss';

import * as actions from '@/app/redux/actions/userActions'
import { closeNotifAction } from 'enl-redux/actions/reduxFormActions';
import UserForm from './UserForm'
import DeleteDialog from '../../DialogModal/DeleteDialog';

const User = (props) => {

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idUser, setIdUser] = useState(null);
    const uid = props.match.params._id;

    useEffect(() => {
        if (props.user === undefined
            && uid) {
            props.onFetchUser(uid);
        }
    }, [])

    const formSubmit = (values) => {

        const user = {
            id: values.get('id'),
            name: values.get('name'),
            email: values.get('email'),
            password: values.get('password'),
            password_confirmation: values.get('password_confirmation'),
        }

        if (user.id === undefined) {
            props.onCreateUser(user)
        } else {
            props.onUpdateUser(user)
        }

    }

    const handleDelete = (id) => {
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdUser(id)
    }

    const handleConfirmDelete = (id) => {
        props.onRemoveUser(id, true);
        setDeleteDialogOpen(!deleteDialogOpen)
        setIdUser(null)
    }

    const title = brand.name + ' - Usuários';
    const description = brand.desc;

    return (
        <div>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="twitter:title" content={title} />
                <meta property="twitter:description" content={description} />
            </Helmet>
            <Notification close={() => props.closeNotif()} message={props.messageNotif} />
            <UserForm onSubmit={(values) => formSubmit(values)} onDelete={(id) => handleDelete(id)} />
            {deleteDialogOpen ? (<DeleteDialog id={idUser} handleConfirm={handleConfirmDelete} />) : null}
        </div>
    );
}

const reducer = 'userReducer';
const mapStateToProps = state => ({
    user: state.getIn([reducer, 'user']),
    messageNotif: state.getIn([reducer]).notifMsg
});

const mapDispatchToProps = dispatch => ({
    onFetchUser: (id) => dispatch(actions.fetchUser(id)),
    onCreateUser: (values) => dispatch(actions.createUser(values)),
    onRemoveUser: (id) => dispatch(actions.removeUser(id, true)),
    onUpdateUser: (values) => dispatch(actions.updateUser(values)),
    closeNotif: () => dispatch(closeNotifAction),
});

const UserMapped = connect(
    mapStateToProps,
    mapDispatchToProps
)(User);

export default (withStyles(styles)(UserMapped));