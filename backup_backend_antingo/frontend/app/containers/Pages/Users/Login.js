import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import { NavLink } from 'react-router-dom';
import { createMuiTheme, ThemeProvider, withStyles } from '@material-ui/core/styles';
import { LoginForm } from 'enl-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import logo from 'enl-images/logo2.svg';
import rpaLogo from 'enl-images/rpa.svg';
import styles from 'enl-components/Forms/user-jss';
import { FormattedMessage } from 'react-intl';
import { loginWithEmail, syncUser } from 'enl-redux/actions/authActions';
import messages from './messages';

const brandRpa = createMuiTheme({
  overrides: {
    // Style sheet name ⚛️
    brand: {
      // Name of the rule
      '& img': {
        // Some CSS
        width: '200px',
        marginTop: '100%'
      },
    },
  },
});

class Login extends React.Component {
  componentDidMount() {
    const { handleSyncUser } = this.props;
    handleSyncUser();
  }

  submitForm(values) {
    this.props.handleLoginWithEmail(values.get('email'), values.get('password')); // eslint-disable-line
  }

  render() {
    const title = brand.name + ' - Login';
    const description = brand.desc;
    const { classes } = this.props;
    return (
      <div className={classes.rootFull}>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <div className={classes.containerSide}>
          <Hidden smDown>
            <div className={classes.opening}>
              <div className={classes.openingWrap}>
                <div className={classes.openingHead}>
                  <NavLink to="/" className={classes.brand}>
                    <img alt="Logo" src={logo} />
                  </NavLink>
                </div>
                <Typography variant="h3" component="h1" gutterBottom>
                  <FormattedMessage {...messages.welcomeTitle} />
                  &nbsp;
                  {brand.name}
                </Typography>
                <Typography variant="h6" component="p" className={classes.subpening}>
                  <FormattedMessage {...messages.welcomeSubtitle} />
                </Typography>
              </div>
              <ThemeProvider theme={brandRpa}>
                <div className={classes.openingFooter}>
                  {/* <NavLink to="/" className={classes.brand}> */}
                  <img src={rpaLogo} alt={brand.name} />
                  {/* </NavLink> */}
                </div>
              </ThemeProvider>
            </div>
          </Hidden>
          <div className={classes.sideFormWrap}>
            <LoginForm onSubmit={(values) => this.submitForm(values)} />
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSyncUser: PropTypes.func.isRequired,
};

const reducer = 'authReducer';
const mapStateToProps = state => ({
  state: state.get(reducer)
});

const mapDispatchToProps = dispatch => ({
  handleLoginWithEmail: bindActionCreators(loginWithEmail, dispatch),
  handleSyncUser: bindActionCreators(syncUser, dispatch)
});

const LoginMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

export default withStyles(styles)(LoginMapped);
