
exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.increments('id').primary();
        table.string('displayname').notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.integer('role').defaultTo(0);
        table.string('description', 500).defaultTo('');
        table.boolean('is_blocked').defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
