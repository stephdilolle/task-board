// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Save tasks and nextId to localStorage
function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  return `
      <div class="task-card card mb-3" id="task-${task.id}" style="background-color: #f8f9fa;">
          <div class="card-body">
              <h5 class="card-title">${task.title}</h5>
              <p class="card-text">${task.description}</p>
              <p class="card-text"><small class="text-muted">Deadline: ${task.deadline}</small></p>
              <button class="btn btn-danger btn-sm delete-task-button">Delete</button>
          </div>
      </div>
  `;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList(tasks) {
    const toDoContainer = $('#todo-cards');
    const inProgressContainer = $('#in-progress-cards');
    const doneContainer = $('#done-cards');

    toDoContainer.empty();
    inProgressContainer.empty();
    doneContainer.empty();

    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        switch (task.status) {
            case 'to-do':
                toDoContainer.append(taskCard);
                break;
            case 'in-progress':
                inProgressContainer.append(taskCard);
                break;
            case 'done':
                doneContainer.append(taskCard);
                break;
        }
        $(`#task-${task.id}`).draggable({
            containment: 'body',
            cursor: 'move'
        });
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(newTask) {
    taskList.push(newTask);
    saveToLocalStorage();
    renderTaskList(taskList);
}

// Todo: create a function to handle deleting a task

function handleDeleteTask(taskId) {
  const taskIndex = taskList.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
      taskList.splice(taskIndex, 1);
      $(`#task-${taskId}`).remove();
      saveToLocalStorage();
  } else {
      console.log('Task not found.');
  }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDropEvent(event, ui) {
    const taskId = ui.draggable.attr('id').replace('task-', '');
    const newStatus = $(this).parent().attr('id').replace('-cards', '');
    const taskIndex = taskList.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        taskList[taskIndex].status = newStatus;
        saveToLocalStorage();
        renderTaskList(taskList);
    }
}
  
// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function() {
    renderTaskList(taskList);

    $('#addTaskForm').submit(function(event) {
        event.preventDefault();
        const newTask = {
            id: generateTaskId(),
            title: $('#taskTitle').val(),
            description: $('#taskDescription').val(),
            deadline: $('#dueDate').val(),
            status: 'to-do'  // Default to 'to-do' status
        };
        handleAddTask(newTask);
        $('#addTaskModal').modal('hide');  // Hide the modal after adding the task
        $(this).trigger('reset');  // Reset the form
    });

    $(document).on('click', '.delete-task-button', function() {
        const taskId = $(this).closest('.task-card').attr('id').replace('task-', '');
        handleDeleteTask(taskId);
    });

    $('.card-body').droppable({
        accept: '.task-card',
        drop: handleDropEvent
    });

    $('#dueDate').datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'mm/dd/yy'
    });
});
