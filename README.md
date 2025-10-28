# Reelbox Server

This is the backend server for Reelbox, a full-stack application for browsing and managing movies.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/reelbox_server.git
   ```
2. Install NPM packages
   ```sh
   pnpm install
   ```

### Running the application

- **Development**
  ```sh
  pnpm run dev
  ```
- **Production**
  ```sh
  pnpm run build
  pnpm start
  ```

## Available Scripts

- `dev`: Starts the development server with hot-reloading.
- `build`: Compiles the TypeScript code to JavaScript.
- `start`: Starts the production server.
- `test`: (Not yet implemented)

## Dependencies

- [Express](https://expressjs.com/): Fast, unopinionated, minimalist web framework for Node.js

## Dev Dependencies

- [@types/express](https://www.npmjs.com/package/@types/express)
- [@types/node](https://www.npmjs.com/package/@types/node)
- [ts-node-dev](https://www.npmjs.com/package/ts-node-dev)
- [typescript](https://www.typescriptlang.org/)

## Project Structure

```
.
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── README.md
├── tsconfig.json
└── src
    ├── server.ts
    ├── config
    │   └── ConnectDB.ts
    ├── controllers
    │   └── control.ts
    ├── middleware
    │   └── middleware.txt
    ├── models
    │   └── models.txt
    ├── routes
    │   └── routes.txt
    └── utils
        └── utils.txt
```