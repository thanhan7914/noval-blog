
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('post_category').del()
    .then(function () {
      // Inserts seed entries
      return knex('post_category').insert([
        {post_id: 1, cat_id: 1}
      ]);
    });
};
