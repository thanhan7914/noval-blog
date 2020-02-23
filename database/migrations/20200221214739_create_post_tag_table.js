
exports.up = function(knex) {
    return knex.schema.createTable('post_tag', function(table) {
        table.integer('post_id').unsigned().notNullable()
            .references('id').inTable('posts').onDelete('CASCADE').onUpdate('RESTRICT');
        table.integer('tag_id').unsigned().notNullable()
            .references('id').inTable('tags').onDelete('CASCADE').onUpdate('RESTRICT');
        table.primary(['post_id', 'tag_id']);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('post_tag');
};
