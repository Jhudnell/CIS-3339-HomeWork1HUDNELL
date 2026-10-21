# CIS 3339 Homework 1: Vue 3 and MongoDB Migration

## Project Overview


Technologies Used

Vue 3 and the Composition API

Vue Router

Pinia

Axios

Vite

Node.js and Express

Mongoose

MongoDB Community Edition

Features

Students

Add students with a name, student ID, phone number, and ZIP code.

View and search for students.

Delete students.

Prevent duplicate student IDs.

Courses

Add and view courses.

Prevent duplicate course IDs.

Delete courses.

Enrollments

Enroll students in courses.

Prevent duplicate enrollments.

View a course roster.

Automatically delete related enrollments when a student or course is deleted.

Project Structure

backend/ — Express server, MongoDB connection, data models, and REST API.

frontend-vue/ — Vue 3 application, views, components, and router.

frontend/ — Original frontend supplied with the project.

images/ — Project images and related assets.

Prerequisites

Install the following software before running the project:

Node.js and npm

MongoDB Community Edition

MongoDB must be running locally.

MongoDB Configuration

Create a .env file inside the backend/ directory with the following configuration:

MONGODB_URI=mongodb://127.0.0.1:27017/cis3339_homework1

This connects the application to a local MongoDB database named cis3339_homework1. No MongoDB Atlas account is required.

Installation

Open Terminal and navigate to the project directory.

Install the backend dependencies:

cd backend
npm install

In a separate Terminal window, navigate to the frontend directory and install its dependencies:

cd ~/Desktop/cis3339-homework1/CIS-3339-HomeWork1HUDNELL-1/frontend-vue
npm install

Running the Application in Development

Start MongoDB Community Edition.

In Terminal, start the backend:

cd ~/Desktop/cis3339-homework1/CIS-3339-HomeWork1HUDNELL-1/backend
npm start

In another Terminal window, start the Vue development server:

cd ~/Desktop/cis3339-homework1/CIS-3339-HomeWork1HUDNELL-1/frontend-vue
npm run dev

Open the local URL displayed by Vite in your browser.

Building and Running the Production Application

Build the Vue frontend:

cd ~/Desktop/cis3339-homework1/CIS-3339-HomeWork1HUDNELL-1/frontend-vue
npm run build

The production files are generated in frontend-vue/dist/.

Start the Express server:

cd ~/Desktop/cis3339-homework1/CIS-3339-HomeWork1HUDNELL-1/backend
npm start

Open the production application at:

http://localhost:3000

Express serves the built Vue frontend, and Vue Router supports navigation and page refreshes.

Testing

The application was tested for:

Student creation, searching, listing, and deletion.

Duplicate student ID prevention.

Course creation, listing, and deletion.

Duplicate course ID prevention.

Student enrollment in courses.

Duplicate enrollment prevention.

Course roster display.

Cascade deletion of enrollments when students or courses are deleted.

Production build and page refreshes.