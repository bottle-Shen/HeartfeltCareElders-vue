<script setup lang="ts">
import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const renderer = new THREE.WebGLRenderer();
const renderer = new THREE.WebGLRenderer( { antialias: true,alpha:true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}

animate();


const listener = new THREE.AudioListener();
camera.add( listener );

// 创建一个全局 audio 源
const sound = new THREE.Audio(listener);

// 加载一个 sound 并将其设置为 Audio 对象的缓冲区
const audioLoader = new THREE.AudioLoader();

const audioPath = new URL('@/assets/sounds/新宝島.mp3', import.meta.url).href;
audioLoader.load(audioPath,
    function (buffer) {
    
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
    },
        undefined, // 进度回调（可选）
    function (error) {
        console.error('音频加载失败:', error);
    });

</script>
<template>
  <div>
  </div>
</template>
<style scoped lang="scss">

</style>