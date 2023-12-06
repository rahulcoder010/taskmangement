const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const controller = require('../../src/controller/user');
const db = require('../../src/models/index');
const Users = db.User;

describe('user controller', () => {
  describe('allUsers', () => {
    it('should return all users', async () => {
      const findAllStub = sinon.stub(Users, 'findAll').resolves([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
      ]);

      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await controller.allUsers(req, res);

      expect(findAllStub.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        count: 2,
        data: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
        ]
      })).to.be.true;

      findAllStub.restore();
    });

    it('should return error if failed to get users', async () => {
      const findAllStub = sinon.stub(Users, 'findAll').throws(new Error('Failed to get users'));

      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await controller.allUsers(req, res);

      expect(findAllStub.calledOnce).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        Error: 'Failed to get users'
      })).to.be.true;

      findAllStub.restore();
    });
  });

  describe('registerUser', () => {
    it('should create a new user', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      const findOneStub = sinon.stub(Users, 'findOne').resolves(null);
      const createStub = sinon.stub(Users, 'create').resolves({ id: 1, ...req.body });

      await controller.registerUser(req, res);

      expect(findOneStub.calledOnceWith({ where: { email: req.body.email } })).to.be.true;
      expect(createStub.calledOnceWith({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        data: { id: 1, ...req.body },
        message: 'User created successfully'
      })).to.be.true;

      findOneStub.restore();
      createStub.restore();
    });

    it('should return error if user with the same email already exists', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      const findOneStub = sinon.stub(Users, 'findOne').resolves({ id: 1, name: 'John Doe' });

      await controller.registerUser(req, res);

      expect(findOneStub.calledOnceWith({ where: { email: req.body.email } })).to.be.true;
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        Error: `User ${req.body.name} already registered!`
      })).to.be.true;

      findOneStub.restore();
    });

    it('should return error if failed to create user', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      const findOneStub = sinon.stub(Users, 'findOne').resolves(null);
      const createStub = sinon.stub(Users, 'create').throws(new Error('Failed to create user'));

      await controller.registerUser(req, res);

      expect(findOneStub.calledOnceWith({ where: { email: req.body.email } })).to.be.true;
      expect(createStub.calledOnceWith({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        Error: 'Failed to create user',
        message: 'Failed to create user'
      })).to.be.true;

      findOneStub.restore();
      createStub.restore();
    });
  });

  describe('login', () => {
    it('should authenticate user and return token', async () => {
      const req = {
        body: {
          email: 'john@example.com',
          password: 'password123'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      };

      const findOneStub = sinon.stub(Users, 'findOne').resolves(user);
      const validPasswordStub = sinon.stub(user, 'validPassword').resolves(true);
      const sendTokenResponseStub = sinon.stub(controller, 'sendTokenResponse');

      await controller.login(req, res);

      expect(findOneStub.calledOnceWith({ where: { email: req.body.email } })).to.be.true;
      expect(validPasswordStub.calledOnceWith(req.body.password, user.password)).to.be.true;
      expect(sendTokenResponseStub.calledOnceWith(user, 200, res)).to.be.true;

      findOneStub.restore();
      validPasswordStub.restore();
      sendTokenResponseStub.restore();
    });

    it('should return error if email or password is missing', async () => {
      const req = {
        body: {}
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await controller.login(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        Error: 'Please provide an email and password',
        message: 'Authentication failed'
      })).to.be.true;
    });

    it('should return error if user does not exist', async () => {
      const req = {
        body: {
          email: 'john@example.com',
          password: 'password123'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      const findOneStub = sinon.stub(Users, 'findOne').resolves(null);

      await controller.login(req, res);

      expect(findOneStub.calledOnceWith({ where: { email: req.body.email } })).to.be.true;
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        Error: 'Invalid credential',
        message: 'Authentication failed'
      })).to.be.true;

      findOneStub.restore();
    });

    it('should return error if password is incorrect', async () => {
      const req = {
        body: {
          email: 'john@example.com',
          password: 'password123'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword'
      };

      const findOneStub = sinon.stub(Users, 'findOne').resolves(user);
      const validPasswordStub = sinon.stub(user, 'validPassword').resolves(false);

      await controller.login(req, res);

      expect(findOneStub.calledOnceWith({ where: { email: req.body.email } })).to.be.true;
      expect(validPasswordStub.calledOnceWith(req.body.password, user.password)).to.be.true;
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        Error: 'Incorrect Password',
        message: 'Authentication failed'
      })).to.be.true;

      findOneStub.restore();
      validPasswordStub.restore();
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        user: {
          id: 1
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      const updateStub = sinon.stub(Users, 'update').resolves();
      
      await controller.updateUser(req, res);

      expect(updateStub.calledOnceWith(
        { name: req.body.name, email: req.body.email },
        { where: { id: req.user.id } }
      )).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        data: { name: req.body.name, email: req.body.email },
        message: 'User updated successfully'
      })).to.be.true;

      updateStub.restore();
    });

    it('should return error if failed to update user', async () => {
      const req = {
        body: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        user: {
          id: 1
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      const updateStub = sinon.stub(Users, 'update').throws(new Error('Failed to update user'));

      await controller.updateUser(req, res);

      expect(updateStub.calledOnceWith(
        { name: req.body.name, email: req.body.email },
        { where: { id: req.user.id } }
      )).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        Error: 'Failed to update user',
        message: 'Failed to update user'
      })).to.be.true;

      updateStub.restore();
    });
  });

  describe('updatePassword', () => {
    it('should update user password', async () => {
      const req = {
        body: {
          currentPassword: 'password123',
          newPassword: 'newpassword123'
        },
        user: {
          id: 1
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
      const user = {
        id: req.user.id,
        matchPassword: sinon.stub().resolves(true),
        password: 'hashedPassword',
        save: sinon.stub().resolves()
      };

      const findByPkStub = sinon.stub(Users, 'findByPk').resolves(user);

      await controller.updatePassword(req, res);

      expect(findByPkStub.calledOnceWith(req.user.id)).to.be.true;
      expect(user.matchPassword.calledOnceWith(req.body.currentPassword)).to.be.true;
      expect(user.password).to.equal(req.body.newPassword);
      expect(user.save.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        newPassword: req.body.newPassword,
        message: 'Password updated successfully'
      })).to.be.true;

      findByPkStub.restore();
    });

    it('should return error if user does not exist', async () => {
      const req = {
        body: {
          currentPassword: 'password123',
          newPassword: 'newpassword123'
        },
        user: {
          id: 1
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      const findByPkStub = sinon.stub(Users, 'findByPk').resolves(null);

      await controller.updatePassword(req, res);

      expect(findByPkStub.calledOnceWith(req.user.id)).to.be.true;
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        Error: 'Invalid credential',
        message: 'Failed to update password'
      })).to.be.true;

      findByPkStub.restore();
    });

    it('should return error if current password is incorrect', async () => {
      const req = {
        body: {
          currentPassword: 'password123',
          newPassword: 'newpassword123'
        },
        user: {
          id: 1
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
      const user = {
        id: req.user.id,
        matchPassword: sinon.stub().resolves(false)
      };

      const findByPkStub = sinon.stub(Users, 'findByPk').resolves(user);

      await controller.updatePassword(req, res);

      expect(findByPkStub.calledOnceWith(req.user.id)).to.be.true;
      expect(user.matchPassword.calledOnceWith(req.body.currentPassword)).to.be.true;
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        Error: 'CurrentPassword is incorrect',
        message: 'Failed to update password'
      })).to.be.true;

      findByPkStub.restore();
    });

    it('should return error if failed to update password', async () => {
      const req = {
        body: {
          currentPassword: 'password123',
          newPassword: 'newpassword123'
        },
        user: {
          id: 1
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
      const user = {
        id: req.user.id,
        matchPassword: sinon.stub().resolves(true),
        password: 'hashedPassword',
        save: sinon.stub().throws(new Error('Failed to update password'))
      };

      const findByPkStub = sinon.stub(Users, 'findByPk').resolves(user);

      await controller.updatePassword(req, res);

      expect(findByPkStub.calledOnceWith(req.user.id)).to.be.true;
      expect(user.matchPassword.calledOnceWith(req.body.currentPassword)).to.be.true;
      expect(user.password).to.equal(req.body.newPassword);
      expect(user.save.calledOnce).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        Error: 'Failed to update password',
        message: 'Failed to update password'
      })).to.be.true;

      findByPkStub.restore();
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      const req = {
        user: {
          token: 'token123'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
      const user = {
        id: 1,
        name: 'John Doe',
        token: req.user.token,
        save: sinon.stub().resolves()
      };

      const findOneStub = sinon.stub(Users, 'findOne').resolves(user);

      await controller.logout(req, res);

      expect(findOneStub.calledOnceWith({ where: { token: req.user.token } })).to.be.true;
      expect(user.token).to.be.null;
      expect(user.save.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({
        success: true,
        message: `logout User ${user.name} successfully!`
      })).to.be.true;

      findOneStub.restore();
    });

    it('should return error if user token is invalid', async () => {
      const req = {
        user: {
          token: 'token123'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      const findOneStub = sinon.stub(Users, 'findOne').resolves(null);

      await controller.logout(req, res);

      expect(findOneStub.calledOnceWith({ where: { token: req.user.token } })).to.be.true;
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        Error: `please login again!`,
        message: 'Logout failed'
      })).to.be.true;

      findOneStub.restore();
    });

    it('should return error if failed to logout', async () => {
      const req = {
        user: {
          token: 'token123'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
      const user = {
        id: 1,
        name: 'John Doe',
        token: req.user.token,
        save: sinon.stub().throws(new Error('Failed to logout'))
      };

      const findOneStub = sinon.stub(Users, 'findOne').resolves(user);

      await controller.logout(req, res);

      expect(findOneStub.calledOnceWith({ where: { token: req.user.token } })).to.be.true;
      expect(user.token).to.be.null;
      expect(user.save.calledOnce).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({
        success: false,
        Error: 'Failed to logout',
        message: 'Logout failed'
      })).to.be.true;

      findOneStub.restore();
    });
  });
});

describe('sendTokenResponse', () => {
  it('should send token response', async () => {
    const user = {
      id: 1,
      getSignedJwtToken: sinon.stub().returns('token123')
    };
    const statusCode = 200;
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    const updateStub = sinon.stub(Users, 'update').resolves();

    await controller.sendTokenResponse(user, statusCode, res);

    expect(user.getSignedJwtToken.calledOnceWith(user.id)).to.be.true;
    expect(res.status.calledWith(statusCode)).to.be.true;
    expect(res.json.calledWith({
      success: true,
      token: 'token123',
      user,
      message: 'Login successful'
    })).to.be.true;
    expect(updateStub.calledOnceWith({ token: 'token123' }, { where: { id: user.id } })).to.be.true;

    updateStub.restore();
  });
});