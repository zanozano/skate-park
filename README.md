# TrickTrack

![TrickTrack App Logo](/public/img/favicon.svg)

**Version:** 2.0.0

## Description

TrickTrack App is a web application designed to manage skateboarding athletes and handle information related to individuals involved in the skateboarding world. We have utilized technologies such as Handlebars for views, Express for the backend, Bootstrap for the frontend, and PostgreSQL for the database.

The application allows for CRUD (Create, Read, Update, Delete) operations on skateboarding athlete records, making it easy to track their progress and achievements. Furthermore, it provides an intuitive and user-friendly interface for managing people's data and their involvement in the skate park.

## Author

**Author:** Cristóbal Manzano

## Table of Contents

- [TrickTrack](#tricktrack)
  - [Description](#description)
  - [Author](#author)
  - [Table of Contents](#table-of-contents)
  - [Usage Instructions](#usage-instructions)
    - [Prerequisites](#prerequisites)
    - [Clone the Repository](#clone-the-repository)
    - [Install Dependencies](#install-dependencies)
    - [Database Configuration](#database-configuration)
    - [Start the Application](#start-the-application)
  - [Scripts](#scripts)
  - [Current Implementation Example](#current-implementation-example)
  - [Contributions](#contributions)

## Usage Instructions

### Prerequisites

Make sure you have the following tools installed on your system:

- Node.js: Node.js is required to run the project's scripts.
- PostgreSQL: PostgreSQL is used as the database.

### Clone the Repository

Clone this repository using Git. Open your terminal and execute the following command:

```bash
git clone https://github.com/zanozano/tricktrack-web.git
```

### Install Dependencies

Once you have cloned the repository, navigate to the project folder and install the dependencies using npm:

```bash
cd tricktrack-web
npm install
```

### Database Configuration

Before starting the application, you need to configure the connection to the PostgreSQL database. Make sure you have a database created and update the connection information in the corresponding configuration file.

### Start the Application

To run the application, use the following script:

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Scripts

To get real-time updates from SCSS to CSS, use the following script after installing the dependencies:

```json
"scripts": {
    "scss": "sass --watch public/scss/style.scss:public/css/style.css"
}
```

## Current Implementation Example

You can see TrickTrack App in action by visiting the following link:

[TrickTrack App](insert-link-to-the-implementation)

## Contributions

We welcome contributions to the TrickTrack App project. To get involved, please follow our guidelines for reporting issues, requesting features, or submitting pull requests in the repository.

We appreciate your interest in the TrickTrack App project. If you have any questions or suggestions, please don't hesitate to contact us
