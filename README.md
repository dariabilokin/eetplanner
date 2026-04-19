# Eetplanner

A small SvelteKit meal planner for recipes, weekly menus, calories, and shopping lists.

## Setup

Install dependencies:

```sh
npm install
```

Create local environment config:

```sh
cp .env.example .env
mkdir -p data
```

Create and apply database migrations:

```sh
npm run db:generate
npm run db:migrate
```

Start the development server:

```sh
npm run dev
```

## Local Data

The SQLite database lives at `data/eetplanner.db`. The `data/` directory and `.env` files are ignored by Git so personal recipe data stays local.

## Scripts

- `npm run dev` starts the app locally.
- `npm run check` type-checks the SvelteKit project.
- `npm run db:generate` creates Drizzle migrations from the schema.
- `npm run db:migrate` applies migrations to the local SQLite database.

## Build

```sh
npm run build
```
