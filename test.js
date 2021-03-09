const Logger = require('../../logs')
const logger = new Logger()

logger.configLogger({
  mongodb: {
    url: 'mongodb://127.0.0.1:27017/logs',
    database: 'logs-teste',
    collection: 'payment-api'
  }
})

logger.transaction({ _id: '6047dc8d7a79550eee0ea94b', description: 'pediu pra criar pedido de pagamento', status: 'OPENED' })
logger.transaction({ _id: '6047dc8d7a79550eee0ea94b', description: 'pagamento criado', status: 'CREATED' })
