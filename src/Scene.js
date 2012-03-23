/**
	Scene.js
	----------------------
	sets up camera, geometries, shader and all the meshes in the scene
	updates the camera and draws the meshes
*/

var Scene = {

	meshes : [],

	init : function( gl ) {

		/**
			initialize the TrackballCamera
			this camera listens to mouse events and lets you roam around the scene
		*/

		TrackballCamera.init();


		/**
			initialize the geometries
			the buffers only need to be set up once and can be used for multiple meshes
		*/

		CubeGeometry.init( gl );
		SphereGeometry.init( gl, 100, 50 );


		/**
			initialize the shader
		*/

		Shader.init( gl );


		/**
			create the projectionMatrix and pass it to the shader
			does not change - only needs to get passed once
		*/

		var projectionMatrix = mat4.perspective( 45, canvas.width / canvas.height, 0.1, 1000 );

		gl.uniformMatrix4fv( Shader.projectionMatrixUniform, false, projectionMatrix );


		/**
			define the light settings
		*/

		gl.uniform3f( Shader.ambientLightColorUniform, 1.0, 1.0, 1.0 );

		gl.uniform3f( Shader.directionalLightColorUniform, 1.0, 1.0, 1.0 );
		gl.uniform3f( Shader.directionalLightDirectionUniform, 0.4, 0.3, 0.5 );


		/**
			define the meshes
		*/

		var redCube = new Mesh();

		redCube.setPosition( 0.5, 0.5, -1 );
		redCube.setColor( 0.5, 0.1, 0.1 );
		redCube.setScale( 3, 2, 1 );
		redCube.setGeometry( CubeGeometry );

		this.meshes.push( redCube );


		var yellowCube = new Mesh();

		yellowCube.setGeometry( CubeGeometry );

		yellowCube.setPosition( -3, 2, 0 );
		yellowCube.setColor( 0.5, 0.5, 0.1 );
		yellowCube.setScale( 1, 1, 3 );

		this.meshes.push( yellowCube );


		var greenSphere = new Mesh();

		greenSphere.setPosition( 0, -3, 0 );
		greenSphere.setColor( 0.1, 0.5, 0.1 );
		greenSphere.setScale( 2, 2, 2 );
		greenSphere.setGeometry( SphereGeometry );

		this.meshes.push( greenSphere );


		var blueSphere = new Mesh();

		blueSphere.setPosition( 1, 2, 3 );
		blueSphere.setColor( 0.1, 0.1, 0.5 );
		blueSphere.setScale( 1, 1.5, 1.5 );
		blueSphere.setGeometry( SphereGeometry );

		this.meshes.push( blueSphere );

	},

	draw : function( gl ) {

		/**
			update the position of the canvas if mouse events were triggered
		*/

		if ( TrackballCamera.update() ) {

			/**
				clear the color of the canvas to the defined 'gl.clearColor()'
				and clear the depth buffer
			*/

			gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );


			/**
				create the viewMatrix from the camera and save it to 'gl'
			*/

			gl.matrix = mat4.lookAt(
				TrackballCamera.getEye(),
				TrackballCamera.getCenter(),
				TrackballCamera.getUp()
			);


			/**
				draw all meshes
			*/

			for ( var i = 0; i < this.meshes.length; i++ ) {

				this.meshes[i].draw( gl );

			}

		}

	}

};
