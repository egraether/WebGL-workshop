/**
	WebGLUtilities.js
	----------------------
	utility functions for the WebGLRenderingContext:
		- shader loading
		- matrix stack
		- texture loading
*/

var WebGLUtilities = {

	loadShaderScript : function( shaderScriptID ) {

		var gl = this,
			shaderScript = document.getElementById( shaderScriptID ),
			shader;

		if ( shaderScript.type === "x-shader/x-fragment" ) {

			shader = gl.createShader( gl.FRAGMENT_SHADER );

		} else if ( shaderScript.type === "x-shader/x-vertex" ) {

			shader = gl.createShader( gl.VERTEX_SHADER );

		} else {

			return null;

		}


		gl.shaderSource( shader, shaderScript.text );
		gl.compileShader( shader );

		if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {

			console.log( "shader " + gl.getShaderInfoLog( shader ) );
			return null;

		}

		return shader;

	},

	linkShaderProgramm : function( vertexShader, fragmentShader ) {

		var gl = this,
			shaderProgram = gl.createProgram();

		gl.attachShader( shaderProgram, vertexShader );
		gl.attachShader( shaderProgram, fragmentShader );

		gl.linkProgram( shaderProgram );


		if ( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) ) {

			console.log( "Unable to initialize the shader program." );

		}

		return shaderProgram;

	},

	loadShader : function( vertexShaderID, fragmentShaderID ) {

		var gl = this,
			vertexShader = gl.loadShaderScript( vertexShaderID ),
			fragmentShader = gl.loadShaderScript( fragmentShaderID );

		return gl.linkShaderProgramm( vertexShader, fragmentShader );

	},


	textureCount : 0,

	loadTexture : function( imagePath, callback ) {

		var gl = this,
			texture = gl.createTexture();

		texture.ID = gl.textureCount++;

		texture.image = new Image();

		texture.image.onload = function () {

			gl.textureImageLoaded( texture );

			if ( callback ) {

				callback( gl, texture );

			}

		}

		texture.image.src = imagePath;

		return texture;

	},

	textureImageLoaded : function( texture ) {

		var gl = this;

		gl.activeTexture( gl["TEXTURE" + texture.ID] );
		gl.bindTexture( gl.TEXTURE_2D, texture );

		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image );

		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );

		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );

		gl.generateMipmap( gl.TEXTURE_2D );

		gl.bindTexture( gl.TEXTURE_2D, null );

	},

	passTexture : function( texture, textureUniform ) {

		var gl = this;

		gl.activeTexture( gl["TEXTURE" + texture.ID] );
		gl.bindTexture( gl.TEXTURE_2D, texture );
		gl.uniform1i( textureUniform, texture.ID );

	},


	matrixStack : [],
	stackPosition : 0,
	matrix : mat4.identity( mat4.create() ),

	pushMatrix : function() {

		var pos = this.stackPosition,
			stack = this.matrixStack,
			matrix = this.matrix;

		if ( pos < stack.length ) {

			mat4.set( matrix, stack[pos] );

		} else {

			stack.push( mat4.create( matrix ) );

		}

		this.stackPosition++;

	},

	popMatrix : function() {

		var pos = --this.stackPosition,
			stack = this.matrixStack;

		if ( !stack.length ) {

			throw "error: popMatrix failed";

		}

		mat4.set( stack[pos], this.matrix );

	},

	passMatrix : function( uniform, matrix ) {

		this.uniformMatrix4fv( uniform, false, matrix || this.matrix );

	},


	enableAlpha : function() {

		var gl = this;

		gl.enable( gl.BLEND );
		gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

	},

	disableAlpha : function() {

		var gl = this;

		gl.disable( gl.BLEND );

	}

};
