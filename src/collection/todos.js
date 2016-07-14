define(['model/todo', 'backbone'], function(Todo, Backbone) {
	var collection = Backbone.Collection.extend({
	  model: Todo,
	  url: "api/todos"
	});
	return collection;
});