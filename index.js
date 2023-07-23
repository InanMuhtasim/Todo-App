import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://todo-d9268-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const tasksInDB = ref(database, "tasks");
const inputFieldEl = document.getElementById("task-input");
const addButtonEl = document.getElementById("add-task");
const todoListEl = document.getElementById("todo-list");

const clearInputField = () => (inputFieldEl.value = null);

function addTask(task) {
  let taskId = task[0];
  let taskName = task[1];

  const liEl = document.createElement("li");
  const textEL = document.createTextNode(taskName);

  liEl.appendChild(textEL);
  todoListEl.appendChild(liEl);

  liEl.addEventListener("dblclick", function () {
    let exactLocationInDB = ref(database, `tasks/${taskId}`);
    remove(exactLocationInDB);
  });
}

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  push(tasksInDB, inputValue);

  clearInputField();

  console.log(inputValue);
});

onValue(tasksInDB, function (snapshot) {
  if (snapshot.exists()) {
    let tasksArray = Object.entries(snapshot.val());

    todoListEl.innerHTML = "";

    for (let i = 0; i < tasksArray.length; i++) {
      let currentTask = tasksArray[i];
      addTask(currentTask);
    }
  } else {
    todoListEl.innerHTML = "No task added"
  }
});
