module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    text: DataTypes.STRING,
    count: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate(models) {
        Answer.belongsTo(models.Question);
        // associations can be defined here
      },
    },
  });
  return Answer;
};
