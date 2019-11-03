require("dotenv").config()

module.exports = {
  development: {
    database: "united_women_dev",
    host: "localhost",
    dialect: "postgres",
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD
  },
  test: {
    database: "united_women_test",
    host: "localhost",
    dialect: "postgres",
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    ssl: true,
    dialectOptions: {
      ssl: true
    }
  }
}
