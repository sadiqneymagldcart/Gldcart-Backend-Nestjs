## Installation
```bash
$ npm install
```

## Running the app
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the app via docker-compose
```bash
$ sudo docker-compose up --build
```

## Redis
```bash
sudo sysctl vm.overcommit_memory=1
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
