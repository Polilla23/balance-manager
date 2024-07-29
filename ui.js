import { movements, reasons, getCurrentUserId, movementsTypes } from './data.js';
import { login, addMovementToList, handleNavbarBehaviour, addMovementBehaviour, movementButtonBehaviour, confirmDeleteMovement } from './eventHandlers.js';

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

function generateSummaryChart() {
  const ctx = document.getElementById("summary-chart").getContext("2d");
  const currentUserMovements = movements.filter(
    (m) => m.userId == getCurrentUserId()
  );
  // Calcula el total de ingresos y egresos basados en el reasonId
  const totalIngresos = currentUserMovements
    .filter(
      (movement) =>
        reasons.find((reason) => reason.id === movement.reasonId)
          .movementTypeId === 1
    )
    .reduce((acc, movement) => acc + movement.amount, 0);
  const totalEgresos = currentUserMovements
    .filter(
      (movement) =>
        reasons.find((reason) => reason.id === movement.reasonId)
          .movementTypeId === 2
    )
    .reduce((acc, movement) => acc + movement.amount, 0);
  console.log("Total Ingresos:", totalIngresos);
  console.log("Total Egresos:", totalEgresos);
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

function getMovementTypeName(reasonId) {
  var movementTypeId = reasons.find(
    (reason) => reason.id === reasonId
  ).movementTypeId;
  const mtname = movementsTypes.find((type) => type.id === movementTypeId).name
  console.log('reason id: ' + reasonId + ' movementTypeName: ' + mtname)
  return mtname
}

function showContent(sectionId) {
  const sections = document.getElementsByClassName("content-section");
  for (let section of sections) {
    section.style.display = "none";
  }
  document.getElementById(`${sectionId}-section`).style.display = "block";

  const navLinks = document.getElementsByClassName("nav-link");
  for (let navLink of navLinks) {
    navLink.classList.remove("active");
  }
  document.getElementById(`${sectionId}-link`).classList.add("active");
}

function populateMovementsTable() {
  const movementsTableBody = document.getElementById("movements-table").getElementsByTagName("tbody")[0];
  movementsTableBody.innerHTML = "";

  const currentUserMovements = movements.filter(m => m.userId == getCurrentUserId());
  console.log(currentUserMovements)
  currentUserMovements.forEach(movement => {
    const row = movementsTableBody.insertRow();
    row.insertCell(0).innerText = movement.id;
    row.insertCell(1).innerText = movement.date.toLocaleDateString();
    row.insertCell(2).innerText = reasons.find(reason => reason.id === movement.reasonId).name;
    row.insertCell(3).innerText = movement.notes;
    row.insertCell(4).innerText = movement.amount;
    row.insertCell(5).innerText = getMovementTypeName(reasons.find(reason => reason.id === movement.reasonId).id);
    
    const actionsCell = row.insertCell(6);
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
    editButton.className = "btn btn-sm btn-primary";
    editButton.addEventListener("click", () => openEditModal(movement));
    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.className = "btn btn-sm btn-danger ms-1";
    deleteButton.addEventListener("click", () => confirmDeleteMovement(movement.id));
    actionsCell.appendChild(deleteButton);
  });
}

function resetForm() {
  document.querySelector(".dropdown-toggle").innerText = "Motivo";
  document.querySelector(".dropdown-toggle").removeAttribute("data-selected-reason-id");
  document.querySelectorAll(".dropdown-item").forEach(item => item.classList.remove("active"));
  document.getElementById("amount").value = "";
  document.getElementById("movement-notes").value = "";
}

function assignBehaviours() {
  document.getElementById("login-button").addEventListener("click", login);
  document.getElementById("movement-cancel-button").addEventListener("click", resetForm);
}

export { displayApp, displayError, showContent, populateMovementsTable, resetForm, assignBehaviours, generateSummaryChart };
