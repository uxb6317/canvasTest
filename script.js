mdc.ripple.MDCRipple.attachTo(document.querySelector(".sketch-finish"));
mdc.ripple.MDCRipple.attachTo(document.querySelector(".sketch-clear"));

window.addEventListener("load", () => {
  const canvas = document.querySelector("#sketch-area");
  const ctx = canvas.getContext("2d");

  let painting = false;
  function startPosition(e) {
    painting = true;
    draw(e);
  }

  function finishedPosition() {
    painting = false;
    ctx.beginPath();
  }

  function draw(e) {
    if (!painting) return;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  }

  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", finishedPosition);
  canvas.addEventListener("mousemove", draw);

  const sketchColors = document.querySelectorAll(".color");
  sketchColors.forEach(color => {
    const cssValues = getComputedStyle(color);
    color.addEventListener("click", () => {
      console.log(cssValues.backgroundColor);
      ctx.strokeStyle = cssValues.backgroundColor;
    });
  });

  const clearBtn = document.querySelector(".sketch-clear");
  clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  const eraserBtn = document.querySelector(".sketch-eraser");
  eraserBtn.addEventListener("click", () => {
    ctx.strokeStyle = "#ffd664";
  });

  const finishBtn = document.querySelector(".sketch-finish");
  let canvasNums = 0;

  finishBtn.addEventListener("click", e => {
    const newCanvas = document.createElement("canvas");
    const newContext = newCanvas.getContext("2d");

    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    newCanvas.style.backgroundColor = "#ffd664";
    newCanvas.style.position = "absolute";
    newCanvas.style.display = "inline-block";
    newCanvas.style.transform = "scale(" + 0.25 + "," + 0.25 + ")";
    if (canvasNums !== 0 && canvasNums % 3 === 0) {
      newCanvas.style.top = -150 + (canvasNums / 3) * 150 + "px";
    }
    newCanvas.style.left = -200 + canvasNums * 200 + "px";
    newContext.drawImage(canvas, 0, 0);
    canvasNums += 1;
    document.querySelector("#board").appendChild(newCanvas);
  });
});
