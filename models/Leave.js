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
const Leaves = sequelize.define(
  "leaves",
  {
    type: {
      type: DataTypes.STRING,
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    reason: {
      type: DataTypes.STRING,
    },
    requested_by: {
      type: DataTypes.INTEGER,
    },

    requested_to: {
      type: DataTypes.INTEGER,
    },

    status: {
      type: DataTypes.STRING,
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

Leaves.belongsTo(Users, { foreignKey: "requested_by", as: "requestedBy" });

// (async () => {
//   try {
//     await sequelize.sync({ force: false });
//     console.log("wek");
//   } catch (error) {
//     console.error("Error syncing user_details model:", error);
//   }
// })();

// Export the User model
module.exports = Leaves;
