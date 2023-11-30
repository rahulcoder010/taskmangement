const login = require('./login');

test('Should return true if username and password are correct', () => {
    expect(login('admin', 'password')).toBe(true);
});

test('Should return false if username is incorrect', () => {
    expect(login('user', 'password')).toBe(false);
});

test('Should return false if password is incorrect', () => {
    expect(login('admin', '123456')).toBe(false);
});

test('Should return false if both username and password are incorrect', () => {
    expect(login('user', '123456')).toBe(false);
});