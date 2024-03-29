'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AllCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  AllCode.init({
    // id: DataTypes.STRING,
    key: DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVn: DataTypes.STRING,
    valueJp: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'AllCode',
  });
  return AllCode;
};