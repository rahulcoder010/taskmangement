const assert = require('assert');
const sinon = require('sinon');
const userController = require('../controller/user');

describe('User Controller', () => {
  describe('allUsers', () => {
    it('should return all users', async () => {
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await userController.allUsers(req, res);

      assert(res.status.calledWith(200));
      assert(res.json.calledOnce);
    });

    it('should return an error if there is an exception', async () => {
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const error = { message: 'Internal Server Error' };

      sinon.stub(Users, 'findAll').throws(error);

      await userController.allUsers(req, res);

      assert(res.status.calledWith(404));
      assert(res.json.calledOnceWith({
        success: false,
        Error: error.message,
      }));

      Users.findAll.restore();
    });
  });

  describe('registerUser', () => {
    it('should create a new user', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const userExists = null;
      const createdUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      sinon.stub(Users, 'findOne').returns(userExists);
      sinon.stub(Users, 'create').returns(createdUser);

      await userController.registerUser(req, res);

      assert(res.status.calledWith(201));
      assert(res.json.calledOnceWith({
        success: true,
        data: createdUser,
        message: 'User created successfully',
      }));

      Users.findOne.restore();
      Users.create.restore();
    });

    it('should return an error if user already exists', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const userExists = {
        name: 'John Doe',
      };

      sinon.stub(Users, 'findOne').returns(userExists);

      await userController.registerUser(req, res);

      assert(res.status.calledWith(400));
      assert(res.json.calledOnceWith({
        success: false,
        Error: `User ${userExists.name} already registered!`,
      }));

      Users.findOne.restore();
    });

    it('should return an error if there is an exception', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const error = { message: 'Internal Server Error' };

      sinon.stub(Users, 'findOne').throws(error);

      await userController.registerUser(req, res);

      assert(res.status.calledWith(404));
      assert(res.json.calledOnceWith({
        success: false,
        Error: error.message,
        message: 'Failed to create user',
      }));

      Users.findOne.restore();
    });
  });

  describe('login', () => {
    it('should authenticate user and return token', async () => {
      const req = {
        body: {
          email: 'john@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const user = {
        id: 1,
        email: 'john@example.com',
        password: 'password123',
        validPassword: sinon.stub().returns(true),
      };

      sinon.stub(Users, 'findOne').returns(user);
      sinon.stub(user, 'validPassword').returns(true);
      sinon.stub(user, 'getSignedJwtToken').returns('token');
      sinon.stub(Users, 'update');

      await userController.login(req, res);

      assert(res.status.calledWith(200));
      assert(res.json.calledOnceWith({
        success: true,
        token: 'token',
        user: user,
        message: 'Login successful',
      }));

      Users.findOne.restore();
      user.validPassword.restore();
      user.getSignedJwtToken.restore();
      Users.update.restore();
    });

    it('should return an error if email or password is missing', async () => {
      const req = {
        body: {},
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await userController.login(req, res);

      assert(res.status.calledWith(400));
      assert(res.json.calledOnceWith({
        success: false,
        Error: 'Please provide an email and password',
        message: 'Authentication failed',
      }));
    });

    it('should return an error if user does not exist', async () => {
      const req = {
        body: {
          email: 'john@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const user = null;

      sinon.stub(Users, 'findOne').returns(user);

      await userController.login(req, res);

      assert(res.status.calledWith(401));
      assert(res.json.calledOnceWith({
        success: false,
        Error: 'Invalid credential',
        message: 'Authentication failed',
      }));

      Users.findOne.restore();
    });

    it('should return an error if password is incorrect', async () => {
      const req = {
        body: {
          email: 'john@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const user = {
        id: 1,
        email: 'john@example.com',
        password: 'password456',
        validPassword: sinon.stub().returns(false),
      };

      sinon.stub(Users, 'findOne').returns(user);
      sinon.stub(user, 'validPassword').returns(false);

      await userController.login(req, res);

      assert(res.status.calledWith(401));
      assert(res.json.calledOnceWith({
        success: false,
        Error: 'Incorrect Password',
        message: 'Authentication failed',
      }));

      Users.findOne.restore();
      user.validPassword.restore();
    });

    it('should return an error if there is an exception', async () => {
      const req = {
        body: {
          email: 'john@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const error = { message: 'Internal Server Error' };

      sinon.stub(Users, 'findOne').throws(error);

      await userController.login(req, res);

      assert(res.status.calledWith(404));
      assert(res.json.calledOnceWith({
        success: false,
        Error: error.message,
        message: 'Authentication failed',
      }));

      Users.findOne.restore();
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com',
        },
        user: {
          id: 1,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const fieldsToUpdate = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      sinon.stub(Users, 'update');

      await userController.updateUser(req, res);

      assert(res.status.calledWith(200));
      assert(res.json.calledOnceWith({
        success: true,
        data: fieldsToUpdate,
        message: 'User updated successfully',
      }));

      Users.update.restore();
    });

    it('should return an error if there is an exception', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com',
        },
        user: {
          id: 1,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const error = { message: 'Internal Server Error' };

      sinon.stub(Users, 'update').throws(error);

      await userController.updateUser(req, res);

      assert(res.status.calledWith(404));
      assert(res.json.calledOnceWith({
        success: false,
        Error: error.message,
        message: 'Failed to update user',
      }));

      Users.update.restore();
    });
  });

  describe('updatePassword', () => {
    it('should update user password', async () => {
      const req = {
        body: {
          currentPassword: 'password123',
          newPassword: 'password456',
        },
        user: {
          id: 1,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const user = {
        id: 1,
        matchPassword: sinon.stub().returns(true),
        save: sinon.stub(),
      };

      sinon.stub(Users, 'findByPk').returns(user);

      await userController.updatePassword(req, res);

      assert(res.status.calledWith(201));
      assert(res.json.calledOnceWith({
        success: true,
        newPassword: req.body.newPassword,
        message: 'Password updated successfully',
      }));

      Users.findByPk.restore();
    });

    it('should return an error if user does not exist', async () => {
      const req = {
        body: {
          currentPassword: 'password123',
          newPassword: 'password456',
        },
        user: {
          id: 1,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const user = null;

      sinon.stub(Users, 'findByPk').returns(user);

      await userController.updatePassword(req, res);

      assert(res.status.calledWith(401));
      assert(res.json.calledOnceWith({
        success: false,
        Error: 'Invalid credential',
        message: 'Failed to update password',
      }));

      Users.findByPk.restore();
    });

    it('should return an error if current password is incorrect', async () => {
      const req = {
        body: {
          currentPassword: 'password123',
          newPassword: 'password456',
        },
        user: {
          id: 1,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const user = {
        id: 1,
        matchPassword: sinon.stub().returns(false),
      };

      sinon.stub(Users, 'findByPk').returns(user);

      await userController.updatePassword(req, res);

      assert(res.status.calledWith(401));
      assert(res.json.calledOnceWith({
        success: false,
        Error: 'CurrentPassword is incorrect',
        message: 'Failed to update password',
      }));

      Users.findByPk.restore();
    });

    it('should return an error if there is an exception', async () => {
      const req = {
        body: {
          currentPassword: 'password123',
          newPassword: 'password456',
        },
        user: {
          id: 1,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const error = { message: 'Internal Server Error' };

      sinon.stub(Users, 'findByPk').throws(error);

      await userController.updatePassword(req, res);

      assert(res.status.calledWith(404));
      assert(res.json.calledOnceWith({
        success: false,
        Error: error.message,
        message: 'Failed to update password',
      }));

      Users.findByPk.restore();
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      const req = {
        user: {
          token: 'token',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const finderUser = {
        name: 'John Doe',
        token: 'token',
        save: sinon.stub(),
      };

      sinon.stub(Users, 'findOne').returns(finderUser);

      await userController.logout(req, res);

      assert(res.status.calledWith(201));
      assert(res.json.calledOnceWith({
        success: true,
        message: `logout User ${finderUser.name} successfully!`,
      }));

      Users.findOne.restore();
    });

    it('should return an error if user does not exist', async () => {
      const req = {
        user: {
          token: 'token',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      const finderUser = null;

      sinon.stub(Users, 'findOne').returns(finderUser);

      await userController.logout(req, res);

      assert(res.status.calledWith(400));
      assert(res.json.calledOnceWith({
        success: false,
        Error: 'please login again!',
        message: 'Logout failed',
      }));

      Users.findOne.restore();
    });

    it('should return an error if there is an exception', async () => {
      const req = {
        user: {
          token: 'token',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const error = { message: 'Internal Server Error' };

      sinon.stub(Users, 'findOne').throws(error);

      await userController.logout(req, res);

      assert(res.status.calledWith(404));
      assert(res.json.calledOnceWith({
        success: false,
        Error: error.message,
        message: 'Logout failed',
      }));

      Users.findOne.restore();
    });
  });
});