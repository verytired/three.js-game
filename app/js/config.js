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
			],
			app_main :[
				'/js/app'
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
		},
		'app_main': {
			deps: ['threejs','orbit_controls','trackball_controls'],
		}
	}
});

// モジュール定義
define(['jquery','threejs','orbit_controls','trackball_controls','app_main'], function (THREE) {
});