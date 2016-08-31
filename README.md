![node tastypie](./assets/tastypie-logo.png) 

[![NPM](https://nodei.co/npm/tastypie.png?downloads=true&downloadRank=true)](https://nodei.co/npm/tastypie/)

[![license](https://img.shields.io/github/license/esatterwhite/node-tastypie.svg?style=flat-square&maxAge=2592000)](https://github.com/esatterwhite/node-tastypie/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/tastypie.svg?maxAge=2592000&style=flat-square)](https://www.npmjs.com/package/tastypie)
[![node](https://img.shields.io/node/v/tastypie.svg?style=flat-square&maxAge=2592000)](https://npmjs.org/package/tastypie)
[![David](https://img.shields.io/david/esatterwhite/node-tastypie.svg?style=flat-square&maxAge=2592000)](https://david-dm.org/esatterwhite/node-tastypie)
[![Travis](https://img.shields.io/travis/node-tastypie/tastypie.svg?maxAge=2592000&style=flat-square)](https://travis-ci.org/node-tastypie/tastypie)
[![Codacy grade](https://img.shields.io/codacy/grade/115291230cab4064bed392dd30dfd32a.svg?style=flat-square)](https://www.codacy.com/app/esatterwhite/tastypie)

A re-realization of the popular Django REST framework - Tasypie for Node.js and [Hapi.js](http://hapijs.com/).
Looking for active contributors / collaborators to help shape the way people build APIs!

[API Documentation](http://node-tastypie.github.io/tastypie) [Working Example](./example/app.js)


### Officially Supported Resources Types

* [Official Monogoose Resource](https://github.com/node-tastypie/tastypie-mongo)
* [Official RethinkDB Resource](https://github.com/node-tastypie/tastypie-rethink)

### Experimental Resource Types

* [Bookshelf/knex Resource](https://github.com/node-tastypie/tastypie-bookshelf)
 
### Create a simple Api

```js
const {Api, Resource} = require('tastypie');
const {Server}          = require('hapi');
const server            = new Server();
const v1                = new Api('api/v1' );

const UserResource = tastypie.Resource.extend({
    fields:{
        lastName:{ type:'char', attribute:'name.first', help:'last name of the user'},
        firstName:{ type:'char', attribute: 'name.last', help:'first name of the user'}
    }
});

v1.use('test', new Resource() );
server.connection({ port:2000 });

server.register( v1,( ) => {
    server.start(()=>{
        console.log('server listening localhost:2000');
    });
});
```

### Self Describing

Tastypie exposes endpoint to descibe available resources and the contracts they expose

#### Resource listing
```js
// GET /api/v1
{
    "test":{
        "schema": "/api/v1/test/schema",
        "detail": "/api/v1/test/{pk}",
        "list": "/api/v1/test"
    }
}
```

##### Auto Schema

```js
// GET /api/v1/test/schema

{
	"filtering": {},
	"ordering": [],
	"formats": ["application/json", "text/javascript", "text/xml"],
	"limit": 25,
	"fields": {
		"lastName": {
			"default": null,
			"type": "string",
			"nullable": false,
			"blank": false,
			"readonly": false,
			"help": "last name of the user",
			"unique": false,
			"enum": []
		},
		"firstName": {
			"default": null,
			"type": "string",
			"nullable": false,
			"blank": false,
			"readonly": false,
			"help": "first name of the user",
			"unique": false,
			"enum": []
		},
		"id": {
			"default": null,
			"type": "string",
			"nullable": false,
			"blank": false,
			"readonly": true,
			"help": "Unique identifier of this resource",
			"unique": false,
			"enum": []
		},
		"uri": {
			"default": null,
			"type": "string",
			"nullable": false,
			"blank": false,
			"readonly": true,
			"help": "The URI pointing back the this resource instance",
			"unique": false,
			"enum": []
		}
	},
	"allowed": {
		"schema": ["get"],
		"detail": ["get", "put", "post", "delete", "patch", "head", "options"],
		"list": ["get", "put", "post", "delete", "patch", "head", "options"]
	}
}
```
##### Get Data

```js

// GET /api/v1/test

{

    "meta":{
        "count":1,
        "limit":25,
        "next":null,
        "previous":null 
    },
    "data":[{
        firstName:"Bill",
        lastName:"Bucks",
        uri:"/api/v1/test/1"    
    }]
} 


// GET /api/v1/test/1

{
    firstName:"Bill",
    lastName:"Bucks",
    uri:"/api/v1/test/1"    
}
```

#### Built-in Fields

* field ( ApiField ) - Generic noop field - returns the data as it is given
* object ( ObjectField ) - Generic no-op field - returns the data as it is given
* char ( character / CharField ) - Converts values to strings
* array ( ArrayField ) Converts comma sparated strings into arrays
* int ( int / IntegerField ) converts numeric values into integers using `parseInt`
* float ( FloatField ) Converts values to floating point number using `parseFloat`
* bool ( BooleanField ) Forces values to booleans
* date ( DateField ) Converts date strings to Date objects with out any time data
* datetime ( DateTimeField ) Attempts to convert date time strings into date objects
* file ( FileField ) A field that pipes a stream to a configured location, and store a path
* filepath ( FilePathField ) A field that handles file locations rather than dealing with streams or binary data

This allows for full HTTP support and basic CRUD operations on a single enpoint - api/v1/test

```sh
curl -XPOST -H "Content-Type: applciation/json" -d '{"test":"fake"}' http://localhost:3000/api/v1/test
curl -XPUT  -H "Content-Type: applciation/json" -d '{"test":"real"}' http://localhost:3000/api/v1/test
curl -XDELETE http://localhost:3000/api/v1/test/fake
```

#### HTTP Verbs

This is how tastypie handles the base HTTP Methods 

* GET returns a list of resource instance or a specific resource instance
* DELETE removes a specific resource instance
* PUT **REPLACES** a resource instance. This is not a partial update. Any optional fields not define we be set to undefined
* PATCH a **PARTIAL** update to a specific resource instance. 
* **OPTIONS**, **HEAD**, **TRACE**, and **CONNECT** are left to implementation on a per resource bases


### Serialization
The base serializer can deal with `xml`, `json` and `jsonp` out of the box. Serialization method is determined by the `Accept` header or a `format` query string param

```sh
curl -H "Accept: text/xml" http://localhost:3000/api/v1/test
curl http://localhost:3000/api/v1/test?format=xml
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<response>
 <firstName type="string">bill</firstName>
 <lastName type="string">Schaefer</lastName>
</response>
```

**NOTE:** hapi captures application/foo so for custom serialization, we must use text/foo

#### Quick & Dirty Resource

A functional resource, by convention, should define method handlers for each of the `actions` ( `list`, `detail`, `schema`, etc ) & `HTTP verbs` where it makes sense - where the resource method name is `<VERB>_<ACTION>`. These are hanled especially internally as asynchronous handlers, and can be `generator functions` functions that return a `Promise` or plain old functions if that is all that is needed 

```javascript
const {Resource, http} = require('tastypie')

const Template = function(){
	this.key = null
	this._id = null
};

Template.prototype.save = function(){
	return new Promise( function( resolve, reject ){
		setTimeout( ( )=>{ resolve( this ) }, 300 )
	});
};

Template.prototype.toJSON = function(){
	return { key, _id };
}

const Simple = Resource.extend({
    options:{
    	name:'simple'
    	,pk:'_id'
		,template: Template
    }
    ,fields:{
        key:{type:'char'}
    }
    
    ,constructor:function( options ){
        this.parent('constructor', options)
    }
    
    /**
     * handles DELETE /{pk}
     **/
    , delete_detail: function*( bundle ){
        bundle.data = null;
        return this.respond( bundle, http.noContent ) // Send a custom response code
    }

    /**
     * handles GET /{pk}
     **/    
    , get_detail: function*( bundle ){
        bundle.data = {key:'foo', _id:1};
        return this.respond( bundle ) // defaults to 200 OK respose code
    }
    
    /**
     * handles GET /
     **/
    ,get_list: function*( bundle ){
        // the data property is what gets returned
        bundle.data = [{ key:'foo', _id:1},{key:'bar', _id:2}]; 
		
        // use the respond method if you
        // want serialization, status code, etc...
        return this.respond( bundle )
    }
    
    /**
     * handles PATCH /{pk}
     **/
    , patch_detail: function*( bundle ){
        // or just send a straight response.
        // res is the hapi reply object
        
		return bundle.res({any:'data you want'}).code( 201 );
    }    

    /**
     * handles POST /
	 * -- includes all major steps
     **/
    , post_list: function*( bundle ){
		// determine the format of incomming request data
		let format = this.format( bundle ) // application/json , text/xml, etc

		// deserialize data into javascript object
		bundle.data = yield this.deserialize( bundle.data, format );

		// populate a new Template instance from data
		bundle = yield this.full_hydrate( bundle );

		// save the populated object
		yield bundle.object.save();

		// prep data for response
		bundle.data = yield this.full_deydrate( bundle.object );
		
		// responsd w/ custom status
        return this.respond( bundle, http.created )
    }
    
    /**
     * handles PUT /{pk}
     **/
    , put_detail: function*( bundle ){
    	// Manually set the Bundle's data property to send back to the client
        bundle.data = {key:'updated'}
        return this.respond( bundle, http.accepted )
    }
});
```
#### Example FS resourse

The base resource defines many of the required `<VERB>_<ACTION>` methods for you and delegates to smaller internal methods which you can over-ride to customize behaviors. Here is a resource that will asyncronously read a JSON file from disk are respond to GET requests. Supports **XML**, **JSON**, paging and dummy cache out of the box.


```javascript
const path                                       = require('path')
const debug                                      = require('debug')('tastypie:example')
const {Resource, Api, fields, Class, Serializer} = require('tastypie')
const {Server}                                   = require('hapi');
const {readFile}                                 = require('fs')
const Options                                    = require('tastypie/lib/class/options')
const server                                     = new Server();

// make a simple object template to be populated during the hydration process
// This could be a Model class just as easily
function Schema(){
    this.name = {
        first: undefined, last: undefined
    }
    this.age = undefined;
    this.guid = undefined;
    this.range = []
    this.eyeColor = undefined;
};


var Base = Class({
    inherits:Resource
    ,options:{
        template: Schema // Set the schema as the Object template
    }
    ,fields:{
        // remap _id to id
          id       : { type:'field', attribute:'_id' }
        , age      : { type:'int' } 

        // can also be a field instance
        , eyeColor : new fields.CharField({'null':true})
        , range    : { type:'array', 'null': true }
        , fullname : { type:'char', 'null':true }

        // remap the uid property to uuid. 
        , uuid     : { type:'char', attribute:'guid'}
        , name     : { type:'field'}
    }
   , constructor: function( meta ){
        this.parent('constructor', meta )
   }

    // internal lower level method responsible for getting the raw data
    , get_objects: function(bundle){
        return new Promise(function(resolve, reject){
            readFile( path.join(__dirname, 'example','data.json') , (err, buff){
                if( err ){
                    reject( err )
                } else {
                    resolve(buff)
                }
            });
        });
    }


    // internal low level method reponsible for dealing with a POST request
    , create_object: function* create_object( bundle ){
        bundle.object = Object.create( null );
        bundle = yield this.full_hydrate( bundle );
        return bundle;
    }
    // per field dehydration method - generates a full name field from name.first & name.last
    , dehydrate_fullname:function( obj, bundle ){
        return `${obj.name.first} ${obj.name.last}`
    }

    // top level method for custom GET /upload 
    , get_upload: function*( bundle ){
        return this.respond({data:{key:'value'}})
    }

    // method that retreives an individual object by id.
    // becuase it's in a flat file, read it, filter and return first object
    ,get_object: function*( bundle, callback ){
        let objects = yield this.get_objects( bundle );
        return JSON.parse( objects ).filter(function( obj ){
            return obj._id = bundle.req.params.id
        })[0]
    }

    // Proxy method for delegeting HTTP methods to approriate resource method
    , dispatch_upload: function(req, reply ){
        // Do additional magic here if needed.
        return this.dispatch('upload', this.bundle( req, reply ) )
    }
    
    // adds a custom route for upload in addition to standard crud methods
    , prepend_urls:function(){
        return [{
          route: '/api/v1/data/upload'
          , handler: this.dispatch_upload.bind( this )
          , name:'upload'
        }]
    }
});
var api = new Api('api/v1', {
    serializer:new Serializer()
})

server.connection({port:process.env.PORT || 2000 });

api.user('data', new Base() );

server.register( api, function(e){
    server.start(function(){
        console.log('server is ready')
    });
});

```

Now you can read data from a file with your rest API

```sh
curl http://localhost:2000/api/v1/test
curl http://localhost:2000/api/v1/test?format=xml
curl http://localhost:2000/api/v1/test/1
curl http://localhost:2000/api/v1/test/2
curl http://localhost:2000/api/v1/test/2?format=xml
```

### Contributing

Contributions & patches welcome. If you have experience working with the original python / django-tastypie,  input would be greatly appreciated. Anything from docs, test and feature code is fair game.

1. Fork
2. Write Code
3. Write tests
4. Document your code
6. Push
7. Open Pull Request
