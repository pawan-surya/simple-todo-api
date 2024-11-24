# Simple-Todo-API  REST API
A RESTful API for managing todo items on top of Node.js, Express, MongoDB, and TypeScript. It features user authentication, CRUD operations on todos, as well as automatic status updates via CRON jobs.

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm package manager

## Database Setup
### Local MongoDB Setup
1. Install MongoDB Community Edition on your machine and Mongodb Compass
2. Start MongoDB service:

# Installation & To run locally
1. Make sure node & npm is installed on your system.
    > git clone https://github.com/pawan-surya/simple-todo-api
    > cd simple-todo-api
    > npm install 

2. Environment Setup:
- Create a `.env` file in the root directory
- and connect with me for .env file's details "pawansurya1995@gmail.com"

## Running the Application
    > npm start 

## Features
- User Authentication (signup/login)
- JWT-based authorization
- CRUD operations for todo items & update individual item as completed 
- Automated todo status completed true using CRON jobs
- Input validation
- TypeScript support
- MongoDB integration

Note: For Now allowing Old dates while create but we can validate and stop the old date todos creation
You can not edit the completed to do Items


## API Endpoints
### Authentication
- `POST /api/auth/signup` - Register a new user
  ```json
  {
    "email": "testuser@mailinator.com",
    "password": "password123"
  }
  ```
- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "testuser@mailinator.com",
    "password": "password123"
  }
  ```

### Todo Operations
All todo routes require authentication token in header: `Authorization: Bearer <token>`

- `GET /api/item/lists` - Get all todos
- `GET /api/item/:id` - Get specific todo
- `POST /api/item/store` - Create new todo
  ```json
  {
    "title": "hype project",
    "description": "Mark as done",
    "dueDate": "2024-03-20"
  }
  ```
- `PUT /api/item/:id` - Update todo
- `PATCH /api/item/:id/complete` - Update the todo item as completed
- `DELETE /api/item/:id` - Delete todo

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## License
This project is licensed under the MIT License - see the LICENSE file for details

## Support
For support, email pawansurya1995@gmail.com or open an issue in the repository.



