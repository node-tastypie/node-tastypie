var fields = require('../lib/fields');
var assert = require('assert');
var should = require('should')
var kindOf = require('mout/lang/kindOf');
var fs = require('fs');
var path = require('path');

describe("Api Fields", function(){

	describe("CharField",function(){
		describe('#dehydrate', function(){
			var f = new fields.CharField({name:'char',attribute:'char'});
			it('should convert values to strings', function(done){
				f.dehydrate({
					char:1
				}).then(function(value ){
					debugger;
					value.should.be.a.String();
					value.should.equal("1");
					done()
				}, done )
				.catch( done )
			})

			it('should allow empty strings', function( done ){
				f.dehydrate({
					char:''
				}).then(function( value ){
					value.should.be.a.String();
					value.should.equal( '' )
					done();
				},done)
			});
		});
		describe("#hydrate",function(){

			describe('~enum', function(){
				var field = new fields.CharField({
					name:'char'
				  , attribute:'char'
				  , enum:['a','b','c']
				  , default:'a'
				});

				it.skip('should return a default if not matched', function(done){
					field.hydrate({
						data:{
							char:''
						}
					}, function( err, value ){
						value.should.be.a.String();
						value.should.equal( 'a' );
						done();
					});
				});
			});

		})
	});
	describe("BooleanField", function(){
		var f = new fields.BooleanField();
		describe('falsy values', function(){
			it('should convert empty strings to False', function(){
				var value =  f.convert('');
				assert.strictEqual( value, false);
			});

			it('should treat "0" as false', function(){
				var value = f.convert( '0' );
				assert.strictEqual( value, false);
			});
			it('should treat "false" as false', function(){
				var value = f.convert( 'false' );
				assert.strictEqual( value, false);
			});

			it('should treat false as false', function(){
				var value = f.convert( false );
				assert.strictEqual( value, false);
			});

		});
		describe('truthy values', function(){
			it('should convert strings with chars as true', function(){
				var value =  f.convert('a');
				assert.strictEqual( value, true );
			});

			it('should treat "1" as true', function(){
				var value = f.convert( '1' );
				assert.strictEqual( value, true );
			});

			it('should treat "true" as true', function(){
				var value = f.convert( 'true' );
				assert.strictEqual( value, true );
			});

			it('should treat true as true', function(){
				var value = f.convert( true );
				assert.strictEqual( value, true);
			});
		});

		describe('boolean values', function(){
			it('should convert strings with chars as true', function(){
				var value =  f.convert('a');
				assert.strictEqual( value, true );
			});

			it('should treat "1" as 1', function(){
				var value = f.convert( '1' );
				assert.strictEqual( value, true );
			});
		});

		describe('dehydrate',function(){
			describe('default values', function(){
				it('should accept `false` as a default value', function( done ){
					var f = new fields.BooleanField({name:'fakebool', attribute:'fakebool', default:false });

					f.dehydrate({}).then(function( value ){
						assert.strictEqual( value, false, 'expected false, got ' + value );
						done();
					}, done);
				});

				it('should cast an empty string default value to `false`', function( done ){
					var f = new fields.BooleanField({name:'fakebool', attribute:'fakebool', default:'' });
					f.dehydrate({}).then(function( value ){
						assert.strictEqual( value, false, 'expected false, got ' + value );
						done();
					},done);
				});

				it('should cast a null default value to `false` ', function( done ){
					var f = new fields.BooleanField({name:'fakebool', attribute:'fakebool', default:null });
					f.dehydrate({}).then(function( value ){
						assert.strictEqual( value, false, 'expected false, got ' + value );
						done();
					},done);
				});
			});
		});

		describe('#convert',function(){
			it('should convert string to boolean', function(){
				var value = f.convert('true');
				value.should.be.a.Boolean;
				value.should.equal( true );

				value = f.convert('false');
				value.should.be.a.Boolean;
				value.should.equal( false );

			});

			it('should convert numbers to boolean', function(){
				var value = f.convert(1);
				value.should.be.a.Boolean;
				value.should.equal( true );

				value = f.convert(0);
				value.should.be.a.Boolean;
				value.should.equal( false );
			});
		});

	});

	describe('Datefield', function(){
		var f;
		before(function( done ){
			f = new fields.DateField();
			done();
		});

		describe('#convert',function(){
			it('should convert strings to dates', function(){
				var value = f.convert('2014-01-22');
				value.getFullYear().should.equal( 2014 );
				value.getMonth().should.equal(0);
				value.getDate().should.equal(22);
				value.getHours().should.equal(0);
				value.getMinutes().should.equal(0);
				value.getSeconds().should.equal(0);
			});

		});
	});

	describe('DateTimeField', function(){
		var f;
		beforeEach(function(){
			f = new fields.DateTimeField({ name:'dtf', attribute:'dtf'});
		});

		describe('#hydrate', function(){
			it('should convert a date string into a date object', function( done ){
				var bundle = {
					data:{},
					object:{
						dtf:'2014-02-27T15:54:04.000Z'
					}
				};

				f.hydrate( bundle).then(function( value ){
					assert( kindOf( value ), 'Date');
					assert.equal( value.getFullYear(), 2014 );
					assert.equal( value.getMinutes(), 54 );
					done();
				},done);
			});
		});
	});

	describe('ArrayField', function( ){
		var f;
		before( function( ){
			f = new fields.ArrayField();
		});

        describe('#convert', function( ){
			it.skip('should convert single values to an array', function(){
				var value = f.convert( 1 );
				value.should.be.a.Array();
			});

            it.skip("Should convert strings into to An Array", function(){
                var result = f.convert('Hello');

                assert.ok(Array.isArray( result ) );

                result = f.convert('Hello,world');
                assert.ok( Array.isArray( result ) );
                assert.equal( result[0], 'Hello');
                assert.equal( result[1], 'world');
            });

            it.skip('should leave array values untouched', function(){
                var a = [1,2,3];
                var b = f.convert( a );

                assert.deepEqual( a, b );
            });

			it.skip("should conver comma separate string values", function(){
				var value = f.convert('1, 2, 3');
				value.should.be.a.Array();
				value[0].should.be.String();
				value[0].should.equal('1');
			});

			it.skip("should no convert array values", function(){
				var value = f.convert([1,2,3]);
				value.should.be.a.Array();
				value[0].should.be.Number();
				value[0].should.equal(1);
			});
		});

		describe('#hydrate', function( ){
			var f;
			before( function( ){
				f = new fields.ArrayField({name:'afld', attribute:'afld'});
			});

			it.skip('should hydrate an array string to an array', function( done ){
				var bundle = {
					data:{},
					object:{
						'afld':'1,2,3'
					}
				};

				f.hydrate( bundle, function( err, value ){
					assert.equal( kindOf( value ), 'Array' );
					done();
				});
			});

			it.skip('should parse an array', function( done ){
				var bundle = {
					data:{},
					object:{
						'afld':['123']
					}
				};

				f.hydrate( bundle, function( err, value ){
					assert.equal( kindOf( value ),'Array');
					assert.equal( kindOf( value[0] ),'String');
					done( );

				});

			});
		});
	});

	describe('FileFIeld', function(){
		var f, location, dir;

		before(function(){
			dir = 'uploads';
			location = path.join( __dirname, dir, 'data.json' );
			f = new fields.FileField({
				dir: dir
				, attribute: 'file'
				, name: 'file'
				,root:__dirname
				,create:true
			});
		});

		after(function( done ){
			fs.unlink( location, function( err ){
				done( err );
			});
		});

		describe('#hydrate', function(  ){
			var bundle = {
				req:{
					payload:{

					}
				},
				res:{},
				data:{
					file: fs.createReadStream( path.resolve(__dirname,'..' , 'example', 'data.json' ) )
				},
				object:{}
			};

			bundle.data.file.hapi = {
				filename:'data.json'
			};

			it.skip('should consume streams', function( done ) {
				f.hydrate( bundle, function( err, d ){
					d.should.equal( path.join(__dirname, 'uploads', 'data.json'));
					done();
				});
			});
		});
		describe('#dehydrate', function( ){
			var bundle = {
				file: '/tmp/uploads/data.json'
			};
			it.skip('should return a path', function( done ){
				f.dehydrate( bundle, function( err, value ){
					value.should.equal( dir + '/' + 'data.json');
					done();
				});
			});
		});
	});

	describe('FilePathField', function(){
		var f;

		before(function(){
			f = new fields.FilePathField({
				name:'file'
				,attribute:'file'
			});
		});

		describe('#hydrate', function(){

			it.skip('should not alter the file path location', function( done ){

				var bundle = {
					data:{
						file: path.join( __dirname, '..', 'example', 'data.json' )
					}
				};
				bundle.data.file.hapi = {
					filename:'data.json'
				};
				f.hydrate( bundle, function( err, value ){
					value.should.equal( path.join( __dirname, '..', 'example', 'data.json' ) );
					done(err);
				});
			});
		});

		describe('#dehydrate', function(){
			it.skip('should path relative to dir option', function( done ){
				var data = {
					file:path.join( f.options.root, f.options.dir, 'data.json' )
				};

				f.dehydrate( data, function( err, value ){
					value.should.equal( f.options.dir + '/' + 'data.json');
					done( err );
				});
			});
		});
	});

	describe('IntegerField', function(){
		describe('#dehydrate', function(){
			var f;
			before(function(){
				f = new fields.IntegerField({
					name:'num'
					,attribute:'num'
				});
			});

			it.skip('convert strings numbers to number numbers', function(done){
				f.dehydrate({
					num:"1"
				},function( err, value){
					value.should.be.a.Number( );
					value.should.equal( 1 );
					done();
				});
			});

			it.skip('should convert float strings to integers', function(done){
				f.dehydrate({
					num:"1.1"
				},function( err, value){
					value.should.be.a.Number( );
					value.should.equal( 1 );
					done();
				});
			});

			it.skip('should return 0 for non number strings', function( done){
				f.dehydrate({
					num:"foo"
				},function( err, value){
					value.should.be.a.Number( );
					value.should.equal( 0 );
					done();
				});
			});
		});
	});
})


