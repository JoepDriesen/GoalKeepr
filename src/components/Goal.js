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
  FormControlLabel,
} from 'material-ui/Form';

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
    
    const baseEls = goal => [
      <Typography key={ 0 }>{ goal.name }</Typography>,
      <Typography key={ 1 }>
        <IconButton className={classes.button} aria-label="Delete" onClick={ onEditGoal(goal.id) }>
          <EditIcon />
        </IconButton>
        <IconButton className={classes.button} aria-label="Delete" onClick={ onDeleteGoal(goal.id) }>
          <DeleteIcon />
        </IconButton>
      </Typography>,
    ]
    
    if (goal.type === "boolean") {
      return [
        ...baseEls(goal),
        <Typography key={ "b1" } style={{ flex: 1, textAlign: "right" }}>
          { goal.currentValue === "on" ?
            <DoneIcon color="primary"/> :
            <ProgressIcon color="secondary"/> }
        </Typography>,
        <Dialog
          key={ "b2" }
          open={ editGoal === goal.id }
          onClose={ onCloseEditGoal }
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit Boolean Goal</DialogTitle>
          <DialogContent>
            <TextField autoFocus margin="normal" id="name" label="Goal Name" type="text" value={ goal.name } onChange={ event => onEditGoalField( goal.id )("name")(event.target.value) } fullWidth />
            <FormControlLabel
              control={ <Switch checked={ goal.currentValue === "on" } onChange={ event => onEditGoalField( goal.id )("currentValue")(event.target.checked ? "on" : null) } value="done" /> }
              label="Done?" />
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
      ]
    } else if (goal.type === "cd") {
      return [
        ...baseEls(goal),
        <div key={ "cd1" } style={{ flex: 1, margin: "8px 20px" }}>
          <LinearProgress variant="determinate" value={ goal.completeness() } />
        </div>,
        <Typography key={ "cd2" }>
          { goal.completeness() >= 100 ?
            <DoneIcon color="primary"/> :
            `${ goal.maxValue - Math.floor((Date.now() - goal.date1.getTime()) / (goal.maxValue * 24 * 60 * 60 * 1000)) } days remaining (${ goal.completeness().toFixed(1) }%)` }
        </Typography>,
      ]
    } else if (goal.type === "cumulative") {
      return [
        ...baseEls(goal),
        <div key={ "c1" } style={{ flex: 1, margin: "8px 20px" }}>
          <LinearProgress variant="determinate" value={ goal.completeness() } />
        </div>,
        <Typography key={ "c2" }>{ `${ goal.currentValue }/${ goal.maxValue } (${ goal.completeness().toFixed(1) }%)` }</Typography>
      ]
    } else if (goal.type === "percentage") {
      return [
        ...baseEls(goal),
        <div key={ "p1" } style={{ flex: 1, margin: "8px 20px" }}>
          <LinearProgress variant="determinate" value={ goal.completeness() } />
        </div>,
        <Typography key={ "p2" }>{ `${ goal.completeness().toFixed(1) }%` }</Typography>
      ]
    } else if (goal.type === "revcd") {
      return [
        ...baseEls(goal),
        <Typography key={ "r1" } style={{ flex: 1, textAlign: "right" }}>
          { goal.completeness() >= 100 ?
            [
              `${ goal.maxValue - Math.floor((Date.now() - goal.date1.getTime()) / (goal.maxValue * 24 * 60 * 60 * 1000)) } days remaining`,
              <DoneIcon color="primary"/>
            ] :
            `${ goal.maxValue - Math.floor((Date.now() - goal.date1.getTime()) / (goal.maxValue * 24 * 60 * 60 * 1000)) } days over deadline` }
        </Typography>,
      ]
    } else {
      console.error("Warning: Unknown goal type", goal)
      return [
        <Typography key={ "u1" } className={ classes.heading }>{ goal.name }</Typography>,
        <Typography key={ "u2" } className={ classes.heading }>
          <IconButton className={classes.button} aria-label="Delete">
            <EditIcon />
          </IconButton>
          <IconButton className={classes.button} aria-label="Delete">
            <DeleteIcon />
          </IconButton>
        </Typography>,
        <pre key={ "u3" }>{ JSON.stringify(goal, undefined, 4) }</pre>
      ]
    }
  }
  
}

export default withStyles(styles)(Goal)