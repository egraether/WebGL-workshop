/**
	Mesh.js
	----------------------
	class defining how a geometry should be displayed in the scene
*/

var Mesh = function() {

	/**
		geometry used for this mesh
		is eighter CubeGeometry or SphereGeometry
	*/

	this.geometry = CubeGeometry;

	this.position = vec3.zero( vec3.create() );
	this.scale = vec3.assign( vec3.create(), 0.5 );

	this.color = vec3.zero( vec3.create() );

};

Mesh.prototype = {

	draw : function( gl ) {

		/**
			save the actual 'gl.matrix' to prevent changes that would affect other meshes
			defined in 'WebGLUtilities.js'
		*/


		/**
			translate and scale 'gl.matrix' to the specified attributes
			send 'gl.matrix' as modelViewMatrix and the color to the shader
		*/


		/**
			draw the defined geometry
		*/


		/**
			restore 'gl.matrix' and discard the changes
			defined in 'WebGLUtilities.js'
		*/

	},

	setPosition : function( x, y, z ) {

		vec3.assign( this.position, x, y, z );

	},

	setScale : function( x, y, z ) {

		vec3.assign( this.scale, x, y, z );

	},

	setColor : function( r, g, b ) {

		vec3.assign( this.color, r, g, b );

	},

	setGeometry : function( geometry ) {

		this.geometry = geometry;

	}

};