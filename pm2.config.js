module.exports = {
  apps : [
    {
      name      : 'verify',
      script    : "app.js",
      instances : "max",
      exec_mode : "cluster"
    }
  ]
}
