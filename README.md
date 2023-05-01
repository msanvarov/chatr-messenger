<h1 align="center">Chatr Messenger</h1>

<p align="center">
  <a href="https://react-chatr.web.app/login" target="blank"><img src="src/assets/logo-dark.png" width="320" alt="Chatr Logo" /></a>
</p>

<p align="center">A messaging platform built with <a href="https://react.dev/" target="blank">React</a>, <a href="https://firebase.google.com/" target="blank">Firebase</a> and <a href="https://reactstrap.github.io/?path=/story/home-installation--page" target="blank">Reactstrap (Bootstrap v5)</a>.</p>

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

This React chat app is built with Nx, Redux, Bootstrap and Firebase. It provides real-time chatting capabilities with options to edit your profile, start channels, view other profiles, and start DM conversations with people. This application is a great reference point for building a robust chat application.

---

### 🛠️ Prerequisites

#### Non Docker

- Please make sure to have [Node.js](https://nodejs.org/en/download/) (18+) locally by downloading the Javascript runtime via `brew`, `choco`, or `apt-get`.

- Please make sure to have Firebase configured by creating a new app on the [Firebase Console](https://console.firebase.google.com/). Registering with [AppCheck to use ReCaptcha](https://firebase.google.com/docs/app-check/web/recaptcha-provider) can help prevent abuse and safe guard your app against bad actors.

> Remark: Firebase CLI can streamline a lot of common configuration operations and can be downloaded via `npm i -g firebase-tools`.

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

- The following command will download dependencies and execute the web application on http://localhost:4200 (deployed in development mode).

---

### 🔒 Environment Configuration

By default, the application comes with a config module that can read in every environment variable from the `.env` file.

**APP_ENV** - the application environment to execute as, either in development or production. Determines the type of logging options to utilize. Options: `development` or `production`.

**FIREBASE\_\*** - the firebase config details that can be fetched when creating the [SDK for the app](https://firebase.google.com/docs/web/setup).

**RECAPTCHA_KEY** - public recaptcha key for [Firebase AppCheck](https://firebase.google.com/docs/app-check/web/recaptcha-provider).

---

### ✅ Testing

#### Docker 🐳

```bash
# Start the docker container if it's not running
$ docker start chatr-messenger

# unit tests
$ docker exec -it chatr-messenger npm run test

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
