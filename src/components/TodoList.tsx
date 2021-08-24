import React, { useState } from 'react'
import { FormControl, InputLabel, Input, Button, List, ListItem, ListItemText, TextField, ListItemSecondaryAction, IconButton, ListItemIcon, Checkbox, Select, MenuItem, Grid, Card, CardContent } from '@material-ui/core'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import DeleteIcon from '@material-ui/icons/Delete'
/**
 * Thank you for applying to Bits of Good. You are free to add/delete/modify any 
 * parts of this project. That includes changing the types.ts, creating css files, 
 * modifying import statements, using contexts, etc. We do recommend to keep it simple. 
 * You will not be judged based on complexity. We also recommend using 
 * multiple components instead of coding everything on this file :)
 * 
 * Have fun! Please reach out to hello@bitsofgood.org or wkim330@gatech.edu if you
 * have any questions!
 * 
 * Bits of Good Engineering Team
 * 
 */
// TODO: Start coding from here

// Here's a baseline todo item type. 
// Feel free to extend or create your own interface!
export type TodoItem = {
  title: string,
  dueDate: Date,
  tagList: string[],
  completed: boolean,
}

export default function TodoList(this: any) {
  const [tags, setTags] = useState([])
  const [toDoItems, setToDoItems] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currTag, setCurrTag] = useState("")
  const [currTitle, setCurrTitle] = useState("")
  const [checked, setChecked] = React.useState(new Map<String, boolean>())
  const forceUpdate = useForceUpdate()
  const [totalTags, setTotalTags] = useState([])
  const [totalTagsMap, setTotalTagsMap] = useState(new Map<String, boolean>())
  const [filterTags, setFilterTags] = useState([])
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (currTitle !== "" && selectedDate !== null) {
      const toDoNew: TodoItem = {title: currTitle, dueDate: selectedDate, tagList: tags, completed: true}
      const newArr: TodoItem[] = toDoItems.concat(toDoNew)
      const tempMap = checked
      tempMap.set(toDoNew.title, false)
      setChecked(tempMap)
      setToDoItems(newArr)
      setTags([])
      setSelectedDate(new Date())
      setCurrTag("")
      setCurrTitle("")
      forceUpdate()
    } else {
      throw new Error("Must fill all input fields.")
    }
  }

  function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
  }
  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
  }
  const reRenderList = () => {
    toDoItems.sort(function compare(a, b) {
      return a.dueDate - b.dueDate;
    })
    forceUpdate()
  }
  const reRenderListCompleted = () => {
    const temp1 = toDoItems.filter((item, index) => checked.get(item.title) === false)
    const temp2 = toDoItems.filter((item, index) => checked.get(item.title) === true)
    const final = temp1.concat(temp2)
    setToDoItems(final)
    forceUpdate()
  }
  const handleInput = (evt: any) => {
    evt.preventDefault()
    console.log(currTag)
    if (tags.length < 12) {
      setTags(tags.concat(currTag))
      setTotalTags(totalTags.concat(currTag))
      const tempMap = totalTagsMap
      tempMap.set(currTag, false)
      setTotalTagsMap(tempMap)
      forceUpdate()
    }
  }
  const handleToggle = (idx: number, toDo: TodoItem) => () => {
    const tempMap = checked
    tempMap.set(toDo.title, !tempMap.get(toDo.title))
    setChecked(tempMap)
    forceUpdate()
  }
  const handleTagChange = (event: any) => {
    const newTag = event.target.value
    setFilterTags(newTag)
    forceUpdate()
  }
  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  }

  return (
    <div>
      <h1>To-Do List</h1>
      <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => {handleSubmit(event)}}>
        <TextField
          label="Title"
          id="margin-normal"
          name="title"
          type="title"
          defaultValue={currTitle}
          value={currTitle}
          helperText="Describe your Todo"
          onChange={(event) => {setCurrTitle(event.target.value)}}
          />
        <TextField
          label="Tag"
          id="margin-normal"
          name="tags"
          type="tags"
          defaultValue={currTag}
          value={currTag}
          helperText="Enter tags"
          onChange={(event) => {setCurrTag(event.target.value)}}
        />
        <Button
            type="button" 
            variant="contained"
            color="primary"
            onClick={(event) => {handleInput(event)}}>
              Add Tag
        </Button>
        <Grid direction="row" container spacing={2} style={{width: '200px', justifySelf: 'center', marginLeft: '40%'}}>
          <Grid xs={12}>
            <List>
              {tags.map((tag, idx) =>
                <ListItem style={{display: 'inline-block', width: '50px' }} key={idx} dense >
                  <ListItemText
                    primary={tag}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={(event) => {setTags(tags.filter(newTag => tag !== newTag))}}>
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>,
              )}  
            </List>
          </Grid>
        </Grid>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date picker inline"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
        <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit Form
          </Button>
      </form>
      <Button style={{margin: '10px'}} variant="contained" color="primary" onClick= {(event) => {reRenderList()}}>Sort By Date</Button>
      <Button style={{margin: '10px'}} variant="contained" color="primary" onClick= {(event) => {reRenderListCompleted()}}>Sort By Completed</Button>
      <FormControl style={{ minWidth: 120, maxWidth: 300, margin: '10px', marginTop: '-10px' }}>
        <InputLabel id="mutiple-checkbox-label">Filter by Tags</InputLabel>
        <Select
          labelId="mutiple-checkbox-label"
          id="mutiple-checkbox"
          multiple
          value={filterTags}
          onChange={handleTagChange}
          input={<Input />}
          MenuProps={MenuProps}
        >
          {totalTags.map((tag, idx) => (
            <MenuItem key={idx} value={tag}>
              <Checkbox checked={filterTags.includes(tag)} />
              <ListItemText primary={tag} />
            </MenuItem> ))}
        </Select>
      </FormControl>
      <List>
          {filterTags.length > 0 ? toDoItems.filter((toDo, idx) => {
            for (let i = 0; i < toDo.tagList.length; i++) {
              if (filterTags.includes(toDo.tagList[i])) {
                return true
              } 
            }
            return false
          }).map((toDo, idx) =>
            <ListItem key={idx} dense onClick={handleToggle(idx, toDo)}>
              <Card style={{width: '40%', marginLeft: '30%'}}>
                <CardContent>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.get(toDo.title)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemSecondaryAction>
                    <IconButton style={{margin: '20px'}} edge="end" aria-label="delete" onClick={(event) => {setToDoItems(toDoItems.filter(newToDo => toDo !== newToDo))}}>
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                  </ListItemSecondaryAction>
                  {toDo.dueDate.toString().slice(0,15)}
                  <ListItemText
                    primary={toDo.title}
                    secondary={toDo.tagList}
                    style={{margin: "40px" }}
                  />
                </CardContent>
              </Card>
            </ListItem>,
          ) : toDoItems.map((toDo, idx) =>
          <Card style={{width: '40%', marginLeft: '30%'}}>
              <CardContent>
                <ListItem key={idx} dense onClick={handleToggle(idx, toDo)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.get(toDo.title)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemSecondaryAction>
                    <IconButton style={{margin: '20px'}} edge="end" aria-label="delete" onClick={(event) => {setToDoItems(toDoItems.filter(newToDo => toDo !== newToDo))}}>
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                  </ListItemSecondaryAction>
                  {toDo.dueDate.toString().slice(0,15)}
                  <ListItemText
                    primary={toDo.title}
                    secondary={String(toDo.tagList)}
                    style={{margin: "40px"}}
                  />
                </ListItem>
              </CardContent>
            </Card>
                )}  
        </List>
    </div>
  )
}  


