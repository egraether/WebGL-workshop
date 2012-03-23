/**
	Shader.js
	----------------------
	creates the WebGL shader program
	provides the interface for sending values to the GPU
*/

var Shader = {

	shaderProgram : null,

	init : function( gl ) {

		/**
			create a shader program using the two shader scripts defined in 'index.html'
		*/

		var shaderProgram = gl.loadShader( "vertex-shader-script", "fragment-shader-script" );


		/**
			use this program for buffer binds, uniform variables and draw calls that follow
		*/

		gl.useProgram( shaderProgram );


		/**
			save the interfaces to uniform variables in the Shader object
		*/

		this.projectionMatrixUniform = gl.getUniformLocation( shaderProgram, "uProjectionMatrix" );
		this.modelViewMatrixUniform = gl.getUniformLocation( shaderProgram, "uModelViewMatrix" );

		this.colorUniform = gl.getUniformLocation( shaderProgram, "uColor" );

		this.ambientLightColorUniform = gl.getUniformLocation( shaderProgram, "uAmbientLightColor" );
		this.directionalLightColorUniform = gl.getUniformLocation( shaderProgram, "uDirectionalLightColor" );

		this.directionalLightDirectionUniform = gl.getUniformLocation( shaderProgram, "uDirectionalLightDirection" );


		/**
			save the interfaces to attribute variables in the Shader object
			and enable them for sending data
		*/

		this.vertexAttribute = gl.getAttribLocation( shaderProgram, "aVertex" );
		gl.enableVertexAttribArray( this.vertexAttribute );

		this.normalAttribute = gl.getAttribLocation( shaderProgram, "aNormal" );
		gl.enableVertexAttribArray( this.normalAttribute );


		/**
			save the shader program for later use
		*/

		this.shaderProgram = shaderProgram;

	}

};