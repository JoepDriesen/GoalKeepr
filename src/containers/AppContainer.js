import { connect } from 'react-redux'

import { getCredentials, openCredentialsDialog, closeCredentialsDialog, saveCredentials, changeCredentialsField, clearError } from '../actions'

import App from '../components/App'

const mapStateToProps = state => {
  return {
    ghUsername: state.ghUsername,
    ghPassword: state.ghPassword,
    repoName: state.repoName,
    passphrase: state.passphrase,
    
    credentialsDialogOpen: state.credentialsDialogOpen,
    
    error: state.appError,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLoad: () => dispatch(getCredentials()),
    
    onCredentialsClick: () => dispatch(openCredentialsDialog()),
    onCredentialsDialogClose: () => dispatch(closeCredentialsDialog()),
    onCredentialsDialogSave: (ghUsername, ghPassword, repoName, passphrase) => dispatch(saveCredentials(ghUsername, ghPassword, repoName, passphrase)),
    handleChange: name => event => dispatch(changeCredentialsField(name, event.target.value)),
    
    onErrorClose: event => dispatch(clearError()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)