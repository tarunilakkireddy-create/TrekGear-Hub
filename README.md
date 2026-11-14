# TrekGear Hub – Backend Project

## 1. Project Description

TrekGear Hub is a trekking gear management system developed using Node.js, Express.js and SQLite. It helps manage trekking tents, trekkers, rentals and activity logs through REST APIs.

The main purpose of this project is to provide an organized backend system for managing trekking equipment, storing trekker details, handling tent rentals and maintaining records of important activities.

The system also includes automatic tent code generation, input validation, search functionality and SQL JOIN operations.

## 2. Technologies Used

- Node.js – JavaScript runtime environment.
- Express.js – Framework for developing REST APIs.
- SQLite – Relational database for storing application data.
- JavaScript – Backend programming language.
- Postman – API testing tool.
- Visual Studio Code – Development environment.
- Git and GitHub – Version control and project hosting.

## 3. Installation and Setup

Follow these steps to run the project locally.

### Step 1: Clone the repository

```bash
git clone https://github.com/tarunilakkireddy-create/TrekGear-Hub.git
```

### Step 2: Open the project folder

```bash
cd TrekGear-Hub
```

Open the folder in Visual Studio Code.

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Start the backend server

```bash
node server.js
```

### Step 5: Access the application

The backend server runs at:

`http://localhost:5000`

The server automatically initializes the SQLite database and required tables when it starts.

## 4. API Endpoints

The following REST API endpoints are available in TrekGear Hub.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Display welcome message |
| GET | `/api/test` | Test backend and database connection |
| GET | `/api/tables` | Display database tables |
| GET | `/api/trekkers` | Get all trekkers |
| POST | `/api/tents` | Add a new tent |
| GET | `/api/tents` | Get all tents |
| GET | `/api/tents?size=Large` | Search tents by size |
| GET | `/api/tents/:id` | Get a tent by ID |
| PUT | `/api/tents/:id` | Update tent details |
| DELETE | `/api/tents/:id` | Delete a tent |
| GET | `/api/rentals` | Get rental details using SQL JOIN |
| GET | `/api/audit-logs` | Get the latest 10 audit logs |

## 5. Main Features

### 5.1 Tent Management

- Add new tents.
- View all available tents.
- Retrieve individual tent details using ID.
- Update existing tent information.
- Delete tents using their ID.

### 5.2 Automatic Tent Code Generation

- The server automatically generates a unique code for every new tent.
- Tent codes follow the format `TNT-0001`, `TNT-0002`, `TNT-0003` and so on.
- Clients cannot manually assign tent codes.
- Tent codes cannot be changed during update operations.

### 5.3 Input Validation

- Validates required tent details.
- Checks that tent capacity is a positive integer.
- Checks that tent price is a non-negative number.
- Rejects invalid or missing input.
- Returns HTTP 400 Bad Request with clear error messages.

### 5.4 Search Functionality

Users can search for tents based on size using query parameters.

Example:

`GET /api/tents?size=Large`

### 5.5 Trekkers Management

- Retrieves all registered trekkers.
- Displays trekker ID, name, email, phone number and creation date.
- Fetches trekker information from the SQLite database.

### 5.6 Rental Management

- Retrieves rental information.
- Uses SQL JOIN to combine data from multiple related tables.
- Displays trekker details and tent details along with rental information.

### 5.7 Audit Logging

- Records important ADD, UPDATE and DELETE operations.
- Stores action type, entity, record ID, details and timestamp.
- Provides an API to retrieve the latest 10 audit log records.

## 6. Database Structure

The project uses SQLite as its relational database.

It contains four tables:

### 6.1 Trekkers Table

Stores information about registered trekkers.

Fields include:
- id
- name
- email
- phone
- created_at

### 6.2 Tents Table

Stores information about trekking tents.

Fields include:
- id
- tent_code
- tent_name
- brand
- size
- capacity
- price
- location
- availability
- description
- created_at

### 6.3 Rentals Table

Stores rental information and connects trekkers with tents.

Fields include:
- id
- trekker_id
- tent_id
- rental_date
- return_date
- status

The rentals table uses foreign keys to establish relationships with the trekkers and tents tables.

- `trekker_id` references `trekkers(id)`.
- `tent_id` references `tents(id)`.

### 6.4 Audit Logs Table

Stores records of important operations performed in the application.

Fields include:
- id
- action
- entity
- record_id
- details
- created_at

### Database Relationships

- One trekker can have multiple rental records.
- One tent can be associated with multiple rental records over time.
- Each rental record connects one trekker with one tent.
- Audit logs maintain records of important application operations.

## 7. Project Structure

```text
TrekGear-Hub/
│
├── config/
│
├── controllers/
│   ├── auditController.js
│   ├── rentalcontroller.js
│   ├── tentController.js
│   └── validation.js
│
├── database/
│   ├── db.js
│   └── trekgear.db
│
├── routes/
│   ├── auditRoutes.js
│   ├── rentalroutes.js
│   ├── tentRoutes.js
│   └── trekkerRoutes.js
│
├── screenshots/
│
├── server.js
├── seedTestData.js
├── package.json
├── package-lock.json
├── .gitignore
├── TrekGear_Hub_Postman_Collection.json
└── README.md
```

## 8. Testing

Postman is used to test the REST API endpoints.

The following operations have been tested:

1. **GET Request:** Retrieve all tent information.
2. **POST Request:** Add a new tent with an automatically generated code.
3. **PUT Request:** Update tent details without changing the automatic tent code.
4. **DELETE Request:** Delete a tent using its ID.
5. **Validation Testing:** Reject invalid input with a 400 Bad Request response.
6. **Search Testing:** Find tents based on size using query parameters.
7. **Trekkers API Testing:** Retrieve all trekker records.
8. **SQL JOIN Testing:** Retrieve rental details along with trekker and tent information.
9. **Audit Log Testing:** Retrieve recent ADD, UPDATE and DELETE activities.
10. **Database Testing:** Verify the SQLite database connection and table initialization.

### Automatic Tent Code Testing

The special project requirement is automatic tent code generation.

The following test cases were verified:

- Adding a new tent generates a unique tent code.
- The server generates the code automatically.
- Sending a fake tent code from the client does not override the generated code.
- Updating a tent does not change its existing tent code.

Example:

- First generated code: `TNT-0001`
- Second generated code: `TNT-0002`

Actual generated codes depend on the existing database records.

## 9. Postman Collection

The project includes a Postman collection named:

`TrekGear_Hub_Postman_Collection.json`

It contains the API requests required to test the main backend functionalities.

The collection can be imported into Postman using:

1. Open Postman.
2. Click Import.
3. Select the JSON collection file.
4. Import the collection.
5. Start the backend server and test the API endpoints.

## 10. Advantages

- Easy management of trekking tents and trekker information.
- Organized storage using a relational database.
- Automatic generation of unique tent codes.
- Input validation improves data accuracy.
- Search functionality makes it easier to find tents.
- SQL JOIN provides combined rental information.
- Audit logs help track important activities.
- REST API structure makes the backend easy to extend.

## 11. Limitations

- The current project provides backend APIs without a complete frontend interface.
- The system uses a local SQLite database.
- User authentication and role-based access control are not currently implemented.
- Advanced reporting and analytics are not included.

## 12. Future Enhancements

- Develop a user-friendly frontend interface.
- Add user authentication and authorization.
- Implement online tent booking and payment functionality.
- Add advanced search and filtering options.
- Generate rental reports and analytics.
- Add notifications for rental dates and return reminders.
- Improve deployment and database scalability.

## 13. Conclusion

TrekGear Hub provides a simple and organized backend solution for managing trekking equipment, trekker information, rental records and activity logs.

The project demonstrates important backend development concepts, including REST API development, Express.js routing, SQLite database integration, relational database relationships, CRUD operations, input validation, query parameter search, SQL JOIN operations and automatic tent code generation.

The implementation of automatic tent codes and audit logging makes the system more organized and reliable. Overall, this project provides practical experience in backend development and database management.

## 14. GitHub Repository

**Project Repository:**

https://github.com/tarunilakkireddy-create/TrekGear-Hub

**Postman Collection:**

`TrekGear_Hub_Postman_Collection.json`
