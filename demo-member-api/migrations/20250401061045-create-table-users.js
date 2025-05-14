"use strict";

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable("users", {
    id: {
      type: "string",
      length: 30,
      primaryKey: true,
    },
    email: {
      type: "string",
      length: 250,
      unique: true,
      notNull: true,
    },
    pwd: {
      type: "string",
      length: 250,
      notNull: true,
    },
    display_name: {
      type: "string",
      length: 250,
      notNull: true,
    },
    role: {
      type: "string",
      length: 50,
      notNull: false,
    },
    should_change_pwd: {
      type: "boolean",
      defaultValue: true,
      notNull: true,
    },
    suspended: {
      type: "boolean",
      defaultValue: false,
      notNull: true,
    },
    onetime_token: {
      type: "text",
      notNull: false,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
    },
    deleted_at: {
      type: "timestamp",
      notNull: false,
    },
  });
};

exports.down = function(db) {
  return db.dropTable("users");
};

exports._meta = {
  "version": 1
};
