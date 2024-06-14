# WIKI

## Introduction
This project allows for the creation of a knowledge documentation that would be accessible to **Oslo admin** users.



## Chargepoly Customization

#### Module

All the custom code related to Chargepoly is located in the **module**:

    /server/chargepoly

Here, you'll find the guards, middlewares, and other tools for creating default accounts.

#### Controller

A **controller** for Chargepoly has also been created:

    /server/controllers/chargepoly

## API status

To check the status of the Chargepoly API:  

    GET http://localhost:3000/chargepoly/status

## Setup

Install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable):

    npm install --global yarn
    
Create a **/.env** file from **/.env.example** and fill in the informations. These details are used to initialize the project. They are the data that will be saved in the database upon installation of the project.

Once the environment file is completed, run the command:

    yarn install

Create a **/.config.yml** file from the **/config.sample.yml** file and modify the information if necessary (change port or credentials for your local database...).

Launch the project:

    yarn run dev

Once the project is launched, go to the following address to complete the installation.

    http://localhost:{port in config.yml file}/finalize

Then go to:

    http://localhost:{port in config.yml file}

All that remains is to log in with the credentials from your **.env** file:

    ADMIN_EMAIL=
    ADMIN_PASSWORD=

## Links

[Wiki.JS](https://js.wiki/)
