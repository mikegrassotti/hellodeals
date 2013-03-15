// Put your custom code here

App = Ember.Application.create({
  rootElement: '#app'
});

App.LoadingRoute = Ember.Route.extend({
  enter: function() {
    console.log('loading enter');
  },
  exit: function() {
    console.log('loading exit');
  }
});
App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    return App.Deal.find();
  }
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return App.Deal.find();
  }
});

App.IndexController = Ember.ArrayController.extend({
  page: 1,
  loadMore: function() {
    this.incrementProperty('page');
    App.Deal.find({page: this.get('page')});
  }
});

App.Store = DS.Store.extend({
  revision: 12,
  mappings: {
      query: App.Query
  }
});

App.CustomSerializer = DS.JSONSerializer.extend({
  extractMany: function(loader, json, type, records) {
    data = {};
    data.deals = json.deals.map(function(item) {return item.deal;});
    this._super(loader, data, type, records);
  }
});

DS.RESTAdapter.reopen({
  namespace: 'v2',
  url: 'http://api.sqoot.com',
  serializer: App.CustomSerializer,
  ajax: function(url, type, hash) {
    hash.url = url;
    hash.type = type;
    hash.dataType = 'jsonp';
    hash.contentType = 'application/json; charset=utf-8';
    hash.context = this;
    hash.data = hash.data || {};
    hash.data.api_key = 'c6t5yl';
    if (hash.data && type !== 'GET') {
      hash.data = JSON.stringify(hash.data);
    }
    console.log('scheduling ajax...');
    Ember.run.later(this, function() {
      console.log('running ajax after delay...');
      jQuery.ajax(hash);
    }, 1000);

  }
});

App.Deal = DS.Model.extend({
  title: DS.attr('string'),
  image_url: DS.attr('string'),
  thumbnailUrl: function() {
    return this.get('image_url') + "&geometry=400x400C";
  }.property('image_url')
});



var pictureSource;   // picture source
var destinationType; // sets the format of returned value 

// Wait for Cordova to connect with the device
//
document.addEventListener("deviceready",onDeviceReady,false);
alert('hello ember');
// Cordova is ready to be used!
//
function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
  // Uncomment to view the base64 encoded image data
  // console.log(imageData);

  // Get image handle
  //
  var smallImage = document.getElementById('smallImage');

  // Unhide image elements
  //
  smallImage.style.display = 'block';

  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  smallImage.src = "data:image/jpeg;base64," + imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
  // Uncomment to view the image file URI 
  // console.log(imageURI);

  // Get image handle
  //
  var largeImage = document.getElementById('largeImage');

  // Unhide image elements
  //
  largeImage.style.display = 'block';

  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  largeImage.src = imageURI;
}

// A button will call this function
//
function capturePhoto() {
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
    destinationType: destinationType.DATA_URL });
}

// A button will call this function
//
function capturePhotoEdit() {
  // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
    destinationType: destinationType.DATA_URL });
}

// A button will call this function
//
function getPhoto(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
    destinationType: destinationType.FILE_URI,
    sourceType: source });
}
