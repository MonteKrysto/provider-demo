import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/practice_db',
  },
  verbose: true,
  strict: true,
});

// import { defineConfig } from 'drizzle-kit';

// console.log("Connecting to DATABASE_URL:", process.env.DATABASE_URL);

// export default defineConfig({
//   dialect: 'postgresql',
//   out: './migrations',
//   schema: './src/db/schema.ts',
//   dbCredentials: {
//     url: process.env.DATABASE_URL || 'postgres://vdx:vdx123@localhost:5433/crm_poc',
//   },
// });

