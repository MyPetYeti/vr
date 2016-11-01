var scene, camera, renderer;
var geometry, material, mesh;
var keys = [], mouse = [], drag = [];
var matrix = new THREE.Matrix4();

var env = [], player = [], npc = [];

var config = {
	npcs_hostile : 5,
	npcs_neutral : 5,
	npcs_fearful : 5
};

init();
animate();

function init_events() {

	window.addEventListener( 'resize', function( event ) {
		renderer.setSize( window.innerWidth, window.innerHeight );
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	}, false );

	window.addEventListener( 'contextmenu', function( event ) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	} );

	window.addEventListener( 'mousedown', function( event ) { 
		event.preventDefault();
		event.stopPropagation();
		return false;
	} );

	window.addEventListener( 'mousemove', function( event ) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	} );

	window.addEventListener( 'mouseup', function( event ) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	} );

	window.addEventListener( 'keydown', function( event ) {
		event.preventDefault();
		event.stopPropagation();
		keys[ event.keyCode ] = true;
		return false;
	} );

	window.addEventListener( 'keyup', function( event ) {
		event.preventDefault();
		event.stopPropagation();
		keys[ event.keyCode ] = false;
		return false;
	} );

}

function init_environment() {

	geometry = new THREE.PlaneGeometry( 512, 512, 32, 32 );
	material = new THREE.MeshBasicMaterial( { color: 0x333333, wireframe: true } );
	env[ env.length ] = new THREE.Mesh( geometry, material );
	env[ env.length - 1 ].rotation.set( ( 90 * Math.PI / 180 ), 0, 0 );
	scene.add( env[ env.length - 1 ] );

}

function init_player() {

	geometry = new THREE.BoxGeometry( 32, 32, 32 );
	material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );
	player[ player.length ] = new THREE.Mesh( geometry, material );
	player[ player.length - 1 ].position.set( 0, 16, 0 );
	scene.add( player[ player.length - 1 ] );

}

function init_npcs() {

	var loop_length;

	// Hostile
	loop_length = 0;
	for( i = loop_length; i < loop_length + config.npcs_hostile; i ++ ) {
		geometry = new THREE.BoxGeometry( 32, 32, 32 );
		material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
		npc[ i ] = new THREE.Mesh( geometry, material );
		npc[ i ].position.set( random_inc( -256, 256 ), 16, random_inc( -256, 256 ) );
		npc[ i ].npc_type = 'hostile';
		scene.add( npc[ i ] );
	}

	// Neutral
	loop_length = npc.length;
	for( i = loop_length; i < loop_length + config.npcs_neutral; i ++ ) {
		geometry = new THREE.BoxGeometry( 32, 32, 32 );
		material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true } );
		npc[ i ] = new THREE.Mesh( geometry, material );
		npc[ i ].position.set( random_inc( -256, 256 ), 16, random_inc( -256, 256 ) );
		npc[ i ].npc_type = 'neutral';
		scene.add( npc[ i ] );
	}

	// Fearful
	loop_length = npc.length;
	for( i = loop_length; i < loop_length + config.npcs_fearful; i ++ ) {
		geometry = new THREE.BoxGeometry( 32, 32, 32 );
		material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
		npc[ i ] = new THREE.Mesh( geometry, material );
		npc[ i ].position.set( random_inc( -256, 256 ), 16, random_inc( -256, 256 ) );
		npc[ i ].npc_type = 'fearful';
		scene.add( npc[ i ] );
	}

}

function init() {

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 128, -256 );
	renderer = new THREE.WebGLRenderer( { antialias: true, logarithmicDepthBuffer: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	init_events();
	init_environment();
	init_npcs();
	init_player();

}

function animate() {

	// W Key
	if( keys[ 87 ] == true ) {
		player[ 0 ].translateZ( 1 );
	}

	// A Key
	if( keys[ 65 ] == true  ) {
		player[ 0 ].rotation.y += 1 * Math.PI / 180;
	}

	// S Key
	if( keys[ 83 ] == true  ) {
		player[ 0 ].translateZ( -1 );
	}

	// D Key
	if( keys[ 68 ] == true  ) {
		player[ 0 ].rotation.y -= 1 * Math.PI / 180;
	}

	// Follow Player
	camera.lookAt( player[ 0 ].position );
	for( i = 0; i < npc.length; i ++ ) {

		npc[ i ].lookAt( player[ 0 ].position );

		if( npc[ i ].npc_type == 'hostile' ) {
			if( npc[ i ].position.distanceTo( player[ 0 ].position ) < 128 ) {
				if( npc[ i ].position.distanceTo( player[ 0 ].position ) > 32 ) {
					npc[ i ].translateZ( 0.25 );
				}
			}
		}

		if( npc[ i ].npc_type == 'fearful' ) {
			if( npc[ i ].position.distanceTo( player[ 0 ].position ) < 128 ) {
				npc[ i ].translateZ( -0.25 );
			}
		}

	}

	requestAnimationFrame( animate );
	renderer.render( scene, camera );

}

function random_inc( min, max ) {

	min = Math.ceil( min );
	max = Math.floor( max );
	return Math.floor( Math.random() * ( max - min + 1 ) ) + min;

}