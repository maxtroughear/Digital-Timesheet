module.exports = [{
  script: 'index.js',
  name: 'api',
  kill_timeout: 3000,
  listen_timeout: 10000,
  wait_ready: true,
  shutdown_with_message: true,
  exp_backoff_restart_delay: 100,
  exec_mode: 'cluster',
  instances: -1, // launch as many instances as there are CPUs minus 1
  // last cpu will be used by worker
},
// {
//   script: 'worker.js',
//   name: 'worker',
// },
];
