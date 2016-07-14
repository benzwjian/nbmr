require.config({
    baseUrl: "/",
    paths: {
        "src": "src",
        "model": "src/model",
        "collection": "src/collection",
        "view": "src/view",
        "lib": "lib",
        "jquery": "lib/jquery-1.9.0.min",
        "underscore": "lib/underscore-min",
        "backbone": "lib/backbone-min"
    },
    shim: {
        'underscore': {
          exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

require(["jquery", "view/todoslist", "collection/todos"], function($, TodosList, Todos){
	var todos = new Todos();
	todos.fetch();
	var list = new TodosList({collection: todos});
	$("body").append(list.el);
});