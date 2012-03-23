/**
	main.js
	----------------------
	sets up WebGL
	initializes and runs the demo
*/

/**
	globals:
	- canvas = <canvas> DOM-element
	- gl = WebGLRenderingContext
*/

var canvas,
	gl;


/**
	main:
	- called in 'index.html' after everything was loaded
	- checks if WebGL works or shows an error
	- initializes and runs the demo
*/

function main() {

	canvas = document.getElementById( "canvas" );

	if ( !! window.WebGLRenderingContext ) {

		/**
			set the global 'gl' with the WebGLRenderingContext of the 'canvas'
		*/

		gl = canvas.getContext( "experimental-webgl" );

	}

	if ( gl ) {

		init();
		run();

	} else {

		document.getElementById( "error" ).style.display = 'block';
		return;

	}

};


/**
	init:
	- does basic WebGL setup
	- initializes the Scene
*/

function init() {

	/**
		set the resolution of the canvas to it's actual display size
		on default it is 300 x 150
	*/

	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;


	/**
		define in which area of the canvas shall be rendered
	*/

	gl.viewport( 0, 0, canvas.width, canvas.height );


	/**
		define in which color the canvas appears after 'gl.clear( gl.COLOR_BUFFER_BIT )'
	*/

	gl.clearColor( 0, 0, 0, 1.0 );


	/**
		enable face culling
		makes only faces with vertices displayed in counter-clockwise order appear
	*/

	gl.enable( gl.CULL_FACE );


	/**
		enable writing to the depth buffer
		makes it unnecessary to draw the objects from the furthest to the nearest
	*/

	gl.enable( gl.DEPTH_TEST );


	/**
		extend the WebGLRenderingContext with attributes and methods defined in 'WebGLUtilities.js'
	*/

	extend( gl, WebGLUtilities );


	/**
		initialize the scene
	*/

	Scene.init( gl );

};


/**
	run:
	- calls itself every time the browser is ready for rendering a frame
	- draws the Scene
*/

function run() {

	/**
		tell the browser to call the function 'run' whenever it is ready to re-render the 'canvas'
		this assures that the demo runs at a good framerate
		and is only called when the browser-tap of the demo is in focus
	*/

	requestAnimationFrame( run, canvas );


	/**
		render the scene
	*/

	Scene.draw( gl );

};


