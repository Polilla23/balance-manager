import { users, movements, currentUserId, currentMovementToEdit, reasons, movementTypesButton, movementsTypes } from './data.js';
import { showContent, populateMovementsTable, resetForm, openEditModal } from './ui.js';

// Funciones principales

function login(e) {
  e.preventDefault();

  const email = document.getElementById("input-email").value;
  const password = document.getElementById("input-password").value;

  const userFound = users.find((user) => user.email == email);

  if (userFound && password == userFound.password) {
    currentUserId = userFound.userId;
    displayApp();
  } else {
    displayError();
  }
}

function assignBehaviours() {
  document.getElementById("login-button").addEventListener("click", (e) => login(e));
}

function displayApp() {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("app-container").style.display = "block";
  handleNavbarBehaviour();
  populateMovementsTable();
  generateSummaryChart();
  addMovementBehaviour();
  movementButtonBehaviour();
}

function displayError() {
  document.getElementById("wrong-password").style.display = "block";
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
      document
        .getElementById(buttonId)
        .addEventListener("click", (e) => addMovement(e, mt));
    }
  });
}

function movementButtonBehaviour() {
  document.getElementById("movement-add-button").addEventListener("click", (e) => addMovementToList(e));
  document.getElementById("movement-cancel-button").addEventListener("click", () => {
    resetForm();
    const addButton = document.getElementById("movement-add-button");
    addButton.innerText = "Agregar";
    addButton.onclick = addMovementToList;
  });
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
    currentMovementToEdit.id !== null ? currentMovementToEdit.id : movements.at(-1).id + 1,
    new Date(),
    reasonId,
    notes,
    amount,
    currentUserId
  );

  saveMovement(newMovement);

  populateMovementsTable();
  generateSummaryChart();

  resetForm();

  const modalElement = document.getElementById("entries-page");
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();
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

function generateSummaryChart() {
  const ctx = document.getElementById("summary-chart").getContext("2d");
  const currentUserMovements = movements.filter((m) => m.userId == currentUserId);
  // Calcula el total de ingresos y egresos basados en el reasonId
  const totalIngresos = currentUserMovements
    .filter((movement) => reasons.find((reason) => reason.id === movement.reasonId).movementTypeId === 1)
    .reduce((acc, movement) => acc + movement.amount, 0);

  const totalEgresos = currentUserMovements
    .filter((movement) => reasons.find((reason) => reason.id === movement.reasonId).movementTypeId === 2)
    .reduce((acc, movement) => acc + movement.amount, 0);

  // Destruir el gráfico anterior si existe
  if (window.summaryChart) {
    window.summaryChart.destroy();
  }

  // Crear el nuevo gráfico
  window.summaryChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Ingresos", "Egresos"],
      datasets: [
        {
          label: "Resumen de Movimientos",
          data: [totalIngresos, totalEgresos],
          backgroundColor: ["#36A2EB", "#FF6384"],
          hoverBackgroundColor: ["#36A2EB", "#FF6384"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.label + ": $" + tooltipItem.raw;
            },
          },
        },
      },
    },
  });
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
  currentMovementToEdit = new Movement(null, null, null, null, null, null);
}

assignBehaviours();

export { saveMovement };