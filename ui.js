import { reasons, movements, currentUserId, currentMovementToEdit } from './data.js';
import { saveMovement } from './main.js';

// Funciones relacionadas con la UI

function showContent(sectionId) {
  const sections = document.getElementsByClassName("content-section");
  for (let section of sections) {
    section.style.display = "none";
  }
  document.getElementById(sectionId + "-section").style.display = "block";

  const navLinks = document.getElementsByClassName("nav-link");
  for (let navLink of navLinks) {
    navLink.classList.remove("active");
  }
  document.getElementById(sectionId + "-link").classList.add("active");
}

function populateMovementsTable() {
  const movementsTableBody = document
    .getElementById("movements-table")
    .getElementsByTagName("tbody")[0];

  movementsTableBody.innerHTML = "";
  const currentUserMovements = movements.filter(
    (m) => m.userId == currentUserId
  );

  currentUserMovements.forEach((movement) => {
    const row = movementsTableBody.insertRow();
    row.insertCell(0).innerText = movement.id;
    row.insertCell(1).innerText = movement.date.toLocaleDateString();
    row.insertCell(2).innerText = reasons.find(
      (reason) => reason.id === movement.reasonId
    ).name;
    row.insertCell(3).innerText = movement.notes;
    row.insertCell(4).innerText = movement.amount;
    row.insertCell(5).innerText = getMovementTypeName(
      reasons.find((reason) => reason.id === movement.reasonId).id
    );
    const actionsCell = row.insertCell(6);
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
    editButton.className = "btn btn-sm btn-primary";
    editButton.addEventListener("click", () => openEditModal(movement));
    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.className = "btn btn-sm btn-danger ms-1";
    deleteButton.addEventListener("click", () =>
      confirmDeleteMovement(movement.id)
    );
    actionsCell.appendChild(deleteButton);
  });
}

function resetForm() {
  document.querySelector(".dropdown-toggle").innerText = "Motivo";
  document
    .querySelector(".dropdown-toggle")
    .removeAttribute("data-selected-reason-id");
  document
    .querySelectorAll(".dropdown-item")
    .forEach((item) => item.classList.remove("active"));
  document.getElementById("amount").value = "";
  document.getElementById("movement-notes").value = "";
}

function openEditModal(movement) {
  document.getElementById("movement-type").value = getMovementTypeName(movement.reasonId);
  document.getElementById("movement-type").setAttribute("data-movement-type-id",reasons.find((reason) => reason.id === movement.reasonId).movementTypeId);
  document.querySelector(".dropdown-toggle").innerText = reasons.find((reason) => reason.id === movement.reasonId).name;
  document.querySelector(".dropdown-toggle").setAttribute("data-selected-reason-id", movement.reasonId);
  document.getElementById("amount").value = movement.amount;
  document.getElementById("movement-notes").value = movement.notes;

  currentMovementToEdit = movement;

  // Cambiar el texto del botón y agregar evento de edición
  const addButton = document.getElementById("movement-add-button");
  addButton.innerText = "Guardar";
  addButton.onclick = () => saveMovement(movement);

  // Abrir el modal
  const modalElement = new bootstrap.Modal(document.getElementById("entries-page"));
  modalElement.show();
}

export { showContent, populateMovementsTable, resetForm, openEditModal };