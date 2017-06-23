var plane;

//function getHeightData(img, scale) {
//}

function addTerrain(imgSrc) {
  var texture = new THREE.TextureLoader().load( imgSrc );
  var geometry = new THREE.PlaneBufferGeometry( 1150, 900, 32 );
  var material = new THREE.MeshBasicMaterial( {map: texture, color: 0xffff00, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometry, material );
  plane.name = "terrain";

  plane.position.set(0, 0, -1500);
  scene.add( plane );
}
