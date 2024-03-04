const { Sequelize, DataTypes } = require("sequelize");

// Create a Sequelize instance and connect to the PostgreSQL database
const sequelize = new Sequelize(
  "ems_g4pc",
  "ems_g4pc_user",
  "8sxy1ZPJjYQVvKY4Uxk0ZRu0DtMJxQZe",
  {
    host: "dpg-cniven821fec73cujvgg-a.oregon-postgres.render.com",
    dialect: "postgres",
    dialectOptions: {
      statement_timeout: 60000,
      idle_in_transaction_session_timeout: 180000,
      conectionTimeoutMillis: 5000,
      ssl: {
        require: true,
        rejectUnauthorized: false, // For self-signed certificates
      },
    },
    pool: {
      max: 100,
      min: 0,
      idle: 30000,
    },
  }
);

// Define the User model
const Users = sequelize.define(
  "users",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reporting_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn("now"),
    },
  },
  {
    timestamps: false, // Disable Sequelize's automatic timestamp fields
  }
);

// (async () => {
//   try {
//     await sequelize.sync({ force: false });
//     console.log("wek");
//   } catch (error) {
//     console.error("Error syncing user_details model:", error);
//   }
// })();

// Export the User model
module.exports = Users;
