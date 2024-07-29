import { users, movements, reasons, movementsTypes, movementTypesButton, setCurrentUserId, getCurrentUserId, setCurrentMovementToEdit, getCurrentMovementToEdit } from './data.js';
import { displayApp, displayError, showContent, populateMovementsTable, resetForm, generateSummaryChart } from './ui.js';
import { Movement } from './models.js';

function login(e) {
  e.preventDefault();

  const email = document.getElementById("input-email").value;
  const password = document.getElementById("input-password").value;

  const userFound = users.find(user => user.email == email);

  if (userFound && userFound.password === password) {
    setCurrentUserId(userFound.userId);
    displayApp();
  } else {
    displayError();
  }
}

function addMovement(e, movementType) {
  e.preventDefault();
  const movementTypeText = document.getElementById("movement-type");
  movementTypeText.value = movementType.name;
  document.getElementById("movement-type").setAttribute("data-movement-type-id", movementType.id);
  populateReasonsDropdown(movementType.id);
}

function addMovementToList(e) {
  e.preventDefault();

  const movementTypeId = document.getElementById("movement-type").getAttribute("data-movement-type-id");
  const reasonId = Number(document.querySelector(".dropdown-toggle").getAttribute("data-selected-reason-id"));

  console.log(reasonId)
  if (!reasonId) {
    alert("Seleccione un motivo!");
    return;
  }

  const amount = parseFloat(document.getElementById("amount").value);
  const notes = document.getElementById("movement-notes").value;

  if (isNaN(amount) || amount <= 0) {
    alert("Ingrese un monto válido");
    return;
  }

  const newMovement = new Movement(
    getCurrentMovementToEdit().id !== null ? getCurrentMovementToEdit().id : movements.at(-1).id + 1,
    new Date(),
    reasonId,
    notes,
    amount,
    getCurrentUserId()
  );

  saveMovement(newMovement);

  populateMovementsTable();
  generateSummaryChart();

  resetForm();

  const modalElement = document.getElementById("entries-page");
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();
}

function saveMovement(movement) {
  const currentMovementInArray = movements.find((m) => m.id === movement.id);
  if (currentMovementInArray) {
    currentMovementInArray.amount = movement.amount;
    currentMovementInArray.date = new Date();
    currentMovementInArray.notes = movement.notes;
    currentMovementInArray.reasonId = movement.reasonId;
  } else {
    movements.push(movement);
  }
  setCurrentMovementToEdit (new Movement(null, null, null, null, null, null));
}

function confirmDeleteMovement(movementId) {
  if (confirm("¿Estás seguro de que deseas eliminar este movimiento?")) {
    deleteMovement(movementId);
  }
}

function deleteMovement(movementId) {
  const movementIndex = movements.findIndex(m => m.id === movementId);
  movements.splice(movementIndex, 1);

  console.log("Movimiento eliminado:", movementId);

  populateMovementsTable();
  generateSummaryChart();
}

function handleNavbarBehaviour() {
  document.getElementById("summary-link").addEventListener("click", () => {
    showContent("summary");
    generateSummaryChart();
  });
  document.getElementById("movements-link").addEventListener("click", () => {
    showContent("movements");
    populateMovementsTable();
  });
}

function addMovementBehaviour() {
  movementsTypes.forEach((mt) => {
    const buttonId = movementTypesButton.find(
      (mtb) => mtb.type == mt.name
    ).button;
    if (buttonId) {
      document.getElementById(buttonId).addEventListener("click", (e) => addMovement(e, mt));
    }
  });
}

function movementButtonBehaviour() {
  document.getElementById("movement-add-button").addEventListener("click", (e) => addMovementToList(e));
  document.getElementById("movement-cancel-button").addEventListener("click", () => {
    resetForm();
    const addButton = document.getElementById("movement-add-button");
    addButton.innerText = "Agregar";
  });
}

function populateReasonsDropdown(movementTypeId) {
  const dropdownMenu = document.getElementById("reasons-dropdown");
  const dropdownToggle = document.querySelector(".dropdown-toggle");

  dropdownMenu.innerHTML = "";

  const filteredReasons = reasons.filter(
    (reason) => reason.movementTypeId === movementTypeId
  );
  filteredReasons.forEach((filteredReason) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "dropdown-item";
    a.href = "#";
    a.innerText = filteredReason.name;
    a.addEventListener("click", function () {
      dropdownToggle.innerText = filteredReason.name;
      dropdownToggle.setAttribute("data-selected-reason-id", filteredReason.id);
      document.querySelectorAll(".dropdown-item").forEach((item) => item.classList.remove("active"));
      a.classList.add("active");
    });
    li.appendChild(a);
    dropdownMenu.appendChild(li);
  });
}

export { login, handleNavbarBehaviour, populateMovementsTable, generateSummaryChart, addMovementBehaviour, movementButtonBehaviour, addMovementToList, confirmDeleteMovement, deleteMovement };
