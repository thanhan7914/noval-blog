
exports.up = function(knex) {
    return knex.schema.createTable('posts', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable()
            .references('id').inTable('users').onDelete('CASCADE').onUpdate('RESTRICT');
        table.string('title', 250).notNullable();
        table.text('content').notNullable();
        table.text('slug').notNullable().unique();
        table.string('description', 500).defaultTo('');
        table.boolean('publication').defaultTo(false);
        table.string('cover', 500).defaultTo('');
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('posts');
};
