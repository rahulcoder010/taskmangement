// UNIT TEST CASES

// Mocked data for testing
const mockUser = {
  name: "John Doe",
  email: "johndoe@example.com",
  password: "password123",
};

// Mocked user object
const user = {
  id: 1,
  name: "John Doe",
  email: "johndoe@example.com",
  password: "hashedPassword",
  matchPassword: () => true,
  getSignedJwtToken: () => "mockToken",
  save: () => {},
};

// Mocked Users model
const Users = {
  findAll: () => [user],
  findOne: () => user,
  create: () => user,
  update: () => {},
  findByPk: () => user,
};

// Mocked request and response objects
const req = {
  body: mockUser,
  user: user,
};

const res = {
  status: () => ({
    json: () => {},
  }),
};

// Test case for allUsers
const testAllUsers = async () => {
  const response = await allUsers(req, res);
  expect(response.status).toBe(200);
  expect(response.data.length).toBe(1);
  expect(response.data[0].name).toBe("John Doe");
};

// Test case for registerUser
const testRegisterUser = async () => {
  const response = await registerUser(req, res);
  expect(user.name).toBe(mockUser.name);
  expect(user.email).toBe(mockUser.email);
  expect(user.password).toBe(mockUser.password);
  expect(response.status).toBe(201);
};

// Test case for login
const testLogin = async () => {
  const response = await login(req, res);
  expect(response.status).toBe(200);
  expect(response.token).toBe("mockToken");
  expect(response.user).toEqual(user);
};

// Test case for updateUser
const testUpdateUser = async () => {
  const response = await updateUser(req, res);
  expect(response.status).toBe(200);
  expect(response.data.name).toBe(mockUser.name);
  expect(response.data.email).toBe(mockUser.email);
};

// Test case for updatePassword
const testUpdatePassword = async () => {
  const response = await updatePassword(req, res);
  expect(response.status).toBe(201);
  expect(response.newPassword).toBe(mockUser.password);
};

// Test case for logout
const testLogout = async () => {
  const response = await logout(req, res);
  expect(response.status).toBe(201);
  expect(response.message).toBe(`logout User ${user.name} successfully!`);
};

// Run all the test cases
testAllUsers();
testRegisterUser();
testLogin();
testUpdateUser();
testUpdatePassword();
testLogout();