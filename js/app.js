var githubName = "alsotang";
var repos = 'alsotang.github.com';
var converter = new Showdown.converter();

App = Ember.Application.create();

App.LoadingCSS = Ember.View.extend({
  didInsertElement: function() {
    var $windows8 = $('.windows8');
    $(document).ajaxStart(function() {
      $windows8.show();
    }).ajaxStop(function() {
      $windows8.hide();
    });
  }
});


Ember.Handlebars.registerBoundHelper('markdown', function(content) {
  if(content === undefined) {
    return '';
  }

  var html_content = converter.makeHtml(content);
  return new Handlebars.SafeString(html_content);
});

Ember.Handlebars.registerBoundHelper('post_title', function(name) {
  if(name === undefined) {
    return '';
  }

  post_title = name.split('_')[1];
  post_title = post_title.split('.')[0];

  return '<%@>'.fmt(post_title);
});

Ember.Handlebars.registerBoundHelper('post_time', function(name) {
  if(name === undefined) {
    return '';
  }

  post_time = name.split('_')[0];

  return '----post at %@'.fmt(post_time.replace(/\-/g, '/'));
});


App.TitlesController = Ember.ArrayController.extend({
  content: [],
  init: function() {
    this._super();
    var PostsURL = 'https://api.github.com/repos/' + githubName + '/' + repos + '/contents/md?callback=?';

    var _this = this;
    $.getJSON( PostsURL ).done(function( posts ) {
      $.each( posts.data, function( i, post) {
        _this.pushObject(post);
      });
      $('.windows8').hide();
    });
  },
  reverse: function() {
    return this.toArray().reverse();
  }.property('@each'),
  loadPost: function(view) {
    $.get(view.path, function(data) {
      App.postController.set('content', {post_content: data});
    });
  }
});

App.titlesController = App.TitlesController.create();


App.PostController = Ember.ObjectController.extend({});

App.postController = App.PostController.create();



/* make bootstrap navlist response to link active from Emberjs.*/

App.NavListView = Ember.View.extend({
  tagName: 'li',
  classNameBindings: 'active'.w(),

  didInsertElement: function () {
      this._super();
      this.notifyPropertyChange('active');
      var _this = this;
      this.get('parentView').on('click', function () {
          _this.notifyPropertyChange('active');
      });
  },

  active: function () {
      return this.get('childViews.firstObject.active');
  }.property()
});
