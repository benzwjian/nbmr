define( ["backbone", "underscore"], function ( Backbone, _ ) {
	var view = Backbone.View.extend({
	  tagName: "li",
	  template: _.template(
	      "<label>"
	    +   "<input type='checkbox' <% if(complete) print('checked') %>/>"
	    +   " <%= title %> "
	    + "</label>"),
	  events: {
	    "click input": "statusChanged"
	  },
	  render: function() {
	    this.$el.html(this.template(this.model.attributes));
	    return this;
	  },
	  statusChanged: function() {
	    this.model.toggleStatus();
	  },
	  initialize: function() {
	    this.model.on("change", this.render, this);
	    this.model.on("destroy", this.remove, this);
	  },
	  remove: function() {
	    this.$el.remove();
	  }
	});
	return view;
});