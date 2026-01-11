const canvas = document.getElementById("mascot");
const ctx = canvas.getContext("2d");
const box = document.getElementById("mascot-box");

const img = new Image();
img.src = "img/character.png";

let state = 0;
// 0 = idle
// 1 = hover
// 2 = click

let frameHeight, frameWidth;

img.onload = () => {
  frameWidth = img.width;
  frameHeight = img.height / 3;

  canvas.width = frameWidth;
  canvas.height = frameHeight;

  drawFrame(0);
};

function drawFrame(index) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img,
    0, frameHeight * index,
    frameWidth, frameHeight,
    0, 0,
    frameWidth, frameHeight
  );
}

/* Hover */
canvas.addEventListener("mouseenter", () => {
  if (state !== 2) {
    state = 1;
    drawFrame(1);
  }
});

canvas.addEventListener("mouseleave", () => {
  if (state !== 2) {
    state = 0;
    drawFrame(0);
  }
});

/* Click → frame 3 + scroll top */
canvas.addEventListener("click", () => {
  state = 2;
  drawFrame(2);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  setTimeout(() => {
    state = 0;
    drawFrame(0);
  }, 600);
});

/* Scroll logic: gần đáy → hiện */
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  if (scrollY > maxScroll * 0.5) {
    box.classList.add("show");   // lồi ra
  } else {
    box.classList.remove("show"); // thụt vào
  }
});
