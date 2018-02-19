import React, { Component } from 'react'

import { withStyles } from 'material-ui/styles'


import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import EditIcon from 'material-ui-icons/Edit'
import DeleteIcon from 'material-ui-icons/Delete'
import { LinearProgress } from 'material-ui/Progress'

import Goal from "./Goal"

const styles = theme => ({
  button: {
    margin: "-15px 0 -15px 10px",
    width: 20,
    height: 20,
    fontSize: 20,
  },
})

class GoalList extends Component {
  
  render() {
    const {
      isFetching,
      classes,
      goals,
      allGoals,
      onEditGoal,
      onDeleteGoal
    } = this.props
    
    return (
      <div style={{ flex: 1 }}>
        { goals.map((goalId, index) => {
          const goal = allGoals[goalId]
          
          return (goal.type === "group") ?
              <ExpansionPanel key={ index } disabled={ isFetching }>
                <ExpansionPanelSummary expandIcon={ <ExpandMoreIcon /> }>
                  <Typography className={ classes.heading }>{ goal.name }</Typography>
                  <Typography className={ classes.heading }>
                    <IconButton className={classes.button} aria-label="Edit" onClick={ onEditGoal(goal.id) }>
                      <EditIcon />
                    </IconButton>
                    <IconButton className={classes.button} aria-label="Delete" onClick={ onDeleteGoal(goal.id) }>
                      <DeleteIcon />
                    </IconButton>
                  </Typography>
                  <div style={{ flex: 1, margin: "8px 20px" }}>
                    <LinearProgress variant="determinate" value={ goal.completeness() } />
                  </div>
                  <Typography>{ `${ goal.completeness().toFixed(1) }%` }</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <StyledGoalList { ...this.props } goals={ goal.subGoals } />
                </ExpansionPanelDetails>
              </ExpansionPanel> :
              <ExpansionPanel 
                key={ index }
                disabled={ isFetching }
                expanded={ false }>
                <ExpansionPanelSummary>
                  <Goal { ...this.props } goal={ goal } />
                </ExpansionPanelSummary>
              </ExpansionPanel>
        }) }
      </div>
    )
  }
  
}

const StyledGoalList = withStyles(styles)(GoalList)

export default StyledGoalList