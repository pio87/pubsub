### Sample pub-sub project using RabbitMQ as queue engine

Application that automatically publishes messages with given frequency to RabbitMQ queue and gets messages back.

Technologies / libs used:
- TypeScript
- NodeJS
- Docker
- RabbitMQ
- Jasmine
- Winston

##### Requirements

Docker installed.

If you want to run it locally without docker you need also `NodeJS` runtime with `npm`.

##### Running in development mode

1. First of all - create `.env` file by copy and modify `.env.example` as you need.
2. Install project dependencies `npm instal`
3. Run `docker-compose up --build`

Depending on your OS you may skip 2. step.

Application should be operational, everything is in app logs.

##### Running tests

2. Install project dependencies if you didn't done that before `npm instal`
3. Run `npm test`

##### TODOs

- prettier
- git hooks for pre-commit
- CI/CD
- complete missing tests