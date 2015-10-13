/**
 * Created by hamidhoseini on 10/2/15.
 */

Backbone.Model.prototype.idAttribute = '_id';
// Backbone Model

var Blog = Backbone.Model.extend({
    defaults: {
        author: '',
        title: '',
        url: ''
    }
});

// Backbone Collection

var Blogs = Backbone.Collection.extend({
    url: 'http://localhost:3001/api/blogs'
});
/*
// instantiate two Blog
var blog1 = new Blog({
    author: 'Hamid',
    title: 'Hamid\' blog',
    url: 'http://www.hamid.com'
});
var blog2 = new Blog({
    author: 'Mary',
    title: 'Mary\' blog',
    url: 'http://www.Mary.com'
});
 */
// instantiate a collection
var blogs = new Blogs();


// Backbone for one blog
var BlogView = Backbone.View.extend({
    model: new Blog(),
    tagName: 'tr',
    initialize: function () {
        this.template = _.template($('.blogs-list-template').html());
    },
    events: {
        'click .edit-blog': 'edit',
        'click .update-blog': 'update',
        'click .cancel-blog': 'cancel',
        'click .delete-blog': 'delete'
    },
    edit: function () {
        $('.edit-blog').hide();
        $('.delete-blog').hide();
        this.$('.update-blog').show();
        this.$('.cancel-blog').show();

        var author= this.$('.author').html(),
            title = this.$('.title').html(),
            url = this.$('.url').html();
        this.$('.author').html('<input type="text" class="form-control author-update" value="'+author+'">');
        this.$('.title').html('<input type="text" class="form-control title-update" value="'+title+'">');
        this.$('.url').html('<input type="text" class="form-control url-update" value="'+url+'">');
    },
    update: function () {
        this.model.set({'author': $('.author-update').val()});
        this.model.set({'title': $('.title-update').val()});
        this.model.set({'url': $('.url-update').val()});
        this.model.save(null, {
            success: function (response) {
                console.log('successfully updated blog with _id:'+ response.toJSON()._id);
            },
            error: function (error) {
                console.log('Failed to update blog!');
            }
        });
    },
    cancel: function () {
        blogsView.render();
    },
    delete: function () {
        this.model.destroy({
            success: function (response) {
                console.log('successfully Deleted blog with _id:'+ response.toJSON()._id)
            },
            error : function (error) {
                console.log('Failed to DELETE blog !');
            }
        });
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});
// Backbone for all blogs
var BlogsView = Backbone.View.extend({
    model: blogs,
    el: $('.blogs-list'),
    initialize: function () {
        var self = this;
        this.model.on('add', this.render, this);
        this.model.on('change', function () {
            setTimeout(function () {
                self.render();
            }, 30)
        }, this);
        this.model.on('remove', this.render, this);

        this.model.fetch({
            success: function (response) {
                console.log(response);
                _.each(response.toJSON(), function (item) {
                    console.log('successfully GOT blog with _id: '+ item._id);
                })
            }, error: function () {
                console.log('Failed to get blogs');
            }
        });
    },
    render: function () {
        var self= this;
        this.$el.html('');
        _.each(this.model.toArray(), function (blog) {
            self.$el.append((new BlogView({model: blog})).render().$el);
        });
        return this;
    }
});

var blogsView = new BlogsView();

$(function () {
   $('.add-blog').on('click', function () {
       var blog= new Blog({
           author: $('.author-input').val(),
           title: $('.title-input').val(),
           url: $('.url-input').val(),

       });
       $('.author-input').val('');
       $('.title-input').val('');
       $('.url-input').val('');
       blogs.add(blog);
       blog.save(null, {
          success: function (response) {
              console.log('successfully Saved blog with _id:'+ response.toJSON()._id);
          },
          error: function () {
              console.log('Failed to save blog!');
          } 
       });
   })
});

