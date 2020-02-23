module.exports = function(router) {
    router.get(/(index|dashboard)/, 'Admin/DashboardController@dashboard');

    router.get('/post', 'Admin/PostController@index');
    router.post('/post', 'Admin/PostController@store');
    router.get('/post/create', 'Admin/PostController@create');
    router.get('/post/:article/edit', 'Admin/PostController@edit');
    router.post('/post/:article', 'Admin/PostController@update');
    router.get('/post/:article/destroy', 'Admin/PostController@destroyConfirm');
    router.post('/post/:article/destroy', 'Admin/PostController@destroy');

    router.get('/category', 'Admin/CategoryController@index');
    router.post('/category', 'Admin/CategoryController@store');
    router.post('/category/:catid', 'Admin/CategoryController@update');
    router.post('/category/:catid/destroy', 'Admin/CategoryController@destroy');
};
