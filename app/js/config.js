// RequireJSの設定
require.config({
		paths : {
			jquery : [
				'/bower_components/jquery/dist/jquery.min'
			],
			threejs : [
				'/bower_components/threejs/build/three.min'
			],
			orbit_controls :[
				'/bower_components/threejs/examples/js/controls/OrbitControls'
			],
			trackball_controls :[
				'/bower_components/threejs/examples/js/controls/TrackballControls'
			]
		},
	shim: {
		'orbit_controls': {
			deps: ['threejs'],
			exports: 'THREE'
		},
		'trackball_controls': {
			deps: ['threejs'],
			exports: 'THREE'
		}
	}
});

// モジュール定義
define(['jquery','threejs','orbit_controls','trackball_controls'	], function (THREE) {
});