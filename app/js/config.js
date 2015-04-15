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
			]
		},
	shim: {
		'orbit_controls': {
			deps: ['threejs'],
			exports: 'THREE'
		}
	}
});

// モジュール定義
define(['jquery','threejs','orbit_controls'], function (THREE) {
});