function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value;

  if (taskText === "") return;

  const li = document.createElement("li");
  li.textContent = taskText;

  // Supprimer au clic
  li.onclick = function () {
    li.remove();
  };

  document.getElementById("taskList").appendChild(li);

  input.value = "";
}