module.exports = {
  apps: [
    {
      name: 'web',
      //script: './build/server.js',
      script : 'ace',
      args: ['serve'],
      instances: 1,
      exec_mode: 'cluster',
      env: {
        COMMON_VARIABLE: 'true',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      autorestart: true,
      error_file: './storage/logs/web-err.log',
      out_file: './storage/logs/web-out.log',
    },
    {
      name: 'cron',
      //script: './build/ace',
      script: './ace',
      args: ['scheduler:run'],
      instances: 1,
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
      },
      autorestart: true,
      error_file: './storage/logs/cron-err.log',
      out_file: './storage/logs/cron-out.log',
    },
    {
      name: 'kue',
      //script: './build/ace',
      script: './ace',
      args: ['bull:listen'],
      instances: 5,
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
      },
      autorestart: true,
      error_file: './storage/logs/cron-err.log',
      out_file: './storage/logs/cron-out.log',
    },
  ],
  deploy: {
    
  },
}
//run pm2 start
//pm2 kill && pm2 startOrRestart ecosystem.config.js --only web
