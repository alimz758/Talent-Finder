# Act Finder

This is a backend code for video-based social media where users can create a portfolio and resume 

by filling thier information and uploading videos. For video storage and performance I have used AWS Services where you can

see more in details below.


This is the backend code repository for Act-Finder: made with NodeJS, Express, and MongoDB w/ Mongoose.
For additional guidence/help, email me at ali.mz758@gmail.com

1. [Setup](#setup)
2. [Dev-Rules](#dev-rules)
3. [Documentation](#documentation)

# Setup

1. [Local Environment Setup](#local-environment-setup)
2. [Directory Structure](#directory-structure)

---

## Local Environment Setup

1. Install nodeJS by following installation guides from https://nodejs.org/en/download/
2. Clone the repository to your local environment using `git clone https://github.com/alimz758/Talent-Finder.git`
3. Install all used packages and dependencies using:
   > npm install

4. Install mongoDB by following installation guides from:
   Mac: https://treehouse.github.io/installation-guides/mac/mongo-mac.html
   Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

   This is different from the npm package listed in package.json: which is the driver that connects the DB to the nodeJS app.
   For choosing the inital db location, just use the default --dbpath=/data/db to prevent future confusion


---

## Local Development Setup

1. Open a terminal, and run the command `mongod` to start the mongodb daemon - may have to run `sudo mongod` for permission purposes
2. Open another terminal and run `npm run dev` in the home directory; this starts the backend application with nodemon
3. The local backend development port is set to 8000, now use Postman to test API endpoints. Look at [Using Postman](#using-postman) for instructions.

---

## NPM Scripts

1. Starting the NodeJS app

   > npm start

   Starts up the server by running `node src/server.js` with environment variables defined in .env.


---

## Additional Tools

1. Download and install Postman to test backend REST APIs
2. Install Robo 3T for mongoDB GUI and create a new connection to the DB using port 27017, the default mongoDB port

---

