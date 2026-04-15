      let tasks = [];
      let currentColumn = "";
      let editTaskId = null;

      const taskCounter = document.getElementById("taskCounter");
      const taskModal = document.getElementById("taskModal");
      const taskTitle = document.getElementById("taskTitle");
      const taskDescription = document.getElementById("taskDescription");
      const taskPriority = document.getElementById("taskPriority");
      const taskDueDate = document.getElementById("taskDueDate");
      const saveTaskBtn = document.getElementById("saveTaskBtn");
      const cancelTaskBtn = document.getElementById("cancelTaskBtn");
      const addTaskButtons = document.querySelectorAll(".addTaskBtn");

      function createTaskCard(taskObj) {

        const li = document.createElement("li");
        li.setAttribute("data-id", taskObj.id);
        li.setAttribute("data-priority", taskObj.priority);
        li.classList.add("task-card");

        const title = document.createElement("h3");
        title.classList.add("task-title");
        title.textContent = taskObj.title;
        li.appendChild(title);

        title.addEventListener("dblclick", function () {
          const input = document.createElement("input");
          input.setAttribute("type", "text");
          input.value = title.textContent;
          input.classList.add("inline-edit-input");

          li.replaceChild(input, title);
          input.focus();

          function saveInlineEdit() {
            const newTitle = input.value.trim();

            if (newTitle !== "") {
              taskObj.title = newTitle;
              title.textContent = newTitle;
            }

            if (li.contains(input)) {
              li.replaceChild(title, input);
            }
          }

          input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
              saveInlineEdit();
            }
          });

          input.addEventListener("blur", function () {
            saveInlineEdit();
          });
        });

        const description = document.createElement("p");
        description.classList.add("task-description");
        description.textContent = taskObj.description;
        li.appendChild(description);

        const priority = document.createElement("span");
        priority.classList.add("priority-badge");
        priority.classList.add(taskObj.priority);
        priority.textContent = taskObj.priority;
        li.appendChild(priority);

        const dueDate = document.createElement("p");
        dueDate.classList.add("task-due-date");
        dueDate.textContent = "Due: " + taskObj.dueDate;
        li.appendChild(dueDate);

        // New Feature 
        if (taskObj.column === "todo") {
          const moveButton = document.createElement("button");
          moveButton.classList.add("move-btn");
          moveButton.setAttribute("data-action", "move");
          moveButton.setAttribute("data-id", taskObj.id);
          moveButton.textContent = "Start";
          li.appendChild(moveButton);
        }

        if (taskObj.column === "inprogress") {
          const moveButton = document.createElement("button");
          moveButton.classList.add("move-btn");
          moveButton.setAttribute("data-action", "move");
          moveButton.setAttribute("data-id", taskObj.id);
          moveButton.textContent = "Finish";
          li.appendChild(moveButton);
        }

        const editButton = document.createElement("button");
          editButton.classList.add("edit-btn");
          editButton.setAttribute("data-action", "edit");
          editButton.setAttribute("data-id", taskObj.id);
          editButton.textContent = "Edit";
          li.appendChild(editButton);

          const deleteButton = document.createElement("button");
          deleteButton.classList.add("delete-btn");
          deleteButton.setAttribute("data-action", "delete");
          deleteButton.setAttribute("data-id", taskObj.id);
          deleteButton.textContent = "Delete";
          li.appendChild(deleteButton);
        return li;
      }

      const taskLists = document.querySelectorAll("section ul");

        taskLists.forEach(function (taskList) {
          taskList.addEventListener("click", function (event) {
            const action = event.target.getAttribute("data-action");
            const idStr = event.target.getAttribute("data-id");

            if (!action || !idStr) {
              return;
            }

            const taskId = parseInt(idStr, 10);

            if (action === "edit") {
              editTask(taskId);
            }

            if (action === "delete") {
              deleteTask(taskId);
            }
            if (action === "move") {
              moveTask(taskId);
            }
          });
        });

      function addTask(columnId, taskObj) {
        tasks.push(taskObj);

        const column = document.getElementById(columnId);
        const taskList = column.querySelector("ul");
        const taskCard = createTaskCard(taskObj);

        taskList.appendChild(taskCard);
        updateTaskCounter();
      }

      function deleteTask(taskId) {
        const card = document.querySelector('[data-id="' + taskId + '"]');

        if (card) {
          card.classList.add("fade-out");

          card.addEventListener("animationend", function () {
            card.remove();

            tasks = tasks.filter(function (task) {
              return task.id !== taskId;
            });

            updateTaskCounter();
          });
        }
      }

      function editTask(taskId) {
        const task = tasks.find(function (item) {
          return item.id === taskId;
        });

        if (task) {
          taskTitle.value = task.title;
          taskDescription.value = task.description;
          taskPriority.value = task.priority;
          taskDueDate.value = task.dueDate;

          currentColumn = task.column;
          editTaskId = taskId;

          taskModal.classList.remove("hidden");
        }
      }

      function updateTask(taskId, updatedData) {
        const task = tasks.find(function (item) {
          return item.id === taskId;
        });

        if (task) {
          task.title = updatedData.title;
          task.description = updatedData.description;
          task.priority = updatedData.priority;
          task.dueDate = updatedData.dueDate;
          task.column = updatedData.column;

          const oldCard = document.querySelector('[data-id="' + taskId + '"]');
          const newCard = createTaskCard(task);

          if (oldCard) {
            const oldColumn = oldCard.parentElement;
            oldCard.remove();

            const newColumn = document.getElementById(task.column).querySelector("ul");
            newColumn.appendChild(newCard);
          }

          updateTaskCounter();
        }
      }

      // New Feature
      function moveTask(taskId) {
        const task = tasks.find(function (item) {
          return item.id === taskId;
        });

        if (!task) {
          return;
        }

        if (task.column === "todo") {
          task.column = "inprogress";
        } else if (task.column === "inprogress") {
          task.column = "done";
        } else {
          return;
        }

        const oldCard = document.querySelector('[data-id="' + taskId + '"]');
        const newCard = createTaskCard(task);

        if (oldCard) {
          oldCard.remove();

          const newColumn = document.getElementById(task.column).querySelector("ul");
          newColumn.appendChild(newCard);
        }
      }


      function updateTaskCounter() {
          taskCounter.textContent = tasks.length + " Tasks";
        }

        const priorityFilter = document.getElementById("priorityFilter");

        priorityFilter.addEventListener("change", function () {
          const selectedPriority = priorityFilter.value;
          const allCards = document.querySelectorAll(".task-card");

          allCards.forEach(function (card) {
            const cardPriority = card.getAttribute("data-priority");

            const shouldHide =
              selectedPriority !== "all" && cardPriority !== selectedPriority;

            card.classList.toggle("is-hidden", shouldHide);
          });
        });

        const clearDoneBtn = document.getElementById("clearDoneBtn");

          clearDoneBtn.addEventListener("click", function () {
            const doneList = document.querySelector("#done ul");
            const doneCards = doneList.querySelectorAll(".task-card");

            doneCards.forEach(function (card, index) {
              setTimeout(function () {
                card.classList.add("fade-out");

                card.addEventListener("animationend", function () {
                  const taskId = Number(card.getAttribute("data-id"));

                  card.remove();

                  tasks = tasks.filter(function (task) {
                    return task.id !== taskId;
                  });

                  updateTaskCounter();
                }, { once: true });
              }, index * 100);
            });
          });

          addTaskButtons.forEach(function (button) {
            button.addEventListener("click", function () {
              currentColumn = button.getAttribute("data-column");
              editTaskId = null;

              taskTitle.value = "";
              taskDescription.value = "";
              taskPriority.value = "high";
              taskDueDate.value = "";

              taskModal.classList.remove("hidden");
            });
          });

          cancelTaskBtn.addEventListener("click", function () {
            taskModal.classList.add("hidden");
          });

          saveTaskBtn.addEventListener("click", function () {
            const titleValue = taskTitle.value.trim();
            const descriptionValue = taskDescription.value.trim();
            const priorityValue = taskPriority.value;
            const dueDateValue = taskDueDate.value;

            if (titleValue === "") {
              return;
            }

            if (editTaskId !== null) {
              updateTask(editTaskId, {
                title: titleValue,
                description: descriptionValue,
                priority: priorityValue,
                dueDate: dueDateValue,
                column: currentColumn
              });
            } else {
              const taskObj = {
                id: Date.now(),
                title: titleValue,
                description: descriptionValue,
                priority: priorityValue,
                dueDate: dueDateValue,
                column: currentColumn
              };

              addTask(currentColumn, taskObj);
            }

            taskModal.classList.add("hidden");
          });
          // Final version 
    