# Simple Adonis.js Transaction App

Adonis.js, Node.js, Typescript, MySQL

## Installation

1. Run `npm i` on your terminal
2. Run `cp .env.example .env` and fill the DB credentials on `.env`
3. Run `node ace migration:run` to migrate the db

## Running The App

#### Deployment

Development: Run `npm run dev`

Production: Run `npm run build`. [Click here](https://docs.adonisjs.com/guides/deployment) for more info

#### Run Testing

1. Run `cp .env.test.example .env.test` and fill the DB credentials on `.env.test`
2. Run `npm run test`

Notes: Tests are located at `/tests`
