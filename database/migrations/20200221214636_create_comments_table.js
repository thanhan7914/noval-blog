
exports.up = function(knex) {
    return knex.schema.createTable('comments', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable()
            .references('id').inTable('users').onDelete('CASCADE').onUpdate('RESTRICT');
        table.integer('post_id').unsigned().notNullable()
            .references('id').inTable('posts').onDelete('CASCADE').onUpdate('RESTRICT');
        table.text('content').notNullable();
        table.boolean('publication').defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('comments');
};
