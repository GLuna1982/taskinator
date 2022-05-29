var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function(event) {

    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    //check ig input values are empty strings
    if(!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    // resets form
    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");

    //has data attribute, so get task id and call function to complete edit process
    if(isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }

    //no data attribute, so create object as normal and pass to createTaskEl function
    else {
    //package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
    };

    createTaskEl(taskDataObj);
    }  
};

var createTaskEl = function (taskDataObj) {
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and to list item
    var taskInfoEl = document.createElement("div");

    //give it a class name
    taskInfoEl.className = "task-info";

    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    //add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    saveTasks();

    // increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    //create drowndown menur
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do","In Progress","Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
        saveTasks();
    }    
    return actionContainerEl;
};


// function to delete tasks
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    //loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    //reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    saveTasks();
};

// function to edit tasks
var editTask = function(taskId) {
    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    document.querySelector("input[name='task-name']").value = taskName;

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    document.querySelector("select[name='task-type']").value = taskType;

    // changes Add Task button to Save Task when editing task
    document.querySelector("#save-task").textContent = "Save Task";
    
    //adds task id to the task being edited
    formEl.setAttribute("data-task-id",taskId);
    formEl.querySelector("save-task").textContent = "Save Tasks";

};

// function that saves edit
var completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    for (var i = 0; i < tasks.length; i++) {
        if(tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";

    saveTasks();
};

var taskButtonHandler = function(event) {
    //get target element from event
    var targetEl = event.target;

    //edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    // delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        // get the element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var taskStatusChangeHandler = function(event) {

    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

     //find the parent task item element based on the id
     var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

   

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    //update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }  
    }

    saveTasks();
};

//function save tasks in local storage
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function() {
    // get tasks items from localStorage
    var savedTasks = localStorage.getItem("tasks");

    // convert tasks from a string back into an array of objects
    if (!savedTasks) {
        return false;
    }
    console.log("Saved tasks found!");

    // iterate tasks through an array and create task elements on page
    savedTasks = JSON.parse(savedTasks);

    // loop through savedTasks array
    for (var i = 0; i < savedTasks.length; i++) {
        // pass each task object into the 'createTaskEl()' function
        createTaskEl(savedTasks[i]);
        
    }

};



formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();






