// RENDERER CONSTS
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
// CAMERA CONSTS
const FOV = 45;
const ASPECT_RATIO = WIDTH / HEIGHT;

var renderer, scene, camera;

//var controls;

var myCanvas = document.getElementById('stage');

var actions;

/* ######### INIT ######### */

function init() {

  initScene();

  // Add Lights
  initLights();

  // Add world
  addTerrain('assets/lb.jpg');

  // Add Objects
  addObjects();

  // Add OrbitControls so that we can pan around with the mouse.
  //controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Create GUI
  initGUI();

  // Initialize Animations
  actions = []

  window.addEventListener('resize', resize, false);
}

/* ######### SCENE ######### */
function initScene() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(FOV , ASPECT_RATIO , 0.1, 20000);
  camera.position.set(0,0,0);
  scene.add(camera);

  //camera.rotation.x -= Math.PI / 6;

  renderer = new THREE.WebGLRenderer({
    canvas: myCanvas,
    antialias: true
  });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0x333F47);
}

/* ######### LIGHTS ######### */
function initLights() {
  // lights
  var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  var pointLight = new THREE.PointLight(0xffffff, 0.5);
  scene.add(pointLight);
}

/* ######### OBJECTS ######### */
function addObjects() {
  // Unit Data
  getUnitsData('assets/movement.data', addUnits);
}

/* ######### WINDOW EVENTS ######### */
function resize() {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

/* ######### ANIMATE ######### */
function animate() {
  requestAnimationFrame(animate);

  //controls.update();

  // Render the scene.
  renderer.render(scene, camera);
}

function pause() {
  console.log("I'm Pausing");
}

var FizzyText = function() {
  this.pause = function() { pause(); };
  this.frame = 0;

  this.play = function() {
    console.log("I'm Playing");

    var frame = this.frame;
    console.log(frame);

    // print the selected frame for each unit
    frames.forEach(function(unit) {
      if (unit[frame].type === UNIT_MOVE_TO) {
        createUnit(0xFF0000, unit[frame].x - (1150 / 2), unit[frame].y - (900 / 2));
      }
    });

    addUnits();
  };
};


function initGUI() {
  var text = new FizzyText();
  var gui = new dat.GUI();
  gui.add(text, 'play');
  gui.add(text, 'pause');
  gui.add(text, 'frame', 0, 32).step(1);
}

// WEBGL CHECK
if ( ! Detector.webgl ) {
  Detector.addGetWebGLMessage();
  document.getElementById( 'webgl-container' ).innerHTML = "";
} else {
  // RUN PROGRAM
  init();
  animate();
}
