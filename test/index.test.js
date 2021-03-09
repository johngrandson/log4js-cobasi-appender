const LEVELS = require('../../../constants/log-levels')
const Logger = require('../../../logs')

// Sets spies on console object to make it possible to convert them into test failures.
const spyError = jest.spyOn(console, 'error')

beforeEach(() => {
  spyError.mockReset()
})

const log = new Logger()

log.configLogger()

const defaultConfig = {
  appenders: {
    console: {
      type: 'console'
    },
    fileFilter: {
      type: 'logLevelFilter',
      level: 'INFO',
      filename: 'all-the-logs.log',
      appender: 'file'
    },
    mongodbFilter: {
      type: 'logLevelFilter',
      level: 'INFO',
      appender: 'mongodb'
    },
    logstashFilter: {
      type: 'logLevelFilter',
      level: 'INFO',
      appender: 'logstash'
    }
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'ALL'
    }
  },
  pm2: true,
  replaceConsole: true
}

const updatedConfig = {
  ...defaultConfig.appenders,
  mongodb: {
    type: 'log4js-mongo-appender',
    connectionString: 'mongodb://127.0.0.1:27017/logs',
    databaseName: 'logs-test',
    collectionName: 'payment-api-test'
  },
  file: {
    type: 'dateFile',
    filename: '/home/usuario/Cobasilabs/Libs/cobasi-utils/logs/file_logs/files.log',
    backups: 50,
    alwaysIncludePattern: false
  },
  ...defaultConfig.categories,
  ...defaultConfig.pm2,
  ...defaultConfig.replaceConsole
}

describe('logger helper', () => {
  it('default logLevel should be INFO', () => {
    expect(log.logLevel.outputString).toEqual('INFO')
  })

  it('Instance of log should match with Logger class', () => {
    expect(log instanceof Logger).toEqual(true)
  })

  it('default logger config should match defaultConfig', () => {
    expect(log.config).toEqual(expect.objectContaining(defaultConfig))
  })

  it('logLevel should be TRACE after setLogLevel()', () => {
    log.setLogLevel(LEVELS.TRACE)
    log.trace('TRACE')
    expect(log.logLevel.outputString).toEqual('TRACE')
  })

  it('logLevel should be DEBUG after setLogLevel()', () => {
    log.setLogLevel(LEVELS.DEBUG)
    log.debug('DEBUG')
    expect(log.logLevel.outputString).toEqual('DEBUG')
  })

  it('logLevel should be ERROR after setLogLevel()', () => {
    log.setLogLevel(LEVELS.ERROR)
    log.error('ERROR')
    expect(log.logLevel.outputString).toEqual('ERROR')
  })

  it('log() should return null after setLogLevel set to OFF', () => {
    log.setLogLevel(LEVELS.OFF)
    expect(log.info('TENTATIVA')).toEqual(null)
  })

  it('logLevel should be WARN after setLogLevel()', () => {
    log.setLogLevel(LEVELS.WARN)
    log.warn('WARN')
    expect(log.logLevel.outputString).toEqual('WARN')
  })

  it('logLevel should be FATAL after setLogLevel()', () => {
    log.setLogLevel(LEVELS.FATAL)
    log.fatal('FATAL')
    expect(log.logLevel.outputString).toEqual('FATAL')
  })

  it('logLevel be INFO after pass no args to setLogLevel()', () => {
    log.setLogLevel()
    log.info('INFO')
    expect(log.logLevel.outputString).toEqual('INFO')
  })

  it('console.error should have been called when have no mongodb configuration properties', () => {
    log.configLogger({
      mongodb: {}
    })

    expect(console.error).toHaveBeenCalled()
  })

  it('console.error should have been called when have no file configuration properties', () => {
    log.configLogger({
      file: {}
    })

    expect(console.error).toHaveBeenCalled()
  })

  it('console.error should not have been called when have mongodb configuration properties', () => {
    log.configLogger({
      mongodb: {
        url: 'mongodb://127.0.0.1:27017/logs',
        database: 'logs-test',
        collection: 'payment-api-test'
      }
    })

    expect(console.error).not.toHaveBeenCalled()
  })

  it('should have appenders with mongodb configuration', () => {
    expect(console.error).not.toHaveBeenCalled()
    expect(log.config.appenders.mongodb).toEqual(
      expect.objectContaining(updatedConfig.mongodb)
    )
  })

  it('console.error should not have been called when have file configuration properties', () => {
    log.configLogger({
      file: {
        path: '/home/usuario/Cobasilabs/Libs/cobasi-utils/logs/file_logs/files.log'
      }
    })

    expect(console.error).not.toHaveBeenCalled()
  })
  it('should have appenders with file configuration', () => {
    expect(console.error).not.toHaveBeenCalled()
    expect(log.config.appenders.file).toEqual(
      expect.objectContaining(updatedConfig.file)
    )
  })
})
