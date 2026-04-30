import { Pool } from "pg";

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "printshopdb",
    password: "rama1996",
    port: 5432,
});

export default pool;