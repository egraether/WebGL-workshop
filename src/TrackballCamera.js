/**
	TrackballCamera.js
	----------------------
	provides eye, center and up vectors for building a view matrix
	listens to mouse events and lets you roam around the scene:
		- left mouse drag = rotate
		- right mouse drag = pan
		- scroll = zoom
*/

var TrackballCamera = {

	eye : vec3.create(),
	center : vec3.create(),

	up : vec3.create(),
	right : vec3.create(),

	mouse : vec3.create(),
	oldMouse : vec3.create(),

	state : "up",
	button : 0,

	timeoutID : null,

	isRotating : false,
	isPanning : false,
	zoomDelta : 1,

	radius : 0,

	start : vec3.create(),
	end : vec3.create(),

	vector : vec3.create(),
	matrix : mat4.create(),

	init : function() {

		vec3.assign( this.eye, 10, 0, 0 );

		vec3.assign( this.up, 0, 0, 1 );
		vec3.assign( this.right, 0, 1, 0 );

		vec3.zero( this.center );

		this.radius = ( canvas.width + canvas.height ) / 4;

		canvas.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
		canvas.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
		canvas.addEventListener( 'mouseup', bind( this, this.onMouseUp ), false );

		canvas.addEventListener( 'contextmenu', function( event ) { event.preventDefault(); }, false );
		canvas.onselectstart = function() { return false; };

		document.addEventListener( "DOMMouseScroll", bind( this, this.onScroll ), false );
		document.addEventListener( "mousewheel", bind( this, this.onScroll ), false );

		vec3.zero( this.oldMouse );
		vec3.zero( this.mouse );

		this.isRotating = true;

	},

	update : function() {

		if ( this.isRotating ) {

			this.rotate();
			return true;

		} else if ( this.zoomDelta !== 1 ) {

			this.zoom();
			return true;

		} else if ( this.isPanning ) {

			this.pan();
			return true;

		}

		return false;

	},

	getEye : function() {

		return vec3.add( this.center, this.eye, this.vector );

	},

	getCenter : function() {

		return this.center;

	},

	getUp : function() {

		return this.up;

	},

	getMouseOnScreen : function( mouse, vector ) {

		return vec3.assign(
			vector,
			( mouse[0] - canvas.width * 0.5 ) / this.radius,
			( canvas.height * 0.5 - mouse[1] ) / this.radius,
			0.0
		);

	},

	getMouseOnBall : function( mouse, projection ) {

		var mouseOnBall = this.getMouseOnScreen( mouse, this.vector ),
			len = vec3.length( mouseOnBall );

		if ( len > 1.0 ) {

			vec3.normalize( mouseOnBall );

		} else {

			mouseOnBall[2] = Math.sqrt( 1.0 - len * len );

		}

		vec3.scale( vec3.normalize( this.eye, projection ), mouseOnBall[2] );

		vec3.add( projection, vec3.scale( this.right, mouseOnBall[0], vec3.create() ) );
		vec3.add( projection, vec3.scale( this.up, mouseOnBall[1], vec3.create() ) );

		return projection;

	},

	rotate : function() {

		this.getMouseOnBall( this.mouse, this.end );

		var angle = vec3.angle( this.start, this.end ),
			axis;

		if ( angle ) {

			axis = vec3.cross( this.end, this.start, this.vector );

			mat4.identity( this.matrix );
			mat4.rotate( this.matrix, angle, axis );

			mat4.multiplyVec3( this.matrix, this.eye );
			mat4.multiplyVec3( this.matrix, this.up );
			mat4.multiplyVec3( this.matrix, this.right );

			mat4.multiplyVec3( this.matrix, this.end );
			vec3.set( this.end, this.start );

		}

		this.isRotating = false;

	},

	pan : function() {

		var pan = vec3.create(),
			panFactor = 0.3;

		this.getMouseOnScreen( this.mouse, this.end );
		vec3.subtract( this.start, this.end, this.vector );

		if ( vec3.lengthSquared( this.vector ) ) {

			vec3.scale( this.vector, vec3.length( this.eye ) * panFactor );

			vec3.scale( this.right, this.vector[0], pan );
			vec3.add( pan, vec3.scale( this.up, this.vector[1], this.vector ) );

			vec3.add( this.center, pan );

			vec3.set( this.end, this.start );

		}

		this.isPanning = false;

	},

	zoom : function() {

		var len = vec3.length( this.eye );

		vec3.scale( vec3.normalize( this.eye ), len * this.zoomDelta );

		len = vec3.lengthSquared( this.eye );

		if ( len > 10000 ) {

			vec3.scale( vec3.normalize( this.eye ), 100 );

		} else if ( len < 0.09 ) {

			vec3.scale( vec3.normalize( this.eye ), 0.3 );

		}

		this.zoomDelta = 1;

	},

	getMouse : function( event, mouse ) {

		mouse[0] = event.clientX;
		mouse[1] = event.clientY;

		return mouse;

	},

	onMouseDown : function( event ) {

		var oldMouse = this.getMouse( event, this.oldMouse );

		this.state = "down";
		this.button = event.button;

		if ( this.button === 0 ) {

			this.getMouseOnBall( oldMouse, this.start );

		} else if ( this.button === 2 ) {

			this.getMouseOnScreen( oldMouse, this.start );

		}

		this.timeoutID = setTimeout( bind( this, this.onClickTimeout ), 250 );

		event.stopPropagation();

	},

	onMouseUp : function( event ) {

		if ( this.state === "down" ) {

			this.onClick( event );
			clearTimeout( this.timeoutID );

		}

		this.state = "up";

		event.stopPropagation();

	},

	onMouseMove : function( event ) {

		var mouse = this.getMouse( event, this.mouse ),
			len;

		if ( this.state === "down" ) {

			len = vec3.lengthSquared( vec3.subtract( mouse, this.oldMouse, vec3.create() ) );

			if ( len > 60 ) {

				this.state = "drag";
				clearTimeout( this.timeoutID );

			}

		}

		if ( this.state === "drag" ) {

			if ( this.button === 0 ) {

				this.isRotating = true;

			} else if ( this.button === 2 ) {

				this.isPanning = true;

			}

		}

		event.stopPropagation();

	},

	onClick : function( ) {

		

	},

	onClickTimeout : function() {

		if ( this.state === "down" ) {

			this.state = "drag";

		}

	},

	onScroll : function( event ) {

		var delta = event.wheelDelta || ( event.detail * -5 );

		this.isZooming = true;

		this.zoomDelta *= 1 - delta * 0.0002;

		event.preventDefault();
		event.stopPropagation();

	}

};
