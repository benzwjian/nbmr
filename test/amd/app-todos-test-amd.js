/*
 * Sorry about the following, but we need to know if
 * we're running under node.js or in the browser. That
 * turns out to be really hard to determine reliably,
 * but the following code should work in all but the
 * really really extreme cases.
 */

if (typeof exports !== 'undefined' && this.exports !== exports) {
	/*
	 * Here's why the node.js environment needs special
	 * treatment: 
	 *
	 *   -  We need to identify dependencies so node.js
	 *      can load the necessary libraries. (In the
	 *      browser, these will be handled by explicit
	 *      includes, either of individual script files
	 *      or of concatenated, possibly minified versions.)
	 *
	 *   -  Node.js doesn't have a DOM into which we
	 *      can insert our views to test interactions.
	 *      We can simulate a DOM with jsdom.
	 *
	 */
	global.jsdom = require("jsdom").jsdom;
	global.window = jsdom().defaultView;
	global.document = window.document;

  	global.jQuery = require("jquery");
  	global.$ = jQuery;
  	global.chai = require("chai");
  	global.sinon = require("sinon");
  	chai.use(require("sinon-chai"));

	global.requirejs = require("requirejs");
	requirejs.config({
		baseUrl: __dirname + "/../../src",
		path:{
			"model": "model",
			"collection": "collection",
			"view": "view"
		},
	    nodeRequire: require
	});
}

var should = chai.should();
describe("Todo Model", function(){
	describe("Initialization", function() {
		var todo;
		beforeEach(function(done) {
			requirejs(["model/todo"], function(Todo){
				console.info('Todo');
				todo = new Todo();
				done();
			});
		})
		it("should default the status to 'pending'",function() {
			todo.get('complete').should.be.false;
		})
		it("should default the title to an empty string",function() {
			todo.get('title').should.equal("");
		})
	})
	
	describe("Attributes", function() {
		var todo, save_stub;
		beforeEach(function(done) {
			requirejs(["model/todo"], function(Todo){
				todo = new Todo();
				save_stub = sinon.stub(todo, "save");
				done();
			});
		})
		afterEach(function() {
			save_stub.restore();
		})
		it("should support setting the title", function() {
			todo.set('title',"Test");
			todo.get('title').should.equal("Test");
		})
		it("should support setting the status", function() {
			todo.set('complete',true);
			todo.get('complete').should.be.true;
		})
		it("should toggle status from 'pending' to 'complete'", function() {
			todo.toggleStatus();
			todo.get('complete').should.be.true;
		})
	})
	describe("Persistence", function() {
		var todo, save_stub;
		beforeEach(function(done) {
			requirejs(["model/todo"], function(Todo){
				todo = new Todo();
				save_stub = sinon.stub(todo, "save");
				done();
			});
		})
		afterEach(function() {
			save_stub.restore();
		})
		it("should update server when title is changed", function() {
			todo.set("title", "New Todo");
			save_stub.should.have.been.calledOnce;
		})
		it("should update server when status is changed", function() {
			todo.set('complete',true);
			save_stub.should.have.been.calledOnce;
		})
	})
	
})

describe("Todo List Item View", function() {
	var todo, save_stub, item;
	beforeEach(function(done) {
		requirejs(["model/todo", "view/todolistitem"], function(Todo, TodoListItem){
			todo = new Todo({title: "Todo"});
			save_stub = sinon.stub(todo, "save");
			item = new TodoListItem({model: todo});
			done();
		});
	})
	afterEach(function() {
		save_stub.restore();
	})
	it("render() should return the view object", function() {
		item.render().should.equal(item);
	});
	
	it("should render as a list item", function() {
	  item.render().el.nodeName.should.equal("LI");
	})
	describe("Template", function() {
		beforeEach(function(){
			item.render();
		})	
		it("should contain the todo title as text", function() {
			item.$el.text().should.have.string("Todo");
		})
		it("should include a label for the status", function() {
			item.$el.find("label").should.have.length(1);
		})
		it("should include an <input> checkbox", function() {
			item.$el.find("label>input[type='checkbox']").should.have.length(1);
		})
		it("should be clear by default (for 'pending' todos)", function() {
			item.$el.find("label>input[type='checkbox']").is(":checked").should.be.false;
		})
		it("should be set for 'complete' todos", function() {
			todo.set("complete", true);
			item.render();
			item.$el.find("label>input[type='checkbox']").is(":checked").should.be.true;
		})
	})
	describe("Model Interaction", function() {
		it("should update model when checkbox clicked", function() {
      		$("<div>").attr("id","fixture").css("display","none").appendTo("body");
			item.render();
			$("#fixture").append(item.$el);
			item.$el.find("input").click();
			todo.get('complete').should.be.true;
			$("#fixture").remove();
		})
	})

})


describe("Todos Collection", function() {
	var todos;
	beforeEach(function(done) {
		requirejs(["collection/todos"], function(Todos){
			todos = new Todos([
				{title: "Todo 1"},
				{title: "Todo 2"}
			]);
			done();
		});
	})
	it("should support explicit initialization with multiple todos", function() {
		todos.length.should.equal(2);
	})
})

describe("Todos List View", function() {
	var todos, list;
	beforeEach(function(done){
		requirejs(["collection/todos", "view/todoslist"], function(Todos, TodosList){
			todos = new Todos([
				{title: "Todo 1"},
				{title: "Todo 2"}
			]);
			list = new TodosList({collection: todos});
			done();
		});
	})
	it("render() should return the view object", function() {
		list.render().should.equal(list);
	});
	it("should render as an unordered list", function() {
		list.render().el.nodeName.should.equal("UL");
	})
	it("should include list items for all models in collection", function() {
		list.render();
		list.$el.find("li").should.have.length(2);
	})
})

/*
 * For extra credit, the following code can be used to 
 * test interaction with a REST API. It's not really
 * appropriate for unit tests of the todos module
 * because it's actually testing the backbone library.
 *
 * You might need to mock a REST API if your server doesn't
 * provide the standard backbone responses (e.g. using
 * ._id instead of .id) and the model has to adjust for
 * that.
 */

describe("Collection's Interaction with REST API", function() {
	var todos;
	beforeEach(function(done){
		requirejs(["collection/todos"], function(Todos){
			todos = new Todos();
			done();
		});
	})
	it("should load using the API", function() {
		this.ajax_stub = sinon.stub($, "ajax").yieldsTo("success", [
			{ id: 1, title: "Mock Todo 1", complete: false },
		  { id: 2, title: "Mock Todo 2", complete: true  }
		]);
		todos.fetch();
		todos.should.have.length(2);
		todos.at(0).get('title').should.equal("Mock Todo 1");
		todos.at(1).get('title').should.equal("Mock Todo 2");
		this.ajax_stub.restore();
	})
})
