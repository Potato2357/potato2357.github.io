const cursor = document.querySelector(".custom-cursor");
const cursor_image = cursor.querySelector("img");
const particle_layer = document.querySelector(".cursor-particles");

const default_image = "./images/cursor-default.png";
const hover_image = "./images/cursor-hover.png";
const ibeam_image = "./images/cursor-ibeam.png";

let mouseX = 0;
let mouseY = 0;
let last_particle = 0;
let show_particles = true;

document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;

    const now = performance.now();

    if (now - last_particle > 20 && show_particles) {
        create_particle(mouseX, mouseY);
        last_particle = now;
    }
});

function create_particle(x, y) {
    const particle = document.createElement("span");
    particle.className = "particle";

    // color palette
    const colors = [
        "#8ACAE6",
        "#EDABB8",
        "#FFFFFF"
    ];

    const color =
        colors[Math.floor(Math.random() * colors.length)];

    const size = 4 + Math.random() * 6;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    particle.style.setProperty("--particle-color", color);

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    particle.style.setProperty(
        "--drift-x",
        `${(Math.random() - 0.5) * 36}px`
    );

    particle.style.setProperty(
        "--drift-y",
        `${(Math.random() - 0.5) * 36}px`
    );

    particle_layer.appendChild(particle);

    particle.addEventListener("animationend", () => {
        particle.remove();
    });
}

// swap the image when hovering over interactive elements
document.querySelectorAll('a, button, [data-cursor-hover]')
    .forEach((element) => {
        element.addEventListener("mouseenter", () => {
            cursor_image.src = hover_image;
            cursor.classList.add("hover");
            show_particles = false;
        });

        element.addEventListener("mouseleave", () => {
            cursor_image.src = default_image;
            cursor.classList.remove("hover");
            show_particles = true;
        });
    });
document.querySelectorAll('img[onclick]')
    .forEach((element) => {
        element.addEventListener("mouseenter", () => {
            cursor_image.src = hover_image;
            cursor.classList.add("hover");
        });

        element.addEventListener("mouseleave", () => {
            cursor_image.src = default_image;
            cursor.classList.remove("hover");
        });
    });
document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, [data-cursor-text]')
    .forEach((element) => {
        element.addEventListener("mouseenter", () => {
            cursor_image.src = ibeam_image;
            cursor.classList.add("text");
        });

        element.addEventListener("mouseleave", () => {
            cursor_image.src = default_image;
            cursor.classList.remove("text");
        });
    });

// ----------------------------------------------------------------------------

let clicks = 0;

function countClicks() {
    clicks++;
    alert("you clicked the potatos " + clicks + " times");
}