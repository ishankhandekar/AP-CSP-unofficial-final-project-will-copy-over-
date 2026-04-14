const audio = document.getElementById("ambient");
audio.volume = 0.08;

function enableAudio() {
  audio.play().catch(() => {});
  window.removeEventListener("click", enableAudio);
}

// MUST be click (not mousemove, not load)
window.addEventListener("click", enableAudio);



const orb = document.querySelector(".orb");

let energy = 0;
let lastX = 0;
let lastY = 0;

let locked = false;

function updateFill() {
  orb.style.setProperty("--fill", energy + "%");
}

// hover turbulence input
orb.addEventListener("mousemove", (e) => {
  if (locked) return;

  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;

  const speed = Math.sqrt(dx * dx + dy * dy);

  const fillFactor = energy / 100;

// harder at start, easier later

const sensitivity = 0.2 + fillFactor * 1;

energy += speed * 0.05 * sensitivity;

  // clamp just below full so we control the snap
  if (energy >= 98) {
    snapToFull();
    return;
  }

  energy = Math.min(98, energy);

  lastX = e.clientX;
  lastY = e.clientY;

  updateFill();
});

// 🧲 SNAP + LOCK
function snapToFull() {
  energy = 100;
  updateFill();

  locked = true;

  orb.classList.add("full");

  // optional “click” feel re-trigger (visual pop)
  orb.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.05)" },
      { transform: "scale(1)" }
    ],
    {
      duration: 250,
      easing: "ease-out"
    }
  );
}

// slow decay only if NOT locked
function decay() {
  if (!locked) {
    energy *= 0.99;
    if (energy < 0.05) energy = 0;
        updateFill();
    }

  requestAnimationFrame(decay);
}

decay();