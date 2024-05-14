import { cacheConfig } from '@melchyore/adonis-cache/build/config'

export default cacheConfig({
  prefix: 'cache_',
  store: 'redis',
  stores: {
    redis: {
      driver: 'redis'
    },
    memcached: {
      driver: 'memcached'
    },
    database: {
      driver: 'database',
      table: 'cache'
    },
    dynamodb: {
      driver: 'dynamodb',
      table: 'Cache'
    },
    file: {
      driver: 'file',
      disk: 'local'
    },
    in_memory: {
      driver: 'in_memory'
    }
  },
  ttl: 60,

  /*
  |--------------------------------------------------------------------------
  | Cache events
  |--------------------------------------------------------------------------
  |
  | Enable/disable cache events.
  | 
  */
  events: {
    'cache:hit': true,
    'cache:missed': true,
    'cache:key_written': true,
    'cache:key_forgotten': true
  }
})
