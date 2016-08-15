module.exports = function (sequelize, DataTypes) {
  const Question = sequelize.define('Question', {
    text: DataTypes.STRING,
  }, {
    classMethods: {
      associate(models) {
        Question.hasMany(models.Answer);
        // associations can be defined here
      },
    },
  });
  return Question;
};
