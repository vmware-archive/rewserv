var reg = require('./register');

sourceGithub = {
  save: function(body) {
    var UsersSchema = reg.usersMongoSchema();
    UsersSchema.add({
          github_fullname: {type: String}
        , github_username: {type: String}
    });
    var users = reg.mongoose.model('users', UsersSchema);
    var sourceField = 'github_commit_' + body.id.split('/')[4]; 
    body.items.forEach(function(item, index, array) {
      users.update(
          { github_username: item.actor.permalinkUrl.split('/')[3], values.source: sourceField }
        , {
               github_fullname: item.actor.fullName
             , github_username: item.actor.permalinkUrl.split('/')[3]
             , values.source: sourceField
             , $inc:{ values.$.count: 1 } 
          } 
        , { upsert: true, multi: false }, function() {
            users.find({ github_username: item.actor.permalinkUrl.split('/')[3] }, function(err,dbret) {
              req.resp = dbret;
                if(err) {
                  req.resp = {'Error':err};
                  reg.log('Error: ' + err);
                  next();
                }
                if(dbret === null) {
                  req.resp = {'Error':'User not updated or created'};
                  reg.log('Error: User not updated or created');
                  next();
                } else {
                  req.resp = dbret;
                  reg.log(dbret);
                  next();
                }
            })
          });
      });
  }
}

module.exports = sourceGithub;
