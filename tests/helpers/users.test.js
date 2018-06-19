const { expect } = require('chai');

const Users = require('../../app/helpers/users');

const buildUser = () => ({ id: 3, name: 'User 3', roomId: 'Room 1' });
const buildUsers = () => ([
  { id: 1, name: 'User 1', roomId: 'Room 1' },
  { id: 2, name: 'User 2', roomId: 'Room 2' }
]);

describe('Users Helper', () => {
  describe('Users', () => {
    let users;

    beforeEach(() => {
      users = new Users();
      users.users = buildUsers();
    });

    describe('#addUser', () => {
      it('adds new user', () => {
        const user = buildUser();
        users.addUser(user.id, user.name, user.roomId);

        expect(users.users).to.include.deep.members([user]);
      });
    });

    describe('#removeUser', () => {
      it('removes user from the list and returns it', () => {
        const user = buildUser();
        users.users = [...buildUsers(), user];

        expect(users.users).to.have.lengthOf(3);
        expect(users.removeUser(user.id)).to.deep.equal(user);
        expect(users.users).to.have.lengthOf(2);
      });

      it('returns undefined if user does not exist', () => {
        expect(users.users).to.have.lengthOf(2);
        expect(users.removeUser(123)).to.be.undefined;
        expect(users.users).to.have.lengthOf(2);
      });
    });

    describe('#getUser', () => {
      it('returns user if user_id is valid', () => {
        const user = users.users[1];
        expect(users.getUser(user.id)).to.deep.equal(user);
      });

      it('does not return user if user_id is not found', () => {
        expect(users.getUser(123)).to.be.undefined;
      });
    });

    describe('#getUserList', () => {
      it('returns lists of user names for the roomId', () => {
        expect(users.getUserList('Room 1')).to.deep.equal(['User 1']);
      });
    });
  });
});
