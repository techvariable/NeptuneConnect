<a name="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/techvariable/NeptuneConnect">
    <img src="https://neptune-cdn.s3.amazonaws.com/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Neptune Connect</h3>

  <p align="center">
    Neptune Connect is a free interactive tool for querying, optimizing, analyzing, and visualizing your Gremlin-based graph database data.
    <br />
    <a href="https://github.com/demo-website">View Demo</a>
    ·
    <a href="https://github.com/issues">Report Bug</a>
    ·
    <a href="https://github.com/issues">Request Feature</a>
  </p>
</div>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Features](#features)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [Using the installer](#using-the-installer)
    - [Manually installing](#manually-installing)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [License](#license)

<!-- ABOUT THE PROJECT -->
## About The Project

![Screenshot](https://github.com/techvariable/NeptuneConnect/assets/43804489/91bcff89-f187-49c5-9b47-e42f47ce10c5)

Neptune Connect is a free interactive tool for querying, optimizing, analyzing, and visualizing your Gremlin-based graph database data.

### Features

- **Effortlessly query your data:** Find the data you need within seconds using Neptune Connect's built-in query editor. With both Table view and JSON view options, you can easily work with the data.

- **Powerful Query Builder:** The powerful query builder eliminates the need to write custom queries. With Neptune Connect, you can easily generate queries for performing basic to advanced operations, including data editing, inserting, and deleting.

- **Generate reports from your data:** Utilize Neptune Connect to generate reports in various formats, presenting the data exactly the way you want it.

- **Highly-Configurable RBAC:** With a highly-configurable Role-Based Access Control (RBAC) system, you have granular control over user permissions. Additionally, query logs record every executed query within the system.

- **Data Visualization:** Neptune Connect provides powerful visualization capabilities for nodes and edges, enabling you to easily understand the relationships between different entities.

### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgments section. Here are a few examples.

- TypeScript
- NodeJS
- Fastify
- EJS
- Prisma
- StencilJS

<!-- GETTING STARTED -->
## Getting Started

To use Neptune Connect, you can install it on a server or your local machine. If you choose to set it up on a local server, make sure you have a running Gremlin database.

### Prerequisites

1. NodeJS 16.x.
2. NPM
3. Curl and Wget
4. AWS Neptune or local gremlin instance
5. Active internet connection

### Installation

#### Using the installer

To install Neptune Connect on your system, run the following command

```bash
bash <(curl -s https://neptune-cdn.s3.amazonaws.com/install.sh)
```

The above script will automatically execute a .sh file and download the necessary files. During the installation process, you will be prompted to provide some configuration settings for Neptune Connect.

#### Manually installing

To install Neptune Connect manually, follow the following steps.

- Clone the repository.
- Install packages using `npm run install`
- Create `.env` based on `.env.example` file
- Run `npm run prisma:migrate` to generate SQLite database with all needed tables 
- Finally run `npm run start` to start the server

## Usage

[![Watch the video](https://img.youtube.com/vi/FHqaNuyu0hc/default.jpg)](https://www.youtube.com/watch?v=FHqaNuyu0hc)

## Roadmap

See the [open issues](https://github.com/techvariable/NeptuneConnect/issues) for a full list of proposed features (and known issues).

<!-- LICENSE -->
## License

Distributed under the Server Side Public License. See `LICENSE.md` for more information.
