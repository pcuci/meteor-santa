if (Meteor.isClient) {
  UserConnections = new Mongo.Collection("user_status_sessions");

  relativeTime = function(timeAgo) {
    var ago, days, diff, time;
    diff = moment.utc(TimeSync.serverTime() - timeAgo);
    time = diff.format("H:mm:ss");
    days = +diff.format("DDD") - 1;
    ago = (days ? days + "d " : "") + time;
    return ago + " ago";
  };
  Handlebars.registerHelper("userStatus", UserStatus);
  Handlebars.registerHelper("localeTime", function(date) {
    return date != null ? date.toLocaleString() : void 0;
  });
  Handlebars.registerHelper("relativeTime", relativeTime);
  Template.Login.helpers({
    loggedIn: function() {
      return Meteor.userId();
    }
  });
  Template.status.events = {
    "submit form.start-monitor": function(e, tmpl) {
      e.preventDefault();
      return UserStatus.startMonitor({
        threshold: tmpl.find("input[name=threshold]").valueAsNumber,
        interval: tmpl.find("input[name=interval]").valueAsNumber,
        idleOnBlur: tmpl.find("select[name=idleOnBlur]").value === "true"
      });
    },
    "click .stop-monitor": function() {
      return UserStatus.stopMonitor();
    },
    "click .resync": function() {
      return TimeSync.resync();
    }
  };
  Template.status.helpers({
    lastActivity: function() {
      var lastActivity;
      lastActivity = this.lastActivity();
      if (lastActivity != null) {
        return relativeTime(lastActivity);
      } else {
        return "undefined";
      }
    }
  });
  Template.status.helpers({
    serverTime: function() {
      return new Date(TimeSync.serverTime()).toLocaleString();
    },
    serverOffset: TimeSync.serverOffset,
    serverRTT: TimeSync.roundTripTime,
    isIdleText: function() {
      return this.isIdle() || "false";
    },
    isMonitoringText: function() {
      return this.isMonitoring() || "false";
    }
  });
  Template.Hat.helpers({
    users: function() {
      return Meteor.users.find();
    }
  });
  Template.serverStatus.helpers({
    anonymous: function() {
      return UserConnections.find({
        userId: {
          $exists: false
        }
      });
    },
    users: function() {
      return Meteor.users.find();
    },
    userClass: function() {
      var ref;
      if ((ref = this.status) != null ? ref.idle : void 0) {
        return "warning";
      } else {
        return "success";
      }
    },
    connections: function() {
      return UserConnections.find({
        userId: this._id
      });
    }
  });
  Template.serverConnection.helpers({
    connectionClass: function() {
      if (this.idle) {
        return "warning";
      } else {
        return "success";
      }
    },
    loginTime: function() {
      if (this.loginTime == null) {
        return;
      }
      return new Date(this.loginTime).toLocaleString();
    }
  });
  Template.Login.events = {
    "submit form": function(e, tmpl) {
      var input;
      e.preventDefault();
      input = tmpl.find("input[name=username]");
      input.blur();
      return Meteor.insecureUserLogin(input.value, function(err, res) {
        if (err) {
          return console.log(err);
        }
      });
    }
  };
  Deps.autorun(function(c) {
    try {
      UserStatus.startMonitor({
        threshold: 30000,
        idleOnBlur: true
      });
      return c.stop();
    } catch (_error) {}
  });
}

if (Meteor.isServer) {
  process.env.HTTP_FORWARDED_COUNT = 1;
  Meteor.publish(null, function() {
    return [
      Meteor.users.find({
        "status.online": true
      }, {
        fields: {
          status: 1,
          username: 1
        }
      }), UserStatus.connections.find()
    ];
  });
}
