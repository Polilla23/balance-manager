class User {
    constructor(email, password, userId) {
      this.email = email;
      this.password = password;
      this.userId = userId;
    }
  }
  
  class MovementType {
    constructor(id, name) {
      this.id = id;
      this.name = name;
    }
  }
  
  class Reason {
    constructor(id, name, movementTypeId) {
      this.id = id;
      this.name = name;
      this.movementTypeId = movementTypeId;
    }
  }
  
  class Movement {
    constructor(id, date, reasonId, notes, amount, userId) {
      this.id = id;
      this.date = date;
      this.reasonId = reasonId;
      this.notes = notes;
      this.amount = amount;
      this.userId = userId;
    }
  }
  
  export { User, MovementType, Reason, Movement };
  