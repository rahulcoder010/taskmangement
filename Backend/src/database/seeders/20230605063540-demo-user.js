const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersData = [{
      name: 'John Doe',
      email: 'example@example.com',
      password: '12345678',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      password: 'qwerty123',
      createdAt: new Date(),
      updatedAt: new Date()
    }
      ,
    {
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      password: 'abc123',
      createdAt: new Date(),
      updatedAt: new Date()
    }
      ,
    {
      name: 'David Thompson',
      email: 'david.thompson@example.com',
      password: 'pass1234',
      createdAt: new Date(),
      updatedAt: new Date()
    }
      ,
    {
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      password: 'password1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
      ,
    {
      name: 'Christopher Anderson',
      email: 'chris.anderson@example.com',
      password: 'securepass',
      createdAt: new Date(),
      updatedAt: new Date()
    }
      ,
    {
      name: 'Olivia Martinez',
      email: 'olivia.martinez@example.com',
      password: 'ilovecoding',
      createdAt: new Date(),
      updatedAt: new Date()
    }
      ,
    {
      name: 'Daniel Thompson',
      email: 'daniel.thompson@example.com',
      password: 'newpassword',
      createdAt: new Date(),
      updatedAt: new Date()
    }
      ,
    {
      name: 'Sophia Taylor',
      email: 'sophia.taylor@example.com',
      password: 'mypassword',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'William Brown',
      email: 'william.brown@example.com',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Kevin Chodvadiya',
      email: 'kevin@gmail.com',
      password: '12345678',
      createdAt: new Date(),
      updatedAt: new Date()
    }]

    const salt = await bcrypt.genSalt(10);

    const hashedUsersData = usersData.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, salt)
    }));

    return queryInterface.bulkInsert('Users', hashedUsersData, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
