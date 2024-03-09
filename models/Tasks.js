const { Sequelize, DataTypes } = require("sequelize");
const Users = require("./Users");

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
const Tasks = sequelize.define(
  "tasks",
  {
    subject: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    deadline: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
    },
    assign_to: {
      type: DataTypes.INTEGER,
    },

    assign_by: {
      type: DataTypes.INTEGER,
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

Tasks.belongsTo(Users, { foreignKey: "assign_to", as: "assignTo" });

// (async () => {
//   try {
//     await sequelize.sync({ force: false });
//     console.log("wek");
//   } catch (error) {
//     console.error("Error syncing user_details model:", error);
//   }
// })();

// Export the User model
module.exports = Tasks;
