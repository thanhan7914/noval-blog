
exports.up = function(knex) {
    return knex.schema.createTable('post_category', function(table) {
        table.integer('post_id').unsigned().notNullable()
            .references('id').inTable('posts').onDelete('CASCADE').onUpdate('RESTRICT');
        table.integer('cat_id').unsigned().notNullable()
            .references('id').inTable('categories').onDelete('CASCADE').onUpdate('RESTRICT');
        table.primary(['post_id', 'cat_id']);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('post_category');
};
