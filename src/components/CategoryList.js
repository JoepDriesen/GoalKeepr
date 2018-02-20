import React, { Component } from 'react';

import { withStyles } from 'material-ui/styles'

import { CircularProgress, LinearProgress } from 'material-ui/Progress'

import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import AddIcon from 'material-ui-icons/Add'
import EditIcon from 'material-ui-icons/Edit'
import DeleteIcon from 'material-ui-icons/Delete'

import GoalList from "./GoalList"

const themeClasses = theme => ({
  button: {
    margin: "-15px 0 -15px 10px",
    width: 20,
    height: 20,
    fontSize: 20,
  },
})
const styles = ({
  progress: {
    opacity: 0.3
  },
})

class CategoryList extends Component {
  
  render() {
    const {
      isFetching,
      classes,
      categories,
    } = this.props
    
    return (
      <div>
        { isFetching ?
          <div style={{ position: "absolute", left: 0, right: 0, top: 100, bottom: 0, marginTop: 100, textAlign: "center", zIndex: 10000 }}>
            <CircularProgress style={ styles.progress } />
          </div> : 
          [] }
        { categories.map((category, index) => 
            <ExpansionPanel key={ index } disabled={ isFetching }>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={ classes.heading }>{ category.name }</Typography>
                <Typography className={ classes.heading }>
                  <IconButton className={classes.button} aria-label="Add Goal">
                    <AddIcon />
                  </IconButton>
                  <IconButton className={classes.button} aria-label="Edit Category">
                    <EditIcon />
                  </IconButton>
                  <IconButton className={classes.button} aria-label="Delete Category">
                    <DeleteIcon />
                  </IconButton>
                </Typography>
                <div style={{ flex: 1, margin: "8px 20px" }}>
                  <LinearProgress variant="determinate" value={ category.completeness(category) } />
                </div>
                <Typography>{ `${ category.completeness(category).toFixed(1) }%` }</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <GoalList { ...this.props } goals={ category.goals } />
              </ExpansionPanelDetails>
            </ExpansionPanel>) }
      </div>
    )
  }
  
}

export default withStyles(themeClasses)(CategoryList)