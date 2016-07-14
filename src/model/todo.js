define(['underscore', 'backbone'], function(_, Backbone) {
	var model = Backbone.Model.extend({
	  defaults: {
	    title:    "",
	    complete: false
	  },
	  initialize: function() {
	    // keep the server updated on changes
	    // note: can't use the more concise
	    //           this.on("change",this.save);
	    //       because it creates an infinite loop
	    //       in backbone.
	    this.on("change", function(){ this.save(); });
	  },
	  toggleStatus: function() {
	    // invert the value of the complete attribute
	    this.set("complete",!this.get("complete"));
	  }
	});
	return model;
});