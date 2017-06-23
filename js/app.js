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

var clock = THREE.Clock();

var isPlay = false;

var currFrame = 1;

var font;

var gui;

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
  //gridHelper();

  // Create GUI
  initGUI();

  window.addEventListener('resize', resize, false);
}

function gridHelper() {
  var size = 100;
  var divisions = 10;

  var gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}

/* ######### SCENE ######### */
function initScene() {
  scene = new THREE.Scene();

  //camera = new THREE.PerspectiveCamera(FOV , ASPECT_RATIO , 0.1, 20000);
  camera = new THREE.OrthographicCamera( WIDTH / - 2, WIDTH / 2, HEIGHT / 2, HEIGHT / - 2, 0.1, 20000 );
  camera.position.set(0,0,0);
  camera.name = "camera";
  scene.add(camera);

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
  ambientLight.name = "ambientLight";
  scene.add(ambientLight);

  var pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.name = "pointLight";
  scene.add(pointLight);
}

/* ######### OBJECTS ######### */
function addObjects() {
  //var that = this;
  // Unit Data
  //initFont(function(font) {
    //that.font = font;
    //console.log({font: that.font});
    createUnits();
    addUnits();
    getUnitsData('assets/movement.data', function() {
      updateUnits(0);
    });

    console.log({units: units});
  //});
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
  setTimeout( function() {
    if (isPlay && currFrame < 31) {
      TWEEN.update();
      console.log(`currFrame: ${currFrame}`);

      console.log(`frame: ${currFrame}`);

      updateUnits(currFrame);

      if (currFrame == 31) {
        isPlay = false;
      } else {
        currFrame++;
      }
      setFrameSlider();
    }

    requestAnimationFrame( animate );
    }, 1000 / 2 );

  //controls.update();

  // Render the scene.
  renderer.render(scene, camera);
}

var FizzyText = function() {
  this.frame = 0;

  this.play = function() {
    console.log("I'm Playing");
    currFrame = this.frame;

    if (currFrame === 31) {
      currFrame = 0;
    }
    isPlay = true;
  };

  this.pause= function() {
    console.log("I'm Pausing");
    isPlay = false;
  };
};

function initGUI() {
  var text = new FizzyText();
  gui = new dat.GUI();
  gui.add(text, 'play');
  gui.add(text, 'pause');
  var sliderController = gui.add(text, 'frame', 0, 32).step(1);

  sliderController.onFinishChange(function(value) {
  // Fires when a controller loses focus.
    console.log("frame: " + value);
    updateUnits(value);
});
}

function setFrameSlider() {
  for(var i = 0; i<gui.__controllers.length;i++) {
    if( !gui.__controllers.property === 'frame' ) {
      gui.__controllers[i].setValue(currFrame);
    }
  }
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
