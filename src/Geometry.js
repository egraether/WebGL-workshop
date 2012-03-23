/**
	Geometry.js
	----------------------
	defines an interface for geometries used in the Scene
	defines CubeGeometry and SphereGeometry
*/


/**
	Geometry:
	- basic interface for initializing WebGL buffers with vertex data
	- make subclass and define vertices, normals and indices
*/

var Geometry = function() {};

Geometry.prototype = {

	/**
		geometry data in arrays
	*/

	vertices : [],
	normals : [],
	indices : [],


	/**
		WebGL buffers for data per vertex
	*/

	vertexBuffer : null,
	normalBuffer : null,


	/**
		WebGL buffer for draw order of vertices
	*/

	indexBuffer : null,


	/**
		count of indices, used when drawing
	*/

	indexCount : 0,


	/**
		init:
		- creates the buffers and fills them with data
	*/

	init : function( gl ) {

		this.vertexBuffer = gl.createBuffer();

		gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.vertices ), gl.STATIC_DRAW );

		this.normalBuffer = gl.createBuffer();

		gl.bindBuffer( gl.ARRAY_BUFFER, this.normalBuffer);
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this.normals ), gl.STATIC_DRAW );


		this.indexBuffer = gl.createBuffer();

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( this.indices ), gl.STREAM_DRAW );

		this.indexCount = this.indices.length;

	},


	/**
		draw:
		- sends the vertex data to the shader
		- makes the draw call
	*/

	draw : function( gl ) {

		gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
		gl.vertexAttribPointer( Shader.vertexAttribute, 3, gl.FLOAT, false, 0, 0 );

		gl.bindBuffer( gl.ARRAY_BUFFER, this.normalBuffer );
		gl.vertexAttribPointer( Shader.normalAttribute, 3, gl.FLOAT, false, 0, 0 );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer );
		gl.drawElements( gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0 );

	}

};


/**
	CubeGeometry:
	- subclass of Geometry
	- provides data used for a cube
*/

var CubeGeometry = new Geometry();

extend( CubeGeometry, {

	vertices : [

		// front
		1,  1,  1,
		1, -1,  1,
		1, -1, -1,
		1,  1, -1,

		// right
		 1, 1,  1,
		 1, 1, -1,
		-1, 1, -1,
		-1, 1,  1,

		// top
		 1,  1, 1,
		-1,  1, 1,
		-1, -1, 1,
		 1, -1, 1,

		// back
		-1,  1,  1,
		-1,  1, -1,
		-1, -1, -1,
		-1, -1,  1,

		// left
		 1, -1,  1,
		-1, -1,  1,
		-1, -1, -1,
		 1, -1, -1,

		// bottom
		 1,  1, -1,
		 1, -1, -1,
		-1, -1, -1,
		-1,  1, -1

	],

	normals : [

		// front
		1, 0, 0,
		1, 0, 0,
		1, 0, 0,
		1, 0, 0,

		// right
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,

		// top
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,

		// back
		-1, 0, 0,
		-1, 0, 0,
		-1, 0, 0,
		-1, 0, 0,

		// left
		0, -1, 0,
		0, -1, 0,
		0, -1, 0,
		0, -1, 0,

		// bottom
		0, 0, -1,
		0, 0, -1,
		0, 0, -1,
		0, 0, -1

	],

	indices : [

		// front
		0, 1, 2, 0, 2, 3,

		// right
		4, 5, 6, 4, 6, 7,

		// top
		8, 9, 10, 8, 10, 11,

		// back
		12, 13, 14, 12, 14, 15,

		// left
		16, 17, 18, 16, 18, 19,

		// bottom
		20, 21, 22, 20, 22, 23

	]

});


var SphereGeometry = new Geometry();

extend( SphereGeometry, {

	// http://learningwebgl.com/cookbook/index.php/How_to_draw_a_sphere
	init : function( gl, slices, stacks ) {

		this.vertices = [],
		this.normals = [],
		this.indices = [];

		for ( var stack = 0; stack <= stacks; stack++ ) {

			var theta = stack * Math.PI / stacks,
				sinTheta = Math.sin( theta ),
				cosTheta = Math.cos( theta );

			for ( var slice = 0; slice <= slices; slice++ ) {

				var phi = slice * 2 * Math.PI / slices,
					sinPhi = Math.sin( phi ),
					cosPhi = Math.cos( phi );

				var x = cosPhi * sinTheta,
					y = cosTheta,
					z = sinPhi * sinTheta;

				this.vertices.push( x, y, z );
				this.normals.push( x, y, z );

				if ( stack < stacks && slice < slices ) {

					var first = ( stack * ( slices + 1 ) ) + slice,
						second = first + slices + 1;

					this.indices.push( first, first + 1, second, second + 1, second, first + 1 );

				}

			}

		}

		Geometry.prototype.init.call( this, gl );

	}

});