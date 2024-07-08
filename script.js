assignBehaviours();

class User {
    constructor(email, password, userId) {
      this.email = email;
      this.password = password;
      this.userId = userId;
    }
}

class MovementType {
    constructor(id, name){
        this.id = id;
        this.name = name
    }
}

class Reason {
    constructor(id, name, movementTypeId){
        this.id = id,
        this.name = name,
        this.movementTypeId = movementTypeId
    }
}

class Movement {
    constructor(id, date, reasonId, notes, amount, userId){
        this.id = id;
        this.date = date;
        this.reasonId = reasonId;
        this.notes = notes;
        this.amount = amount;
        this.userId = userId;
    }
}

const movementType1 = new MovementType(1, 'Ingreso');
const movementType2 = new MovementType(2, 'Egreso');

const reason1 = new Reason(1, 'Razon 1', 1);
const reason2 = new Reason(2, 'Razon 2', 1);
const reason3 = new Reason(3, 'Razon 3', 1);
const reason4 = new Reason(4, 'Razon 4', 1);
const reason5 = new Reason(5, 'Razon 5', 1);
const reason6 = new Reason(6, 'Razon 6', 2);
const reason7 = new Reason(7, 'Razon 7', 2);
const reason8 = new Reason(8, 'Razon 8', 2);
const reason9 = new Reason(9, 'Razon 9', 2);
const reason10 = new Reason(10, 'Razon 10', 2);

const movement1 = new Movement(1, new Date(), 2, 'nota1', 1200, 1);
const movement2 = new Movement(1, new Date(), 1, 'nota1', 2500, 1);
const movement3 = new Movement(1, new Date(), 9, 'nota1', 1000, 1);

const user1 = new User('user1@example.com', '123', 1);
const user2 = new User('user2@example.com', '456', 2);
var currentUserId = null;

// Creando un array con los dos usuarios
const users = [user1, user2];

const movementsTypes = [movementType1, movementType2];
const reasons = [reason1, reason2, reason3, reason4, reason5, reason6, reason7, reason8, reason9, reason10];
const movements = [movement1, movement2, movement3];

console.log(users)

function login(e){
    e.preventDefault();

    const email = document.getElementById("input-email").value
    const password = document.getElementById("input-password").value

    const userFound = users.find((user) => user.email == email)
    console.log(userFound)
    
    if(userFound && password == userFound.password){
        currentUserId = userFound.userId;
        displayApp()
    } else {
        displayError()
    }
}

function assignBehaviours(){
    document.getElementById("login-button").addEventListener("click", (e) => login(e))
}

function displayApp(){
    document.getElementById("login-page").style.display = 'none'
    document.getElementById("app-container").style.display = 'block'
    handleNavbarBehaviour();
    populateMovementsTable();
    generateSummaryChart();
}

function displayError(){
    document.getElementById("wrong-password").style.display = 'block'
}

function handleNavbarBehaviour(){
    document.getElementById("summary-link").addEventListener("click", () => {
        showContent('summary');
        generateSummaryChart();
    });
    document.getElementById("movements-link").addEventListener("click", () => {
        showContent('movements');
        populateMovementsTable();
    });
}

function showContent(sectionId){
    const sections = document.getElementsByClassName('content-section');
    for (let section of sections) {
        section.style.display = 'none';
    }
    document.getElementById(sectionId+'-section').style.display = 'block';

    const navLinks = document.getElementsByClassName('nav-link')
    for (let navLink of navLinks){
        navLink.classList.remove('active')
    }
    document.getElementById(sectionId+'-link').classList.add('active');
}

function populateMovementsTable(){
    const movementsTableBody = document.getElementById('movements-table').getElementsByTagName('tbody')[0];
    
    movementsTableBody.innerHTML = '';
    const currentUserMovements = movements.filter(m => m.userId == currentUserId);

    console.log('currentUserMovs', currentUserMovements);
    currentUserMovements.forEach(movement => {
        const row = movementsTableBody.insertRow();
        row.insertCell(0).innerText = movement.id;
        row.insertCell(1).innerText = movement.date.toLocaleDateString();
        row.insertCell(2).innerText = reasons.find(reason => reason.id === movement.reasonId).name;
        row.insertCell(3).innerText = movement.note;
        row.insertCell(4).innerText = movement.amount;
        row.insertCell(5).innerText = getMovementTypeName(reasons.find(reason => reason.id === movement.reasonId).id);
    })
}

function getMovementTypeName(reasonId){
    var movementTypeId = reasons.find(reason => reason.id === reasonId).movementTypeId
    return movementsTypes.find(type => type.id === movementTypeId).name
}

function generateSummaryChart() {
    const ctx = document.getElementById('summary-chart').getContext('2d');
    const currentUserMovements = movements.filter(m => m.userId == currentUserId);
    // Calcula el total de ingresos y egresos basados en el reasonId
    const totalIngresos = currentUserMovements
        .filter(movement => 
            reasons.find(reason => reason.id === movement.reasonId).movementTypeId === 1
        ).reduce((acc, movement) => acc + movement.amount, 0);

    const totalEgresos = currentUserMovements
        .filter(movement => reasons.find(reason => reason.id === movement.reasonId).movementTypeId === 2)
        .reduce((acc, movement) => acc + movement.amount, 0);

    console.log('Total Ingresos:', totalIngresos);
    console.log('Total Egresos:', totalEgresos);

    // Destruir el gráfico anterior si existe
    if (window.summaryChart) {
        window.summaryChart.destroy();
    }

    // Crear el nuevo gráfico
    window.summaryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Ingresos', 'Egresos'],
            datasets: [{
                label: 'Resumen de Movimientos',
                data: [totalIngresos, totalEgresos],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': $' + tooltipItem.raw;
                        }
                    }
                }
            }
        }
    });
}
