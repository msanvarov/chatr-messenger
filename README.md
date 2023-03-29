<h1 align="center">Chatr Messenger</h1>

<p align="center">
  <a href="https://react-chatr.web.app/login" target="blank"><img src="src/assets/logo-dark.png" width="320" alt="Chatr Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>

<p align="center">
  <a href="https://nx.dev/" target="blank"><img src="https://img.shields.io/badge/Nx-13.1.2-blue" alt="Nx Version" /></a>
  <a href="https://reactjs.org/" target="blank"><img src="https://img.shields.io/badge/React-17.0.2-blue" alt="React Version" /></a>
  <a href="https://redux.js.org/" target="blank"><img src="https://img.shields.io/badge/Redux-4.1.2-blue" alt="Redux Version" /></a>
  <a href="https://firebase.google.com/" target="blank"><img src="https://img.shields.io/badge/Firebase-9.6.3-orange" alt="Firebase Version" /></a>
</p>

Table of Contents:

1. [Description](#-description)
2. [Prerequisites](#%EF%B8%8F-prerequisites)
3. [Deployment](#-deployment)
4. [Environment Configuration](#-environment-configuration)
5. [Testing](#-testing)

🔎 This repo was created with [Nx](https://nx.dev/).

### 📚 Description

This React Chat App is built with Nx, Redux, and Firebase. It provides real-time chatting capabilities with the ability to edit your profile, start channels, see other profiles, and start DM conversations with people. This application is a great reference point for building a comprehensive chat application.

---

### 🛠️ Prerequisites

#### Non Docker

- Please make sure to have [Node.js](https://nodejs.org/en/download/) (16+) locally by downloading the Javascript runtime via `brew`, `choco`, or `apt-get`.

- Please make sure to have MYSQL locally by deploying a web server stack like [XAMPP](https://www.apachefriends.org/). The control panel can then trigger MYSQL to start on localhost. MYSQL can be downloaded standalone via `brew`, `choco`, or `apt-get`.

#### Docker 🐳

- Please make sure to have [Docker Desktop](https://www.docker.com/products/docker-desktop/) operational to quickly compose the required dependencies. Then follow the docker procedure outlined below.

---

### 🚀 Deployment

#### Manual Deployment without Docker

- Clone the repo via `git clone https://github.com/msanvarov/chatr-messenger`.

- Download dependencies via `npm i` or `yarn`.

- Create a **.env file** via the `cp .env.example .env` command and replace the existing environment variable placeholders with valid responses.

- Start the api in development mode by using `npm run start` (the UI will be exposed on http://localhost:4200).

#### Deploying with Docker 🐳

- Execute the following command in-app directory:

```bash
# creates and loads the docker container in detached mode with the required configuration
$ docker-compose up -d
```

- The following command will download dependencies and execute the web application on http://localhost:80 (deployed behind a Nginx reverse proxy).

---

### 🔒 Environment Configuration

By default, the application comes with a config module that can read in every environment variable from the `.env` file.

TODO

---

### ✅ Testing

#### Docker 🐳

```bash
# Start the docker container if it's not running
$ docker start nest-rest-typeorm-api

# unit tests
$ docker exec -it nest-rest-typeorm-api npm run test

```

#### Non-Docker

```bash
# execute test
$ npm run test
```

---

### 🏗️ Progress

|                                                         Branches | Status |
| ---------------------------------------------------------------: | :----- |
|             [main](https://github.com/msanvarov/chatr-messenger) | ✅     |
| [feat/\*](https://github.com/msanvarov/chatr-messenger/branches) | 🚧     |

<!-- > Remark: This template was employed to create a [Real World example app](https://github.com/gothinkster/realworld) on [Github](). -->

---

### 👥 Support

PRs are appreciated, I fully rely on the passion ❤️ of the OS developers.

---

## License

This starter API is [MIT licensed](LICENSE).

[Author](https://sal-anvarov.tech/)
