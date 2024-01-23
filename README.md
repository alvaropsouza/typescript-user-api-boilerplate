# User Service

#### Typescript API boilerplate

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

&nbsp;

## **Running project**

1. Install dependencies:

```
pnpm i
```

&nbsp;

2. Run database locally with [**Docker**](https://www.docker.com/):

```
docker compose up -d
```

_This command should be executed in the same folder as the docker-compose.yml file_

&nbsp;

3. Generate and run migrations:

```
pnpm run prisma:gen && pnpm run prisma:mig
```

&nbsp;

Visualize Data with Prisma Studio:

```
npx prisma studio
```

_Will Pop a tab on your navigator in http://localhost:5555 providing you with a basic database ide_

&nbsp;

Init server command:

```
pnpm run dev
```

_You should now see a message like: "App listening on port 5000"_

&nbsp;

# Docs

Visit http://localhost:5000/api-docs/

&nbsp;

# Tests

Tests powered by jest and [**Prisma-jest plugin**](https://github.com/Quramy/jest-prisma)

Run all tests:

```
pnpm run test
```

Run all tests with coverage:

```
pnpm run test:cov

```

For coverage UI, open this file in your browser: coverage\lcov-report\index.html
