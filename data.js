import { User, MovementType, Reason, Movement } from './models.js';

// Instancias de MovementType
const movementType1 = new MovementType(1, "Ingreso");
const movementType2 = new MovementType(2, "Egreso");

// Botones de MovementType
const movementTypesButton = [
  { type: "Ingreso", button: "add-income" },
  { type: "Egreso", button: "add-egress" }
];

// Instancias de Reason
const reasons = [
  new Reason(1, "Razon 1", 1),
  new Reason(2, "Razon 2", 1),
  new Reason(3, "Razon 3", 1),
  new Reason(4, "Razon 4", 1),
  new Reason(5, "Razon 5", 1),
  new Reason(6, "Razon 6", 2),
  new Reason(7, "Razon 7", 2),
  new Reason(8, "Razon 8", 2),
  new Reason(9, "Razon 9", 2),
  new Reason(10, "Razon 10", 2),
];

// Instancias de Movement
const movements = [
  new Movement(1, new Date(), 2, "Nota 1", 1200, 1),
  new Movement(2, new Date(), 1, "Nota 2", 2500, 1),
  new Movement(3, new Date(), 9, "Nota 3", 1000, 1),
];

// Instancias de User
const users = [
  new User("user1@example.com", "123", 1),
  new User("user2@example.com", "456", 2)
];

const movementsTypes = [movementType1, movementType2]

let currentUserId = null;
let currentMovementToEdit = new Movement(null, null, null, null, null, null);

function setCurrentUserId(id){
  currentUserId = id
}

function getCurrentUserId(){
  return currentUserId;
}

function setCurrentMovementToEdit(movement){
  currentMovementToEdit = movement;
}

function getCurrentMovementToEdit(){
  return currentMovementToEdit;
}

export { users, movements, reasons, movementTypesButton, movementsTypes, setCurrentUserId, getCurrentUserId, setCurrentMovementToEdit, getCurrentMovementToEdit };
