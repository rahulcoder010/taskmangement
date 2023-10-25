# Getting Started with taskmangement App

This is a task manager application built with Node.js, PostgreSQL, and Socket.io. It allows users to add, view task and update task status in real time.

### 1. Navigate to the project directory:
```
cd backend-assessment-main
```
### 2. Install the dependencies using npm:
```
npm install
```
### 3. Create a PostgreSQL database for the application.

### 4. Configure the database connection by updating the src/config/config.json file. Replace the placeholder values with your database credentials in developmemt stage:
```
"username": "your_database_user",
"password": "your_database_password",
"database": "your_database_name",
"host"    : "your_database_host",
"dialect" : "postgres"
```
### 5. Navigate to the database folder
```
cd database
```
### 6. Run the database migrations to set up the necessary tables:
```
npx sequelize-cli db:migrate
```
### 7. (Optional) Seed the database with some initial data:
```
npx sequelize-cli db:seed:all
```
### 8. Now navigate to root directory
```
cd ..
```
### 9. Start the server:
```
npm start
```
## API END-POINTS
* Users
  - GET /user                : Fetch all Users.
  - POST /user               : Create a new User.
  - POST /user/login         : login a create User.
  - PUT /user                : Update name or email for specific user.
  - PUT /user/updatePassword : Update a password for specific user.
  - DELETE /user/logout      : Logout a login user.
* Tasks
  - GET /task        : Fetch all tasks.
  - POST /task       : Create a new task.
  - PUT /task/:id    : Update a status for specific task.
  - DELETE /task/:id : Delete a task.

## Features
* This backend project provides the following features:

  - Real-time status update for tasks: Changes made to task statuses are immediately reflected in the connected clients through web socket integration.
  - User authentication: The backend can be extended to include user authentication, enabling login and logout functionality for users.