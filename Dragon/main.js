console.clear();
import { Environment, useTexture } from "@react-three/drei";
import * as CANNON from "cannon-es";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.127.0/examples/jsm/controls/OrbitControls.js";
import { GUI } from "https://cdn.jsdelivr.net/npm/three@0.127.0/examples/jsm/libs/dat.gui.module.js";
import Stats from 'three/examples/jsm/libs/stats.module';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 3600);
camera.position.set(0, 50, 200);

let renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(innerWidth, innerHeight);

document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

var velocity = new THREE.Vector3();

let light = new THREE.PointLight();
scene.add(light, new THREE.AmbientLight(0xffffff, 1));

const loader = new THREE.TextureLoader();
const bgTexture = loader.load("andro.jpg");
scene.background = bgTexture;

// var geom = new THREE.BoxGeometry(10, 10, 10);
// var mat = new THREE.MeshBasicMaterial({color: "green"});
// var cube = new THREE.Mesh(geom, mat);
// cube.position.set(100, 350, 100);

// scene.add(cube);

// var geom1 = new THREE.BoxGeometry(300, 0, 300);
// var mat1 = new THREE.MeshBasicMaterial({color: "red"});
// var cube1 = new THREE.Mesh(geom1, mat1);
// cube1.position.set(100, 350, 100);
// scene.add(cube1);

let world, floorBody, floor;
const normalMaterial = new THREE.MeshNormalMaterial();
const phongMaterial = new THREE.MeshPhongMaterial();

initCannon();

function initCannon() {
  world = new CANNON.World();
  world.gravity.set(0, -9, 0);
  // world.broadphase = new CANNON.NaiveBroadphase();
  // world.solver.iterations = 10;
  // world.broadphase.useBoundingBoxes = true;
}

// var geometry = new THREE.PlaneGeometry( 300, 300 );
// var material = new THREE.MeshPhongMaterial( { color: 0x677776 } );
// floor = new THREE.Mesh( geometry, material );
// floor.rotation.x = -Math.PI / 2;
// scene.add( floor );

const planeGeometry = new THREE.PlaneGeometry(3500, 25);
const planeMesh = new THREE.Mesh(planeGeometry, phongMaterial);
planeMesh.rotateX(-Math.PI / 2);
planeMesh.receiveShadow = true;
scene.add(planeMesh);
const planeShape = new CANNON.Plane();
const planeBody = new CANNON.Body({ mass: 0 });
planeBody.addShape(planeShape);
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
planeMesh.position.set( 0, -5, 0 );
world.addBody(planeBody);

const cubeGeometry = new THREE.BoxGeometry(3, 10 , 3);
const cubeMesh = new THREE.Mesh(cubeGeometry, normalMaterial);
cubeMesh.castShadow = true;
scene.add(cubeMesh);
const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const cubeBody = new CANNON.Body({ mass: 1 });
cubeBody.addShape(cubeShape);
cubeBody.position.x = cubeMesh.position.x;
cubeBody.position.y = cubeMesh.position.y;
cubeBody.position.z = cubeMesh.position.z;
world.addBody(cubeBody);
cubeMesh.add( camera );   

for (let i=0; i<50; i++){
const cubeGeometry1 = new THREE.BoxGeometry(3, 10 , 3);
const cubeMesh1 = new THREE.Mesh(cubeGeometry1, normalMaterial);
cubeMesh1.castShadow = true;
cubeMesh1.position.x = 50*Math.random()+i*30;
scene.add(cubeMesh1);
}

const stats = new Stats();
document.body.appendChild(stats.dom);

//cubeMesh.add( camera );
 
document.addEventListener("keydown", onDocumentKeyDown, false);
let cnt=0, flag=true;
function onDocumentKeyDown(event) {

    var keyCode = event.which;
    if (keyCode == 32 && flag==  true) {  
       cubeBody.velocity.y += 30 ; 
       console.log(cnt);
       console.log(cubeBody.velocity.y);
       cnt++;
       if(cnt>=2) {
        flag= false;
        cnt=0;
       }
      
    } 
    if(cubeBody.position.y<0.6 ){
        flag = true;
       }
   // render();
    stats.update();
};

// animate();

//const clock = new THREE.Clock();
let delta;



function animate(){
 
 // delta = Math.min(clock.getDelta(), 0.1);
  world.step(0.05);
  cubeMesh.position.set(cubeBody.position.x, cubeBody.position.y, cubeBody.position.z);
  cubeMesh.quaternion.set(cubeBody.quaternion.x, cubeBody.quaternion.y, cubeBody.quaternion.z, cubeBody.quaternion.w);
  //render();
  cubeBody.position .x += 0.3    ;  
  stats.update();  
}

function render(){ 
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

renderer.setAnimationLoop((_) => {
  console.log(cubeBody.position.y);
  renderer.render(scene, camera);
  animate();
});
