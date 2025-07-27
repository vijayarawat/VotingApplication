# Voting Application

This is a backend application for a voting system where users can vote for candidates. It provides functionalities for user authentication, candidate management, and voting.

## Features

- User sign up and login with Aadhar Card Number and password
- User can view the list of candidates
- User can vote for a candidate (only once)
- Admin can manage candidates (add, update, delete)
- Admin cannot vote

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT) for authentication

## Installation

1. Clone the repository:
   git clone https://github.com/Prince-1501/voting_app.git
   cd voting_app
2. Install dependencies:
   npm install
3. Start the server:
    node server.js

# API Endpoints
## Authentication
POST /signup: Sign up a user
POST /login: Login a user

## Candidates
GET /candidates: Get the list of candidates
POST /candidates: Add a new candidate (Admin only)
PUT /candidates/:id: Update a candidate by ID (Admin only)
DELETE /candidates/:id: Delete a candidate by ID (Admin only)

## Voting
GET /candidates/vote/count: Get the count of votes for each candidate
POST /candidates/vote/:id: Vote for a candidate (User only)

## User Profile
GET /users/profile: Get user profile information
PUT /users/profile/password: Change user password
