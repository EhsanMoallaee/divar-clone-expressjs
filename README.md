# Divar-Clone-Expressjs

This is a clone of Persian Divar marketplace.It's not a replica, and it doesn't have all the features of Divar web app. it's a similar version of Divar backend with my own design touch, showing my abilities in Nodejs to build something advanced like Divar.

## Badges

![Nodejs](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![YARN](https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)
![EXPRESSJS](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![SWAGGER](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)
![MONGODB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JEST](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![DOCKER](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![GITHUB ACTIONS](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

## Environment Variables

To run this project,first you will need to create three .env files as:
.env.test
.env.development
.env.production
in the root of the project folder and then add the following environment variables to your .env files with your own data:

`PORT`

`DB_URL`

`REDIS_HOST`

`REDIS_PORT`

`REDIS_USERNAME`

`REDIS_PASSWORD`

`COOKIE_SECRET_KEY`

`TOKEN_SECRET_KEY`

`KAVENEGAR_API_KEY`

(Kavenegar is an Iranian sms service provider)

For slugify Persian words with slugify package in 'node_modules/slugify/slugify.js' replace " var locales = JSON.parse(...)" line with which I wrote in "persianCharMap/slugify.fa.charmap.js" or add ' "fa":{...} ' charmap part of this file to locales of slugify.js file of package.

## Run Locally

Clone the project

```bash
  git clone https://github.com/EhsanMoallaee/divar-clone-expressjs.git
```

Go to the project directory

```bash
  cd divar-clone-expressjs
```

Install dependencies

```bash
  npm install
```

or

```bash
  yarn install
```

Start the server

(For production mode)

```bash
  yarn start
```

or

```bash
  npm start
```

(For development mode)

```bash
  yarn watch
```

or

```bash
  npm run watch
```

(For test mode)

```bash
  yarn dev-test
```

or

```bash
  npm run dev-test
```
