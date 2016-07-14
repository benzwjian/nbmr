define( ["backbone", "view/todolistitem"], function ( Backbone, TodoListItem ) {
	var view = Backbone.View.extend({
	  tagName: "ul",
	  initialize: function() {
	    this.collection.on("add", this.addOne, this);
	    this.collection.on("reset", this.addAll, this);
	  },
	  render: function() {
	    this.addAll();
	    return this;
	  },
	  addAll: function() {
	    this.collection.each(this.addOne, this);
	  },
	  addOne: function(todo) {
	    var item = new TodoListItem({model: todo});
	    this.$el.append(item.render().el);
	  }
	});
	return view;
});