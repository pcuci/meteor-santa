UserConnections = new Mongo.Collection("user_status_sessions");

Deps.autorun(function(c) {
  try {
    UserStatus.startMonitor({
      threshold: 30000,
      idleOnBlur: true
    });
    return c.stop();
  } catch (_error) {}
});
