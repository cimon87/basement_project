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

export const SentItems = sequelize.define('sentitems', {
  ID: {
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  UpdatedInDB : Sequelize.DATE, 
  InsertIntoDB: Sequelize.DATE, 
  SendingDateTime: Sequelize.DATE, 
  DestinationNumber: Sequelize.STRING,
  SMSCNumber: Sequelize.STRING,
  TextDecoded: Sequelize.STRING, 
  Status: Sequelize.STRING
}
);

//outbox (DestinationNumber, TextDecoded)
export const Outbox = sequelize.define('outbox',{
  DestinationNumber: Sequelize.STRING,
  TextDecoded: Sequelize.STRING
})

//SELECT ID, SenderNumber, TextDecoded, ReceivingDateTime FROM inbox ORDER BY ReceivingDateTime DESC
export const Inbox = sequelize.define('inbox', {
  ID: {
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  SenderNumber: Sequelize.STRING,
  TextDecoded: Sequelize.STRING,
  ReceivingDateTime: Sequelize.DATE
})