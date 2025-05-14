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
  return db.createTable("member_phones", {
    id: {
      type: "string",
      length: 50,
      primaryKey: true,
    },
    member_id: {
      type: "string",
      length: 30,
      notNull: true,
      foreignKey: {
        name: 'fk_members_phone_members',
        table: 'members',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'id',
      },
    },
    phone: {
      type: "string",
      length: 25,
      notNull: true,
    },
    sequence: {
      type: "int",
      notNull: true,
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
  return db.dropTable("member_phones");
};

exports._meta = {
  "version": 1
};
