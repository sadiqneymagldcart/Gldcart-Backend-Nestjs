## Installation

```bash
$ npm install
```

## Running the app(Redis won't launch)

```bash
# development
$ npm run start:dev
```

## Running the app via docker-compose

```bash
# development
$ sudo docker-compose -f docker-compose.dev.yml up --build
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
