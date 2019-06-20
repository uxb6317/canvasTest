mdc.ripple.MDCRipple.attachTo(document.querySelector(".sketch-finish"));
mdc.ripple.MDCRipple.attachTo(document.querySelector(".sketch-clear"));

window.addEventListener("load", () => {
  const sketchContainer = document.getElementById("sketch");
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
    perRow: 4
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
  clearBtn.addEventListener("click", () => {
    sketchCtx.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);
  });

  const eraserBtn = document.querySelector(".sketch-eraser");
  eraserBtn.addEventListener("click", () => {
    sketchCtx.strokeStyle = "#fff";
    sketchProperties.lineWidth = sketchProperties.lineWidth * 2;
  });

  const finishBtn = document.querySelector(".sketch-finish");

  finishBtn.addEventListener("click", () => {
    const newCanvas = duplicateCanvas(sketchCanvas);

    // positioning
    // newCanvas.style.left = boardProperties.canvasNums * newCanvas.width + "px";
    // if (
    //   boardProperties.canvasNums !== 0 &&
    //   boardProperties.canvasNums % 4 === 0
    // ) {
    //   newCanvas.style.top =
    //     Math.floor(boardProperties.canvasNums / 4) * newCanvas.height + "px";
    // }

    boardProperties.canvasNums += 1;
    document.querySelector("#board").appendChild(newCanvas);
  });

  function duplicateCanvas(canvasToDupe) {
    const newCanvas = document.createElement("canvas");
    const newContext = newCanvas.getContext("2d");

    newCanvas.style.backgroundColor = "#fff";
    // newCanvas.style.position = "absolute";
    newCanvas.style.border = "1px solid black";
    // newCanvas.className += "board-sketch";
    // newCanvas.setAttribute("draggable", true);
    // newCanvas.addEventListener("dragstart", e => {
    //   e.target.style.opacity = 0.1;
    // });

    newContext.drawImage(canvasToDupe, 0, 0, newCanvas.width, newCanvas.height);
    return newCanvas;
  }
});
