class Users {
  constructor(users) {
    this.users = [];
  }

  addUser(id, name, roomId) {
    const user = { id, name, roomId };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    const user = this.getUser(id);

    if (user) {
      this.users = this.users.filter(u => u.id !== id);
    }

    return user;
  }

  getUser(id) {
    return this.users.find(user => user.id === id);
  }

  getUserList(roomId) {
    const users = this.users.filter(user => user.roomId === roomId);
    const namesArray = users.map(user => user.name);

    return namesArray;
  }
}

module.exports = Users;
