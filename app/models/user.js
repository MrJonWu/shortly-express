var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: false,

  initialize: function() {
    this.on('creating', this.hashPassword, this);
  },

  hashPassword: function(model, attr, options) {
    return new Promise(function(resolve, reject) {
      bcrypt.hash(model.get('password'), null, null, function(err, hash) {
        if (err) {
          reject(err);
        }
        model.set('password', hash);
        resolve(hash);
      });
    });
  },

  logIn: function(password) {
    console.log('invoked with ', password);
    var hash = this.get('password');
    return new Promise(function(resolve, reject) {
      bcrypt.compare(password, hash, function (err, match) {
        if (err) {
          reject(err);
        } else {
          resolve(match);
        }
      });
    }.bind(this));
  }
});

module.exports = User;