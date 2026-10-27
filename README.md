# Basement Security

A Raspberry Pi alarm system for a basement, controlled by SMS and a REST API.
Written in TypeScript (Node.js) in 2017–2018.

## How it works

- A **door contact** and a physical **arm/disarm switch** are read from GPIO inputs.
- A **siren** and a **status LED** are driven from GPIO outputs.
- When the door opens while the alarm is armed, the siren sounds (unless silent
  mode is on) and an SMS alert is sent to every phone allowed to receive alerts.
- SMS is handled by [Gammu SMSD](https://wammu.eu/smsd/) with a MySQL backend.
  New rows in `gammu.inbox` are picked up live from the MySQL binlog
  (`mysql-events`). Messages are processed only if they come from an
  authorized phone and are less than 2 minutes old.

### Pins

| Pin    | Name            | Direction |
|--------|-----------------|-----------|
| GPIO5  | Door contact    | input (pull-up) |
| GPIO21 | Security switch | input (pull-up) |
| GPIO20 | Siren           | output |
| GPIO18 | LED             | output |

Pin assignments live in `src/Gpio/Pins.ts`.

### SMS commands

| Command       | Effect |
|---------------|--------|
| `ON [seconds]`| Turns the LED output on, optionally off again after `seconds` |
| `OFF`         | Turns the LED output off |

`ALM` is defined in `src/Enums/CommandEnum.ts` but not implemented.

## REST API

The server listens on `PORT` (default `3000`).

| Method | Path | Description |
|--------|------|-------------|
| GET    | `/security/status` | Current `Enabled`, `SilentMode`, `SmsEnabled` |
| POST   | `/security/status` | Change any of `Enabled`, `SilentMode`, `SmsEnabled` |
| GET    | `/security/permissions` | List authorized phones |
| POST   | `/security/permissions` | Add a phone (`Number`, `Receive`, `Send`) |
| PUT    | `/security/permissions` | Update a phone's `Receive` / `Send` |
| DELETE | `/security/permissions` | Remove a phone (`number`) |
| GET    | `/gpio` | State of all registered pins |
| POST   | `/gpio` | Set a writable pin (`PinName`, `State`) |
| GET    | `/messages/inbox` | Received SMS |
| DELETE | `/messages/inbox` | Delete received SMS (`ids`) |
| GET    | `/messages/send` | Sent SMS |
| POST   | `/messages/send` | Send an SMS (`to`, `text`) |
| DELETE | `/messages/send` | Delete sent SMS (`ids`) |
| GET    | `/logs` | Application log (`logs/log.log`) as JSON |

> The API has no authentication and allows CORS from any origin. Only expose it
> on a trusted network.

## Project structure

```
src/
  ApiStart.ts           entry point: Express server, shutdown handling
  ApiRouter.ts          route definitions
  BasementSecurity.ts   alarm logic and SMS command handling
  Controllers/          REST handlers
  Gammu/                Sequelize models and Gammu database access
  Gpio/                 pin reader/writer wrappers and pin registry
  Executors/            SMS command executors
  Helpers/              SMS command parser
  Logger/               winston logger
  Statics/              credentials, messages, phone list
```

## Requirements

- Raspberry Pi with the hardware wired as above
- `pigpio` (the app must run as root)
- MySQL with Gammu SMSD configured to use the `gammu` database, plus a
  `security_phone` table (`Number` PK, `Receive` boolean, `Send`)
- MySQL binary logging enabled (row format) for `mysql-events`
- Node.js and npm (dependencies date from 2018: TypeScript 2.x, Sequelize 4)

## Setup

1. Set database credentials in `src/Statics/Credentials.ts` and
   `src/Gammu/Models.ts`.
2. Install and build:
   ```sh
   npm install   # also runs tsc via the "prepare" script
   ```
3. Run:
   ```sh
   npm start     # sudo node src/ApiStart.js
   ```

On shutdown the app removes `/var/run/pigpio.pid` so pigpio can start again.
