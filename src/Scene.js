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


		/**
			initialize the shader
		*/


		/**
			create the projectionMatrix and pass it to the shader
			does not change - only needs to get passed once
		*/


		/**
			define the light settings
		*/


		/**
			define the meshes
		*/


	},

	draw : function( gl ) {

		/**
			update the position of the canvas if mouse events were triggered
		*/

		TrackballCamera.update();


		/**
			create the viewMatrix from the camera and save it to 'gl'
		*/


		/**
			draw all meshes
		*/

		for ( var i = 0; i < this.meshes.length; i++ ) {

			this.meshes[i].draw( gl );

		}

	}

};
