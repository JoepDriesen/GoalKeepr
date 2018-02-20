import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles'

import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import EditIcon from 'material-ui-icons/Edit'
import DeleteIcon from 'material-ui-icons/Delete'
import DoneIcon from 'material-ui-icons/Done'
import ProgressIcon from 'material-ui-icons/TrendingUp'
import { LinearProgress } from 'material-ui/Progress'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Switch from 'material-ui/Switch'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog'
import {
  FormControl, FormControlLabel, FormHelperText
} from 'material-ui/Form'

const styles = theme => ({
  button: {
    margin: "-15px 0 -15px 10px",
    width: 20,
    height: 20,
    fontSize: 20,
  },
})

class Goal extends Component {
  
  render() {
    const {
      classes,
      goal,
      editGoal,
      onEditGoal,
      onEditGoalField,
      onCloseEditGoal,
      onSaveGoal,
      onDeleteGoal,
    } = this.props
    
    return (
      <div style={{ display: "flex", flex: 1 }}>
        <Typography>{ goal.name }</Typography>
        <Typography>
          <IconButton className={classes.button} aria-label="Delete" onClick={ onEditGoal(goal.id) }>
            <EditIcon />
          </IconButton>
          <IconButton className={classes.button} aria-label="Delete" onClick={ onDeleteGoal(goal.id) }>
            <DeleteIcon />
          </IconButton>
        </Typography>
       
        { (goal.type === "boolean") ?
          <div style={{ display: "flex", flex: 1 }}>
            <Typography style={{ flex: 1, textAlign: "right" }}>
              { goal.currentValue === "on" ?
                <DoneIcon color="primary"/> :
                <ProgressIcon color="secondary"/> }
            </Typography>
            <Dialog
              open={ editGoal === goal.id }
              onClose={ onCloseEditGoal }
              aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Edit Boolean Goal</DialogTitle>
              <DialogContent>
                <FormControl fullWidth>
                  <TextField autoFocus id="name" label="Goal Name" type="text" value={ goal.name } onChange={ event => onEditGoalField( goal.id )("name")(event.target.value) } />
                  <FormHelperText></FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    label="Deadline"
                    type="date"
                    value={ goal.date1 ? goal.date1.toISOString().substring(0, 10) : "" }
                    onChange={ event => onEditGoalField(goal.id)("date1")(new Date(event.target.value)) }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <FormHelperText></FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <FormControlLabel
                    control={ <Switch checked={ goal.currentValue === "on" } onChange={ event => onEditGoalField( goal.id )("currentValue")(event.target.checked ? "on" : null) } value="done" /> }
                    label="Done?" />
                  <FormHelperText></FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <pre>{ JSON.stringify(goal, null, 4) }</pre>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={ onCloseEditGoal } color="primary">
                  Cancel
                </Button>
                <Button onClick={ onSaveGoal(goal) } color="primary">
                  Save Changes
                </Button>
              </DialogActions>
            </Dialog> 
          </div> :
                               
        (goal.type === "cd") ?
          <div style={{ display: "flex", flex: 1 }}>
            <div style={{ flex: 1, margin: "8px 20px" }}>
              <LinearProgress variant="determinate" value={ goal.completeness(goal) } />
            </div>
            <Typography>
              { goal.completeness(goal) >= 100 ?
                <DoneIcon color="primary"/> :
                `${ goal.maxValue - Math.floor((Date.now() - goal.date1.getTime()) / (goal.maxValue * 24 * 60 * 60 * 1000)) } days remaining (${ goal.completeness(goal).toFixed(1) }%)` }
            </Typography>
            <Dialog
              open={ editGoal === goal.id }
              onClose={ onCloseEditGoal }
              aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Edit Countdown Goal</DialogTitle>
              <DialogContent>
                <FormControl fullWidth>
                  <TextField autoFocus label="Goal Name" type="text" value={ goal.name } onChange={ event => onEditGoalField( goal.id )("name")(event.target.value) } fullWidth />
                  <FormHelperText></FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={ goal.date1 ? goal.date1.toISOString().substring(0, 10) : "" }
                    onChange={ event => onEditGoalField(goal.id)("date1")(new Date(event.target.value)) }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <FormHelperText></FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <TextField label="Countdown Days" type="number" value={ goal.maxValue } onChange={ event => onEditGoalField( goal.id )("maxValue")(event.target.value) } />
                  <FormHelperText></FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <pre>{ JSON.stringify(goal, null, 4) }</pre>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={ onCloseEditGoal } color="primary">
                  Cancel
                </Button>
                <Button onClick={ onSaveGoal(goal) } color="primary">
                  Save Changes
                </Button>
              </DialogActions>
            </Dialog> 
          </div> :

        (goal.type === "cumulative") ?
          <div style={{ display: "flex", flex: 1 }}>
            <div style={{ flex: 1, margin: "8px 20px" }}>
              <LinearProgress variant="determinate" value={ goal.completeness(goal) } />
            </div>
            <Typography>
              { `${ goal.currentValue }/${ goal.maxValue } (${ goal.completeness(goal).toFixed(1) }%)` }
            </Typography>
            <Dialog
              open={ editGoal === goal.id }
              onClose={ onCloseEditGoal }
              aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Edit Cumulative Goal</DialogTitle>
              <DialogContent>
                <FormControl fullWidth>
                  <TextField autoFocus label="Goal Name" type="text" value={ goal.name } onChange={ event => onEditGoalField( goal.id )("name")(event.target.value) } fullWidth />
                  <FormHelperText></FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <TextField label="Goal Value" type="number" value={ goal.maxValue } onChange={ event => onEditGoalField( goal.id )("maxValue")(event.target.value) } />
                  <FormHelperText></FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    label="Deadline"
                    type="date"
                    value={ goal.date1 ? goal.date1.toISOString().substring(0, 10) : "" }
                    onChange={ event => onEditGoalField(goal.id)("date1")(new Date(event.target.value)) }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <FormHelperText></FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <TextField label="Current Value" type="number" value={ goal.currentValue } onChange={ event => onEditGoalField( goal.id )("currentValue")(event.target.value) } />
                  <FormHelperText></FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <pre>{ JSON.stringify(goal, null, 4) }</pre>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={ onCloseEditGoal } color="primary">
                  Cancel
                </Button>
                <Button onClick={ onSaveGoal(goal) } color="primary">
                  Save Changes
                </Button>
              </DialogActions>
            </Dialog> 
          </div> :
      
        (goal.type === "percentage") ?
          <div style={{ display: "flex", flex: 1 }}>
            <div style={{ flex: 1, margin: "8px 20px" }}>
              <LinearProgress variant="determinate" value={ goal.completeness(goal) } />
            </div>
            <Typography>{ `${ goal.completeness(goal).toFixed(1) }%` }</Typography>
            <Dialog
              open={ editGoal === goal.id }
              onClose={ onCloseEditGoal }
              aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Edit Percentage Goal</DialogTitle>
              <DialogContent>
                <FormControl fullWidth>
                  <TextField autoFocus label="Goal Name" type="text" value={ goal.name } onChange={ event => onEditGoalField( goal.id )("name")(event.target.value) } fullWidth />
                  <FormHelperText></FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    label="Deadline"
                    type="date"
                    value={ goal.date1 ? goal.date1.toISOString().substring(0, 10) : "" }
                    onChange={ event => onEditGoalField(goal.id)("date1")(new Date(event.target.value)) }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <FormHelperText></FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <TextField label="Current Value" type="number" value={ goal.currentValue } onChange={ event => onEditGoalField( goal.id )("currentValue")(Math.min(100, Math.max(0, event.target.value))) } />
                  <FormHelperText></FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <pre>{ JSON.stringify(goal, null, 4) }</pre>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={ onCloseEditGoal } color="primary">
                  Cancel
                </Button>
                <Button onClick={ onSaveGoal(goal) } color="primary">
                  Save Changes
                </Button>
              </DialogActions>
            </Dialog> 
          </div> :
      
        (goal.type === "revcd") ?
          <div style={{ display: "flex", flex: 1 }}>
            <Typography style={{ flex: 1, textAlign: "right" }}>
              { goal.completeness(goal) >= 100 ?
                [
                  `${ goal.maxValue - Math.floor((Date.now() - goal.date1.getTime()) / (goal.maxValue * 24 * 60 * 60 * 1000)) } days remaining`,
                  <DoneIcon key={ 0 }color="primary"/>
                ] :
                `${ goal.maxValue - Math.floor((Date.now() - goal.date1.getTime()) / (goal.maxValue * 24 * 60 * 60 * 1000)) } days over deadline` }
            </Typography>
            <Dialog
              open={ editGoal === goal.id }
              onClose={ onCloseEditGoal }
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Edit Reverse Countdown Goal</DialogTitle>
              <DialogContent>
                <FormControl fullWidth>
                  <TextField autoFocus label="Goal Name" type="text" value={ goal.name } onChange={ event => onEditGoalField( goal.id )("name")(event.target.value) } fullWidth />
                  <FormHelperText></FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    label="Last Completion Date"
                    type="date"
                    value={ goal.date1 ? goal.date1.toISOString().substring(0, 10) : "" }
                    onChange={ event => isNaN(Date.parse(event.target.value)) || onEditGoalField(goal.id)("date1")(new Date(event.target.value)) }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <FormHelperText></FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <TextField label="Cooldown Days" type="number" value={ goal.maxValue } onChange={ event => onEditGoalField( goal.id )("maxValue")(event.target.value) } />
                  <FormHelperText></FormHelperText>
                </FormControl>
                <FormControl fullWidth>
                  <pre>{ JSON.stringify(goal, null, 4) }</pre>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={ onCloseEditGoal } color="primary">
                  Cancel
                </Button>
                <Button onClick={ onSaveGoal(goal) } color="primary">
                  Save Changes
                </Button>
              </DialogActions>
            </Dialog> 
          </div> :
     
          <div style={{ display: "flex", flex: 1 }}>
            <Typography key={ "u1" } className={ classes.heading }>{ goal.name }</Typography>
            <Typography key={ "u2" } className={ classes.heading }>
              <IconButton className={classes.button} aria-label="Delete">
                <EditIcon />
              </IconButton>
              <IconButton className={classes.button} aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </Typography>
            <pre key={ "u3" }>{ JSON.stringify(goal, undefined, 4) }</pre> 
          </div> }
      </div>
    )
  }
  
}

export default withStyles(styles)(Goal)