var plane;

function addTerrain(imgSrc) {
  //addTerrainOld(imgSrc);
  addTerrainNew(imgSrc);
}

function addTerrainOld(imgSrc) {
  var texture = new THREE.TextureLoader().load( imgSrc );
  var geometry = new THREE.PlaneBufferGeometry( 1150, 900, 32 );
  var material = new THREE.MeshBasicMaterial( {map: texture, color: 0xffff00, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometry, material );
  plane.name = "terrain";

  plane.position.set(0, 0, -1500);
  scene.add( plane );
}

function addTerrainNew(imgSrc) {
  // terrain
  new THREE.ImageLoader().load( imgSrc, function(img) {
    //get height data from img
    var data = getHeightData(img);

    // plane
    var geometry = new THREE.PlaneGeometry( 1150, 900, 5, 5 );
    var texture = new THREE.TextureLoader().load( imgSrc );
    var material = new THREE.MeshLambertMaterial( { map: texture } );
    var plane = new THREE.Mesh( geometry, material );

    //set height of vertices
    for ( var i = 0; i< plane.geometry.vertices.length; i++ ) {
       plane.geometry.vertices[i].z = data[i];
    }

    plane.name = "terrain";

    plane.position.set(0, 0, -1500);

    scene.add(plane);
    console.log(plane);
  
  });
}

//return array with height data from img
function getHeightData(img, scale) {

 if (scale == undefined) scale=1;

    var canvas = document.createElement( 'canvas' );
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext( '2d' );

    var size = img.width * img.height;
    var data = new Float32Array( size );

    context.drawImage(img,0,0);

    for ( var i = 0; i < size; i ++ ) {
        data[i] = 0
    }

    var imgd = context.getImageData(0, 0, img.width, img.height);
    var pix = imgd.data;

    var j=0;
    for (var i = 0; i<pix.length; i +=4) {
        var all = pix[i]+pix[i+1]+pix[i+2];
        data[j++] = all/(12*scale);
    }

    return data;
}
