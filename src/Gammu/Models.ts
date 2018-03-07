import Sequelize from 'sequelize';

export const sequelize = new Sequelize('gammu', 'zongji', '', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,
  define: {
    timestamps: false,
    freezeTableName: true
  }
});

export const SecurityPhone = sequelize.define('security_phone', {
    Number: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    Receive: {
      type: Sequelize.BOOLEAN
    },
    Send: {
      type: Sequelize.STRING
    }
  }
);