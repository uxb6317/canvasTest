mdc.ripple.MDCRipple.attachTo(document.querySelector(".sketch-finish"));
mdc.ripple.MDCRipple.attachTo(document.querySelector(".sketch-clear"));

window.addEventListener("load", () => {
  const sketchContainer = document.getElementById("sketch");
  const board = document.getElementById("board");
  const sketchCanvas = document.querySelector("#sketch-area");
  const sketchCtx = sketchCanvas.getContext("2d");
  const initialLineWidth = 10;
  let sketchProperties = {
    lineWidth: initialLineWidth,
    lineCap: "round",
    painting: false
  };
  let boardProperties = {
    canvasNums: 0,
    perRow: 4,
    canvases: []
  };

  recomputeCanvasDimension(sketchCanvas, sketchContainer);

  // Problems: Sketch gets erased, lineWidth doesn't scale
  function recomputeCanvasDimension(canvasDom, containerDom) {
    /// get computed style for container
    const cs = getComputedStyle(containerDom);

    /// these will return dimensions in pixel
    const width = parseInt(cs.getPropertyValue("width"), 10);
    const height = parseInt(cs.getPropertyValue("height"), 10);

    canvasDom.width = width;
    canvasDom.height = height;
  }

  // changes canvas size based on window size
  window.addEventListener("resize", () =>
    recomputeCanvasDimension(sketchCanvas, sketchContainer)
  );

  function draw(coords, properties) {
    if (!properties.painting) return;
    sketchCtx.lineWidth = properties.lineWidth;
    sketchCtx.lineCap = properties.lineCap;
    sketchCtx.lineTo(coords.x, coords.y);
    sketchCtx.stroke();
    sketchCtx.beginPath();
    sketchCtx.moveTo(coords.x, coords.y);
  }

  sketchCanvas.addEventListener("mousedown", e => {
    sketchProperties.painting = true;
    const inputCoords = {
      x: e.clientX,
      y: e.clientY
    };
    draw(inputCoords, sketchProperties);
  });

  sketchCanvas.addEventListener("mouseup", () => {
    sketchProperties.painting = false;
    sketchCtx.beginPath();
  });

  sketchCanvas.addEventListener("mousemove", e => {
    const inputCoords = {
      x: e.clientX,
      y: e.clientY
    };
    draw(inputCoords, sketchProperties);
  });

  const sketchColors = document.querySelectorAll(".color");
  sketchColors.forEach(color => {
    const cssValues = getComputedStyle(color);
    color.addEventListener("click", () => {
      sketchCtx.strokeStyle = cssValues.backgroundColor;
      sketchProperties.lineWidth = initialLineWidth;
    });
  });

  const clearBtn = document.querySelector(".sketch-clear");
  clearBtn.addEventListener("click", () => clearCanvas(sketchCanvas));

  function clearCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  const eraserBtn = document.querySelector(".sketch-eraser");
  eraserBtn.addEventListener("click", () => {
    sketchCtx.strokeStyle = "#fff";
    sketchProperties.lineWidth = sketchProperties.lineWidth * 2;
  });

  const finishBtn = document.querySelector(".sketch-finish");

  finishBtn.addEventListener("click", () => {
    const newCanvas = duplicateCanvas(sketchCanvas);
    // boardProperties.canvasNums += 1;
    // document.querySelector("#board").appendChild(newCanvas);
    // sketchProperties.painting = false;
    const draggableCanvas = interact(newCanvas);
    const position = { x: 0, y: 0 };
    draggableCanvas.draggable({
      listeners: {
        start(event) {
          // console.log(event.type, event.target);
          newCanvas.id = "draggingCanvas";
          newCanvas.style.width = "300px";
          newCanvas.style.height = "150px";
        },
        move(event) {
          position.x += event.dx;
          position.y += event.dy;

          event.target.style.transform = `translate(${position.x}px, ${
            position.y
          }px)`;
        },
        end(event) {
          sketchContainer.removeChild(newCanvas);
        }
      }
    });
  });

  interact(board)
    .dropzone({
      ondrop: function(event) {
        if (!event.draggable.target.classList.contains("boarded")) {
          const newCanvas = duplicateCanvas(sketchCanvas);
          newCanvas.style.position = "relative";
          boardProperties.canvasNums += 1;
          document.querySelector("#board").appendChild(newCanvas);
          newCanvas.style.width = "300px";
          newCanvas.style.height = "150px";
          boardProperties.canvases.push(newCanvas);
          // clear main canvas
          clearCanvas(sketchCanvas);
        }
      }
    })
    .on("dropactivate", function(event) {
      event.target.classList.add("drop-activated");
    });

  function duplicateCanvas(canvasToDupe) {
    const tempCanvas = document.createElement("canvas");
    const newContext = tempCanvas.getContext("2d");

    tempCanvas.style.backgroundColor = "#fff";
    tempCanvas.style.border = "1px solid black";
    tempCanvas.style.position = "absolute";
    tempCanvas.width = canvasToDupe.width;
    tempCanvas.height = canvasToDupe.height;

    newContext.drawImage(
      canvasToDupe,
      0,
      0,
      tempCanvas.width,
      tempCanvas.height
    );

    // remove canvas following cursor
    const draggableCanvas = interact(tempCanvas);
    const position = { x: 0, y: 0 };

    draggableCanvas.draggable({
      listeners: {
        start(event) {
          tempCanvas.classList.add("boarded");
        },
        move(event) {
          position.x += event.dx;
          position.y += event.dy;

          event.target.style.transform = `translate(${position.x}px, ${
            position.y
          }px)`;
        }
      }
    });

    // adds a dupe canvas on top of the old sketch canvas
    sketchContainer.prepend(tempCanvas);

    return tempCanvas;
  }
});
