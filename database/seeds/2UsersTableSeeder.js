const crypto = require('../../commons/crypto');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, displayname: 'Admin', email: 'admin@gmail.com', password: crypto.createHash('12345678,admin@gmail.com'), description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus itaque, autem necessitatibus voluptate quod mollitia delectus aut, sunt placeat nam vero culpa sapiente consectetur similique, inventore eos fugit cupiditate numquam!', role: 0}
      ]);
    });
};
