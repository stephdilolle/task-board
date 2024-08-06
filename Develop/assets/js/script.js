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
    <div class="task-card card mb-3" id="task-${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <p class="card-text"><small class="text-muted">Deadline: ${task.deadline}</small></p>
        <button class="btn btn-danger delete-task-button">Delete</button>
      </div>
    </div>
  `;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList(tasks) {
  $('#todo-cards').empty();
  $('#in-progress-cards').empty();
  $('#done-cards').empty();

  tasks.forEach(task => {
    const taskCard = createTaskCard(task);
    $(`#${task.status}-cards`).append(taskCard);
    $(`#task-${task.id}`).draggable({
      containment: '.swim-lanes',
      cursor: 'move',
      revert: 'invalid'
    });
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(newTask) {
  taskList.push(newTask);
  const newTaskCard = createTaskCard(newTask);
  $(`#${newTask.status}-cards`).append(newTaskCard);
  $(`#task-${newTask.id}`).draggable({
    containment: '.swim-lanes',
    cursor: 'move',
    revert: 'invalid'
  });
  saveToLocalStorage();
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
  const newStatus = $(this).attr('id').replace('-cards', '');
  const taskIndex = taskList.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    taskList[taskIndex].status = newStatus;
    saveToLocalStorage();
    renderTaskList(taskList); // Re-render the task list to reflect the changes
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
      status: 'to-do'
    };
    handleAddTask(newTask);
    $('#addTaskModal').modal('hide'); // Hide the modal after adding the task
    saveToLocalStorage();
  });

  $(document).on('click', '.delete-task-button', function() {
    const taskId = $(this).closest('.task-card').attr('id').replace('task-', '');
    handleDeleteTask(taskId);
  });

  $('.card-body').droppable({
    accept: '.task-card',
    drop: handleDropEvent,
    tolerance: 'intersect',
    hoverClass: 'ui-state-highlight'
  });
});
