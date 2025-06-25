# 🧠 Habit Tracker CLI

A simple habit tracking CLI tool built with **Node.js only**, using **no external libraries**. Supports adding, listing, updating, marking habits as done, deleting, and viewing completion stats. Includes a basic HTTP server as a fallback when no CLI command is passed.

## 📁 Features

- Add habits with frequency (`daily`, `weekly`, or `monthly`)
- List all habits in a table
- Mark habits as done (with support for time offset via `.env`)
- View habit completion stats (last 7 or 30 days)
- Update or delete existing habits
- Run as either CLI or simple HTTP server

## 🛠 Installation

```bash
git clone https://github.com/KatiaKalynchuk/rd-node-js-course
cd rd-node-js-course/lesson-1-architecture
npm install
```

## ▶️ Usage

Run CLI
```bash
npm start -- <command> [options]
```

## 🧪 Available Commands
| Command  | Description                                     | Example                                                         |
| -------- | ----------------------------------------------- | --------------------------------------------------------------- |
| `add`    | Add a new habit                                 | `npm start -- add --name "Workout" --freq daily`                |
| `list`   | List all habits                                 | `npm start -- list`                                             |
| `done`   | Mark a habit as done for today (or with offset) | `npm start -- done --id <habit_id>`                             |
| `stats`  | Show completion stats for each habit            | `npm start -- stats`                                            |
| `delete` | Delete a habit                                  | `npm start -- delete --id <habit_id>`                           |
| `update` | Update habit name or frequency                  | `npm start -- update --id <id> --name "New name" --freq weekly` |

## 🌐 Environment Variables
 - .env file is supported via dotenv.
 - Set DAY_OFFSET to simulate a different date (for testing):

`DAY_OFFSET=1  # 0 = today, 1 = tomorrow, etc.`

## 🧹 Linting
This project uses ESLint with a custom configuration in `eslint.config.js` and no external dependencies.

```bash
npm run lint
```
