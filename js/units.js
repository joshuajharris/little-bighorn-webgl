var UNIT_APPEARS = 'UNIT_APPEARS',
  UNIT_MOVE_TO = 'UNIT_MOVE_TO',
  UNIT_DOES_NOTHING = 'UNIT_DOES_NOTHING';
  UNIT_DISAPPEARS = 'UNIT_DISAPPEARS';

var UNIT_SIZE = 24;

var units = [];

var frames;

var nativeColor = 0x0002FE;

function initFont(callback) {
  var loader = new THREE.FontLoader();

  var that = this;

  loader.load( 'assets/helvetiker_regular.typeface.json', function ( font ) {
    callback(font);
  });
}

function createFont(name, color) {
  var geometry = new THREE.TextGeometry( name, {
    font: font,
    size: 20,
    height: 5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 3,
    bevelSize: 3,
    bevelSegments: 3 
  });
  var material = new THREE.MeshBasicMaterial( {color: color} );

  var mesh = new THREE.Mesh( geometry, material );
  mesh.name = name;

  return mesh;
}

function addUnit(name, color) {
  var unit = {
    name: name,
    //mesh: createFont(name, color),
    mesh: createUnitMesh(name, color),
  }

  units.push(unit);
}

//function createUnitMesh(color, x, y) {
function createUnitMesh(name, color) {
  var geometry = new THREE.CircleBufferGeometry( UNIT_SIZE, 32 );
  var material = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometry, material );
  plane.name = name;
  
  return plane;

  //units.push( plane );
  //console.log('drew at ' + x + ', ' + y );
}

function parseRow(rawRow) {
  var frames = [];
  var row = rawRow;

  var isAtEnd = false;

  while (!isAtEnd) {
  //for (var i = 0; i < 2; i++) {
    var nextIndex = row.indexOf(';');
    var next = row.substring(0, nextIndex);

    if (next === "#" ) {
      // calvary appears
      row = row.slice(1);
      frames.push(addUnitAppears())
    } else if (nextIndex === 0 && row != ";$") {
      // do nothing
      row = row.slice(1);
      frames.push(addUnitDoesNothing())
    } else if (row === ";$" || row === "$") {
      // calvary dies (disappears)
      row = row.slice(1);
      frames.push(addUnitDisappears())
    } else if (nextIndex === -1) {
      // done parsing
      isAtEnd = true;
    } else {
      // unit moves
      row = row.slice(next.length);
      var coords = next.split(',');
      frames.push(addUnitMoveTo(
        parseInt(coords[0]),
        parseInt(coords[1]))
      );
    }

    row = row.slice(1);
  }

  return frames;
}

function parseRawData(raw) {
  var rawRows = raw.split('\n');
  var frames = [];

  for(var i = 0; i < rawRows.length; i++) {
    var frame = parseRow(rawRows[i]);
    if (frame.length != 0) {
      frames.push(frame);
    }
  }

  return frames;
}

function readTextFile(file, callback) {
  movementData = [];
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function ()
  {
    if(rawFile.readyState === 4)
    {
      if(rawFile.status === 200 || rawFile.status == 0)
      {
        var allText = rawFile.responseText;
        callback(allText);
      }
    }
  }
  rawFile.send(null);
}

function getUnitsData(txtFile, callback) {
  readTextFile(txtFile, function(rawData) {
    frames = parseRawData(rawData);

    console.log({
      rawData: rawData,
      frames: frames
    });

    callback();
  });
}

function createUnits() {
  // CUSTER'S COMMAND
  addUnit('custer', 0xFC26BF)
  addUnit('F', 0xFF0000)
  addUnit('C', 0xFF0000)
  addUnit('E', 0xFF0000)
  addUnit('I', 0xFF0000)
  addUnit('L', 0xFF0000)
  // RENO'S COMMAND
  addUnit('A', 0xEEEEEE)
  addUnit('M', 0xEEEEEE)
  addUnit('G', 0xEEEEEE)
  // BENTEEN'S COMMAND
  addUnit('H', 0xE67E22)
  addUnit('D', 0xE67E22)
  addUnit('K', 0xE67E22)
  addUnit('B', 0xE67E22) // packtrain guard
  addUnit('packtrain', 0x008CDD) // blank cavalry unit
  addUnit('C', 0x3B5998) // crazy horse, oglala warchief
  addUnit('G', 0x7FEAFD) // gall, hunkpapa warchief
  // add 34 blank indian units
  for (var i = 0; i < 34; i++) {
    addUnit(`native unit ${i+1}`, nativeColor);
  }
}

function unitAppears(index) {
  console.log(`Unit ${index} will appeared`);
  //units[index].mesh.position.z = -1000;
}

function unitDisappear(index) {
  console.log(`Unit ${index} disappeared`);
  units[index].mesh.position.z = 1000;
}

function unitMoveTo(index, x, y) {
  console.log(`Unit ${index} moved to ${x}, ${y}`);
  //unitX = units[index].mesh.position.x;
  //unitY = units[index].mesh.position.y;


  //var position = { x : unitX, y: unitY };
  //var target = { x : x, y: y };
  //var tween = new TWEEN.Tween(position)
    //.to(target, 800)
    //.onUpdate(function() {
      //units[index].mesh.position.x = position.x - (1150 / 2);
      //units[index].mesh.position.y = - (position.y - (900 / 2));
    //})
    //.start();

  units[index].mesh.position.set(x - (1150 / 2), - (y - (900 / 2)), -1000);
}

function updateUnits(frameIndex) {
  // execute the selected frame for each unit
  frames.forEach(function(frame, unitIndex) {
    // if a unit has a frame at this "frameIndex"
    if (frame.length > frameIndex) {
      var type = frame[frameIndex].type;
      if (type === UNIT_MOVE_TO) {
        unitMoveTo(unitIndex, frame[frameIndex].x, frame[frameIndex].y);
      } else if (type === UNIT_DISAPPEARS) {
        unitDisappear(unitIndex);
      } else if (type === UNIT_APPEARS) {
        unitAppears(unitIndex);
      }
    }
  });
}

function addUnits(unitsData) {
  //createUnits();

  units.forEach(function(unit) {
    unit.mesh.position.z = 1000;
    scene.add(unit.mesh);
  });
}

function addUnitAppears() {
  return {
    type: UNIT_APPEARS
  }
}

function addUnitDoesNothing() {
  return {
    type: UNIT_DOES_NOTHING
  }
}

function addUnitDisappears() {
  return {
    type: UNIT_DISAPPEARS
  }
}

function addUnitMoveTo(x, y) {
  return {
    type: UNIT_MOVE_TO,
    x: x,
    y: y
  }
}
