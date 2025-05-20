'use strict';

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
  return db.createTable("members", {
    id: {
      type: "string",
      length: 30,
      primaryKey: true,
    },
    reg_number: {
      type: "string",
      length: 30,
      notNull: true,
    },
    name: {
      type: "string",
      length: 250,
      notNull: true,
    },
    gender: {
      type: "char",
      length: 1,
    },
    birth_date: {
      type: "date",
    },
    marriage_date: {
      type: "date",
    },
    category: {
      type: "string",
      length: 50,
    },
    father_id: {
      type: "string",
      length: 50,
    },
    mother_id: {
      type: "string",
      length: 50,
    },
    spouse_id: {
      type: "string",
      length: 50,
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
    session_id: {
      type: "string",
      length: 30,
    },
  });
};

exports.down = function(db) {
  return db.dropTable("members");
};

exports._meta = {
  "version": 1
};
