﻿/**
 * @author jbouny
 */

var DEMO =
{
	ms_Renderer : null,
	ms_Camera : null,
	ms_Scene : null,
	ms_Controls : null,
	ms_Ocean : null,

	Initialize : function () {

		this.ms_Renderer = new THREE.WebGLRenderer();
		this.ms_Renderer.context.getExtension( 'OES_texture_float' );
		this.ms_Renderer.context.getExtension( 'OES_texture_float_linear' );
		this.ms_Renderer.setClearColor( 0xbbbbbb );
    
    this.ms_Clock = new THREE.Clock();

		document.body.appendChild( this.ms_Renderer.domElement );

		this.ms_Scene = new THREE.Scene();

		this.ms_Camera = new THREE.PerspectiveCamera( 55.0, WINDOW.ms_Width / WINDOW.ms_Height, 0.5, 1000000 );
		this.ms_Camera.position.set( 500, 1100, 2200 );
		this.ms_Camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
		this.ms_Scene.add( this.ms_Camera );

		// Initialize Orbit control
		this.ms_Controls = new THREE.OrbitControls( this.ms_Camera, this.ms_Renderer.domElement );
		this.ms_Controls.userPan = false;
		this.ms_Controls.target.set( 0, 0, 0 );
		this.ms_Controls.noKeys = true;
		this.ms_Controls.userPanSpeed = 0;
		this.ms_Controls.minDistance = 0;
		this.ms_Controls.maxDistance = 200000.0;
		this.ms_Controls.minPolarAngle = 0;
		this.ms_Controls.maxPolarAngle = Math.PI * 0.75;
    
    this.ms_Animate = false;
    this.ms_Update = true;
    this.ms_Wireframe = true;

		this.InitializeScene();

		this.InitGui();
    
	},

	InitializeScene : function InitializeScene() {

		// Add light
		this.ms_MainDirectionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
		this.ms_MainDirectionalLight.position.set( -0.2, 0.5, 1 );
		this.ms_Scene.add( this.ms_MainDirectionalLight );
    
    // Add axis helper
    var axis = new THREE.AxisHelper(1000);
    this.ms_Scene.add( axis );
    
    // Add some color boxes
    for ( var i = -2; i <= 2; ++ i ) {
      for ( var j = -2; j <= 2; ++ j ) {
        for ( var k = 0-2; k <= 2; ++ k ) {
          var geometry = new THREE.BoxGeometry( 100, 100, 100 );
          var material = new THREE.MeshLambertMaterial( { fog: true, side: THREE.DoubleSide, color: new THREE.Color( 0.5 + i * 0.2, 0.5 + j * 0.2, 0.5 + k * 0.2 ) } );
          var mesh = new THREE.Mesh( geometry, material );
          mesh.position.set( i * 300, j * 300, k * 300 );
          this.ms_Scene.add( mesh );
        }
      }
    }

		// Initialize Ocean
		this.ms_GeometryResolution = 128;
		this.ms_Ocean = new THREE.Ocean( this.ms_Renderer, this.ms_Camera, this.ms_Scene,
		{
			GEOMETRY_RESOLUTION: this.ms_GeometryResolution
		} );
    this.ChangeWireframe();
    this.ChangeAnimateMaterial();
	},

	InitGui : function InitGui() {

		// Initialize UI
		var gui = new dat.GUI();
    
		gui.add( DEMO, 'ms_Wireframe' ).name( 'Wireframe' ).onChange( function() { DEMO.ChangeWireframe(); } );
		gui.add( DEMO, 'ms_Animate' ).name( 'Animate' ).onChange( function() { DEMO.ChangeAnimateMaterial(); } );
		gui.add( DEMO, 'ms_Update' ).name( 'Update' );
    gui.add( DEMO, 'ms_GeometryResolution', 8, 512 ).name( 'Resolution' ).onChange( function() { DEMO.ChangePlaneMesh(); } );

	},
  
  ChangeWireframe : function ChangeWireframe() {
  
    this.ms_Ocean.oceanMesh.material.wireframe = this.ms_Wireframe;
  
  },
  
  ChangeAnimateMaterial : function ChangeAnimateMaterial() {
  
    this.ms_Ocean.oceanMesh.material.uniforms.u_animate.value = this.ms_Animate;
  
  },
  
  ChangePlaneMesh : function ChangePlaneMesh() {
  
    var resolution = Math.round( this.ms_GeometryResolution );
    if ( resolution >= 1 && resolution !== this.ms_LastGeometryResolution ) {
    
      this.ms_LastGeometryResolution = resolution;
      var geometry = new THREE.PlaneBufferGeometry( 1, 1, resolution, resolution );
      this.ms_Camera.remove( this.ms_Ocean.oceanMesh );
      this.ms_Ocean.oceanMesh.geometry = geometry;
      this.ms_Camera.add( this.ms_Ocean.oceanMesh );
      
    }
    
  },

	Display : function () {

		this.ms_Renderer.render( this.ms_Scene, this.ms_Camera );

	},

	Update : function () {

    if( this.ms_Update ) {
      this.ms_Ocean.oceanMesh.material.uniforms.u_time.value += this.ms_Clock.getDelta();
    }
    
		this.ms_Controls.update();
		this.Display();

	},

	Resize : function ( inWidth, inHeight ) {

		this.ms_Camera.aspect = inWidth / inHeight;
		this.ms_Camera.updateProjectionMatrix();
		this.ms_Renderer.setSize( inWidth, inHeight );
		this.Display();

	}
};
