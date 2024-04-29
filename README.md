This is a Paper Trading Application built on Next JS framework using Zerodha Kite's API.
It uses MySQL as database and also contain Laravel Inside to run database migration features for SQL

## Installation on Local Machine

First Clone this repository on your local machine from Github and run npm install to run all the node dependencies

Second Create env.local file in the root directory of this project, and fill it in as below

        DB_CONNECTION=mysql
        DB_HOST=<your-mysql-host>
        DB_PORT=<your-mysql-port>
        DB_DATABASE=<your-mysql-database>
        DB_PASSWORD=<<PASSWORD>>

        GITHUB_ID=<your-github-id>
        GITHUB_SECRET=<your-github-secret>

        NEXTAUTH_URL=<your-nextauth-url>
        NEXTAUTH_SECRET=<your-nextauth-secret>

Second, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
