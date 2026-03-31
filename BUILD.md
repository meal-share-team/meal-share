These are instructions to build the website as is. 

_Make sure you clone the repo and navigate to the repo directory. (you should be in `/meal-share`)._

Set up your env files. DO NOT PUSH REAL ENV FILES. I would copy them to real files and then fill them in with real values. You won't know some of these variables unil you are done [building the backend](#build-backend). To copy:

```bash
cp client/.env.example client/.env.local
cp server/.env.example server/.env
```

Now you must, in this order, [build the backend](#build-backend), [run the backend](#run-backend), [set up Supabase](#set-up-supabase), then [run the frontend](#run-frontend).

## Build Backend

Install Docker Desktop OR create a use local Postgres to create a database called `meal-share`. This database should have matching credentials with the username and password in your env file.

If you installed Docker Desktop (what I did), run this command:

```bash
docker run --name meal-share-postgres \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_DB=meal_share \
-p 5433:5432 \
-d postgres:16
```

Now navigate to the server directory:
```bash
cd server
```

Finally build your SQL schema with prisma:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

## Run Backend

YOU MUST BUILD THE BACKEND FIRST. 

After, install any necessary dependencies:
```bash
npm install
```
Then run:

```bash
npm run dev
```
Your backend should be running at http://localhost:4000/ but it is not really set up so don't mind what you see there.

BUT, you should see `ok` at http://localhost:4000/api/health.

## Set up Supabase

First, navigate to the client directory (from server):

```bash
cd ../client
```

YOU SHOULD HAVE THE BACKEND UP FIRST.

Create a Supabase account and send me your email so I can add you to the Supabase meal-share project.

Once you've joined the project, make sure these project settings are right:
- Enable email auth
- Enable Google for social login
- Add redirect URLs:
    - http://localhost:5173
    - http://localhost:5173/app
    - http://localhost:5173/owner

Now add the project URL and publishable key to your real `.env.local`.

## Run Frontend

YOU MUST DO ALL THE PREVIOUS STEPS. 

After, install any necessary dependencies:
```bash
npm install
```
Then run:

```bash
npm run dev
```

Your frontend should be running at http://localhost:5137/.

The website should be built!

christ :)