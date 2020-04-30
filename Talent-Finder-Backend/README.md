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
3. [Additional Tools](#additional-tools)
4. [Directory Structure](#directory-structure)

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

## Additional Tools

1. Download and install Postman to test backend REST APIs
2. Install Robo 3T for mongoDB GUI and create a new connection to the DB using port 27017, the default mongoDB port

---

## Directory Structure

```
├── README.md
├── aws
│   └── aws_lambda_transcoder.js
├── package-lock.json
├── package.json
└── src
    ├── agency
    │   ├── agency.js
    │   └── index.js
    ├── app.js
    ├── comment
    │   ├── comment.js
    │   └── index.js
    ├── db
    │   ├── awsS3_controller.js
    │   └── mongoose.js
    ├── media
    │   ├── controller.js
    │   ├── index.js
    │   └── media.js
    ├── middleware
    │   ├── jwt_authenticator.js
    │   └── jwt_email_auth.js
    ├── server.js
    ├── userAgent
    │   ├── index.js
    │   └── userAgent.js
    └── userPerformer
        ├── controller.js
        ├── index.js
        └── userPerformer.js
```

---

## Using Postman

**Creating a Postman Request**

All the requests under the workspace collection inherits a authToken variable automatically;

When creating each requests:

- If authToken is required, go to the Authorization tab of the request, and select "inherit auth from parent" under the TYPE tab; no further authToken has to be passed through Headers

- You could send requests like an example below

```
{
    "name":"Ali Mirabzdeh",
    "email":"ali-mz@g.ucla.edu",
    "password":"password"
}
```

---


## Documentation

## Auth Tokens

For all API requests after login, the bearer token must be included in headers for authorization/ username extraction.

| Key           | Value               |
| ------------- | ------------------- |
| Authorization | Bearer [Auth token] |

There must be a white space between the string "Bearer" and the token string

You could do so in Postman.

---


## Models & API Endpoints Documentation

Models:

1. [UserPerformer Model](#user-performer-model)
2. [Media](#media-model)
3. [Comments](#comments-model)
4. Other models are under dev

---

### UserPerfomer Model

### Schema

| Field          | Type    | Required | Properties                                                   |
| -------------- | ------- | -------- | ------------------------------------------------------------ |
| name           | String  | Yes      |                                                              |
| email          | String  | Yes      |                                                              |
| password       | String  | Yes      |                                                              |
| age            | Number  |          |                                                              |
| profilePic     | Buffer  |          |                                                              |
| resume         | Buffer  |          |                                                              |
| createdAt      | Date    |          |                                                              |
| bio            | String  |          |                                                              |
| gender         | String  |          |                                                              |
| location       | String  |          |                                                              |
| verified       | Boolean |          |                                                              |
| private        | Boolean |          |                                                              |
| education      | String  |          |                                                              |
| tokens         | Array   |          |                                                              |
| followings     | Array   |          |                                                              |
| followers     | Array    |          |                                                              |
| userFolderPathOnS3  | String   |          |                                                              |

### API Endpoints

| url                          | HTTP Method | description                                                        |
| ---------------------------- | ----------- | ------------------------------------------------------------------ |
| /users/login                 | POST        | [User Login](#user-login)                                          |
| /users/signup                | POST        | [User Signup](#user-signup)                                        |
| /users/my-info               | POST        | [User Info](#user-info)                                            |
| /users/logout                | POST        | [User Logout](#user-logout)                                        |
| /users/logoutAll             | POST        | [User Logout All](#user-logout-all)                                |
| /users/profile-pic           | POST        | [User Profile Picture](#user-profile-pic)                          |
| /users/:id/follow            | POST        | [User Follow](#user-follow)                                        |
| /users/resume                | POST        | [User Resume](#user-resume)                                        |
| /users/my-info               | GET         | [User Info-Get](#user-info-get)                                    |
| /users/verify                | GET         | [User verify](#user-verify)                                        |
| /users/my-info               | GET         | [User Info-Get](#user-info-get)                                    |
| /users/profile-pic           | GET         | [User Profile Picture- GET](#user-profile-pic-get)                 |
| /users/resume                | GET         | [User Resume -GET](#user-resume-get)                               |
| /users/:id                   | GET         | [User ID](#user-ID)                                                |
| /users/:id/media             | GET         | [User Meida](#user-media)                                          |
| /users/profile-pic           | DELETE      | [User Profile Pic Delete](#user-profile-pic-del)                   |
| /users/resume                | DELETE      | [User Resume Delete](#user-resume-del)                             |
| /users/me                    | DELETE      | [User Delete Me](#user-delete-me)                                  |

---