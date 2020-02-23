
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('posts').del()
    .then(function () {
      // Inserts seed entries
      return knex('posts').insert([
        {id: 1, user_id: 1, title: 'Hello world!', description: 'First post on page', content: 'First post on page', slug: 'hello-world', publication: 1}
      ]);
    });
};
