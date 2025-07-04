function boardinit() {
  const canvasElement = $('canvas');
  const canvas = new Canvas(canvasElement);

  const params1 = State.decode(window.location.search.substr(1));
  const params2 = State.decode(location.hash.substring(1));

  const follow = params1['follow'] || params2['follow'];
  const lead = params1['lead'] || params2['lead'];

  if (follow) {
    const receiver = new FirebaseReceiver(follow);
    installCanvasReceiver(receiver, canvas);
  }

  if (lead) {
    const sender = new FirebaseSender(lead);
    installCanvasSender(sender, canvas);
  }

  if (follow || lead) {
    propagateSync(follow, lead);
  }

  for (const color of ['red', 'green', 'blue', 'orange']) {
    const node = $(color);
    node.addEventListener('click', makeColorHandler(node, canvas, color));
  }

  $('del').addEventListener('click', canvas.deleteLastCurve.bind(canvas));

  $('add').addEventListener('click', canvas.addScreen.bind(canvas));
  addScreenButton(canvas, 0, true);

  canvas.receive(makeScreenSelectAction(canvas));
  canvas.setShown(true);

  console.log('board init done');
}

function makeColorHandler(node, canvas, color) {
  return function() {
    if (canvas.getColor() == color) {
      return;
    }

    const previousNode = $(canvas.getColor());
    domRemoveClass(previousNode, 'select');
    domAddClass(node, 'select');

    canvas.setColor(color);
  };
}

function addScreenButton(canvas, newScreen, select) {
  const div = document.createElement('div');
  div.className = 'screen';
  div.id = `screen-${newScreen}`;

  $('screenpicker').appendChild(div);
  div.addEventListener('click', makeScreenSelectHandler(div, canvas, newScreen));

  if (select) {
    domAddClass(div, 'select');
  }
}

function makeScreenSelectHandler(node, canvas, screen) {
  return function() {
    if (canvas.getScreen() == screen) {
      return;
    }

    canvas.setScreen(screen);
  };
}

function makeScreenSelectAction(canvas) {
  return function(data) {
    if (data.op != 'screen') {
      return;
    }

    for (let node = $('screenpicker').firstChild; node; node = node.nextSibling) {
      if (node.nodeType == Node.ELEMENT_NODE) {
        domRemoveClass(node, 'select');
      }
    }

    const selectedId = `screen-${data.screen}`;
    const selectedNode = $(selectedId);
    if (selectedNode) {
      console.info('select', selectedId);
      domAddClass(selectedNode, 'select');
    } else {
      console.info('create', selectedId);
      addScreenButton(canvas, data.screen, true);
    }
  };
}
