import React, { Component } from 'react'

import { withStyles } from 'material-ui/styles'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import LockIcon from 'material-ui-icons/Lock'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import CategoryList from "../containers/CategoryListContainer"

import Snackbar from 'material-ui/Snackbar';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  content: {
    margin: "auto",
    maxWidth: 1280,
    padding: 30,
  }
})
  
class App extends Component {
  
  componentDidMount() {
    return this.props.onLoad()
  }
  
  render() {
    return (
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" style={{ flex: 1 }}>
              GoalKeepr
            </Typography>
            <IconButton
              onClick={ this.props.onCredentialsClick }
              color="inherit">
              <LockIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        
        <div className={this.props.classes.content}>
          <CategoryList />
        </div>
      
        <Dialog
            open={ this.props.credentialsDialogOpen }
            onClose={ this.props.onCredentialsDialogClose }
            aria-labelledby="form-dialog-title"
          >
          <DialogTitle id="form-dialog-title">Enter Database Credentials</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the credentials to the github repository you are using as database.
            </DialogContentText>
            <TextField
              autoFocus
              margin="normal"
              id="ghUsername"
              value={ this.props.ghUsername }
              onChange={ this.props.handleChange('ghUsername') }
              label="Github Username"
              type="text"
              fullWidth
            />
            <TextField
              margin="normal"
              id="ghPassword"
              value={ this.props.ghPassword }
              onChange={ this.props.handleChange('ghPassword') }
              label="Github Password"
              type="password"
              fullWidth
            />
            <TextField
              margin="normal"
              id="repoName"
              value={ this.props.repoName }
              onChange={ this.props.handleChange('repoName') }
              label="Github Repository Name"
              type="email"
              fullWidth
            />
            <TextField
              margin="normal"
              id="passphrase"
              value={ this.props.passphrase }
              onChange={ this.props.handleChange('passphrase') }
              label="Database Passphrase"
              type="password"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={ this.props.onCredentialsDialogClose } color="primary">
              Cancel
            </Button>
            <Button onClick={ () => this.props.onCredentialsDialogSave(this.props.ghUsername, this.props.ghPassword, this.props.repoName, this.props.passphrase) } color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      
        <Snackbar
          anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
          open={this.props.error !== null}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
            style: { background: "#D24D57" },
          }}
          message={<span id="message-id">{this.props.error}</span>}
          onClose={ this.props.onErrorClose }
        />

      </div>
    )
  }
  
}

export default withStyles(styles)(App)