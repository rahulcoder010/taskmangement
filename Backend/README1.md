# Instructions to Run the Backend and Frontend

## Backend:

1. Navigate to the project directory:
cd backend-assessment-main

2. Install the dependencies using npm:
npm install

3. Create a PostgreSQL database for the application.

4. Configure the database connection by updating the src/config/config.json file. Replace the placeholder values with your database credentials in developmemt stage:

"username": "your_database_user",
"password": "your_database_password",
"database": "your_database_name",
"host"    : "your_database_host",
"dialect" : "postgres"

5. Navigate to the database folder:
cd database

6. Run the database migrations to set up the necessary tables:
npx sequelize-cli db:migrate

7. (Optional) Seed the database with some initial data:
npx sequelize-cli db:seed:all

8. Now navigate to root directory:
cd ..

9. Start the server:
npm start

## Frontend:

The frontend application can be run separately by following these steps:

1. Open a new terminal or command prompt.

2. Navigate to the frontend directory:
cd frontend

3. Install the dependencies using npm:
npm install

4. Start the frontend application:
npm start

5. The frontend application will now be running and accessible at http://localhost:3000 in your web browser.

Note: Make sure the backend server is already running before starting the frontend application.