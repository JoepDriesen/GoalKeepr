export async function migrateDb(dbOld, db) {
  const jsonDump = (await dbOld.dump()).filter(r => r.labels.length > 0)
  
  console.log(jsonDump.length)
  console.log(jsonDump)
  
  db.load(jsonDump)
}

export async function getAllCategories(db) {
  return (await db.getCollection("category").read()).map(c => ({
    ...c,
    id: parseInt(c.id, 10),
    goals: [],
  }))
}

export async function getAllGoals(db) {
  return (await db.getCollection("goal").read()).map(g => ({
    ...g,
    id: parseInt(g.id, 10),
    category: isNaN(g.category) || g.category === "" ? g.category : parseInt(g.category, 10),
    parent: isNaN(g.parent) || g.parent === "" ? undefined : parseInt(g.parent, 10),
    subGoals: [],
    ordinal: isNaN(g.ordinal) || g.ordinal === "" ? 0 : parseInt(g.ordinal, 10),
    currentValue: g.type === "boolean" ?
      g.current_value :
      isNaN(g.current_value) || g.current_value === "" ? 0 : parseInt(g.current_value, 10),
    maxValue: isNaN(g.max_value) || g.max_value === "" ? 0 : parseInt(g.max_value, 10),
    date1: g.date1 === undefined ? undefined : new Date(g.date1),
    date2: g.date2 === undefined ? undefined : new Date(g.date2),
  }))
}

export async function updateGoal(db, goal) {
  const dbGoal = {
    ...goal,
    category: isNaN(goal.category) || goal.category === "" ? undefined : goal.category,
    parent: isNaN(goal.parent) || goal.parent === "" ? undefined : goal.parent,
    ordinal: isNaN(goal.ordinal) || goal.ordinal === "" ? 0 : goal.ordinal,
    current_value: goal.type === "boolean" ?
      goal.currentValue === "on" ? goal.currentValue : undefined :
      isNaN(goal.currentValue) || goal.currentValue === "" ? undefined : goal.currentValue,
    max_value: isNaN(goal.maxValue) || goal.maxValue === "" ? undefined : goal.maxValue,
  }
  delete dbGoal.currentValue
  delete dbGoal.maxValue
  delete dbGoal.subGoals
  
  return await db.getCollection("goal").update(dbGoal)
}