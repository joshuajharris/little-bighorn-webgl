var UNIT_APPEARS = 'UNIT_APPEARS',
  UNIT_MOVE_TO = 'UNIT_MOVE_TO',
  UNIT_DOES_NOTHING = 'UNIT_DOES_NOTHING';
  UNIT_DISAPPEARS = 'UNIT_DISAPPEARS';

var UNIT_SIZE = 24;

var units = [];

var frames;

function createUnit(color, x, y) {
  var geometry = new THREE.CircleBufferGeometry( UNIT_SIZE, 32 );
  var material = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometry, material );

  plane.position.set(x, y, -1000);
  units.push( plane );
  console.log('drew at ' + x + ', ' + y );
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
    } else if (nextIndex === 0) {
      // do nothing
      row = row.slice(1);
      frames.push(addUnitDoesNothing())
    } else if (next === "$" ) {
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
  });
}

function createUnits() {
  createUnit(0xFF0000);
  // CUSTER'S COMMAND
  // addUnit(custer)
  // addUnit(F)
  // addUnit(C)
  // addUnit(E)
  // addUnit(I)
  // addUnit(L)
  // RENO'S COMMAND
  // addUnit(A)
  // addUnit(M)
  // addUnit(G)
  // BENTEEN'S COMMAND
  // addUnit(H)
  // addUnit(D)
  // addUnit(K)
  // addUnit(B) // packtrain guard
  // addUnit(packtrain) // blank cavalry unit
  // addUnit(C) // crazy horse, oglala warchief
  // addUnit(G) // gall, hunkpapa warchief
  // add 34 blank indian units
}

function addUnits(unitsData) {
  //createUnits();

  units.forEach(function(unit) {
    scene.add(unit);
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
