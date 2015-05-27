// RequireJSの設定
require.config({
		paths : {
			jquery : [
				'../bower_components/jquery/dist/jquery.min'
			],
			threejs : [
				'../bower_components/threejs/build/three.min'
			],
			orbit_controls :[
				'../bower_components/threejs/examples/js/controls/OrbitControls'
			],
			trackball_controls :[
				'../bower_components/threejs/examples/js/controls/TrackballControls'
			],
			improved_noise :[
				'../bower_components/threejs/examples/js/ImprovedNoise'
			],
			stats :[
				'../bower_components/threejs/examples/js/libs/stats.min'
			],
			app_main :[
				'app'
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
		'improved_noise': {
			deps: ['threejs'],
			exports: 'THREE'
		},
		'app_main': {
			deps: ['threejs','orbit_controls','trackball_controls','improved_noise'],
		}
	}
});

// モジュール定義
define(['jquery','threejs','orbit_controls','trackball_controls','stats','improved_noise','app_main'], function (THREE) {
});