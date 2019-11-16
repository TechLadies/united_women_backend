require('dotenv').config()

module.exports = {
  development: {
    database: process.env.DB_NAME || 'united_women_dev',
    host: process.env.DB_SERVER || 'localhost',
    dialect: 'postgres',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD
  },
  test: {
    database: 'united_women_test',
    host: 'localhost',
    dialect: 'postgres',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: true
    }
  }
}
