"use strict";

const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

// User model
module.exports = (sequelize) => {
  class User extends Model { }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please provide a first name.",
        },
        notEmpty: {
          msg: "Please provide a first name.",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please provide a last name.",
        },
        notEmpty: {
          msg: "Please provide a last name.",
        },
      },
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "The email already exists. Please provide a new email.",
      },
      validate: {
        notNull: {
          msg: "Please provide a valid email address.",
        },
        isEmail: {
          msg: "Please provide a valid email address.",
        },
      },
    },

    // Password hashing
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword);
      },
      validate: {
        notNull: {
          msg: "Please provide a password.",
        },
        notEmpty: {
          msg: "Please provide a password.",
        },
      },
    },
  },
    { sequelize }
  );

  // User to course relationship
  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };
  return User;
};