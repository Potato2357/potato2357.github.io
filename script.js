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

// ----------------------------------------------------------------------------
// Cursor mode detection

const hoverSelector = 'a, button, [data-cursor-hover], img[onclick]';
const textSelector = 'p, h1, h2, h3, h4, h5, h6, span, [data-cursor-text]';

function getTextRangeAtPoint(x, y) {

    if (document.caretPositionFromPoint) {
        const position = document.caretPositionFromPoint(x, y);

        if (position) {
            const range = document.createRange();
            range.setStart(position.offsetNode, position.offset);
            range.collapse(true);
            return range;
        }
    }

    // fallback
    if (document.caretRangeFromPoint) {
        return document.caretRangeFromPoint(x, y);
    }

    return null;
}

function isOverText(x, y) {
    const range = getTextRangeAtPoint(x, y);

    if (!range || range.startContainer.nodeType !== Node.TEXT_NODE) {
        return false;
    }

    const node = range.startContainer;
    const text = node.textContent;
    const offset = range.startOffset;

    if (!text || !text.trim()) return false;

    // change as needed
    const tolerance = 5;

    const start = Math.max(0, offset - 1);
    const end = Math.min(text.length, offset + 2);

    for (let i = start; i < end; i++) {
        if (/\s/.test(text[i])) continue;

        const charRange = document.createRange();
        charRange.setStart(node, i);
        charRange.setEnd(node, i + 1);

        for (const rect of charRange.getClientRects()) {
            const nearX = Math.max(rect.left, Math.min(x, rect.right));
            const nearY = Math.max(rect.top, Math.min(y, rect.bottom));

            const distance = Math.hypot(x - nearX, y - nearY);

            if (distance <= tolerance) {
                return true;
            }
        }
    }

    return false;
}

function isHoverTarget(target) {
    return target instanceof Element && !!target.closest(hoverSelector);
}

function isTextTarget(target) {
    return target instanceof Element && !!target.closest(textSelector);
}

let cursorMode = 'default';

function setCursorMode(mode) {
    if (cursorMode === mode) return;
    cursorMode = mode;

    cursor.classList.toggle('hover', mode === 'hover');
    cursor.classList.toggle('text', mode === 'text');

    if (mode === 'hover') {
        cursor_image.src = hover_image;
        show_particles = false;
    } else if (mode === 'text') {
        cursor_image.src = ibeam_image;
        show_particles = true;
    } else {
        cursor_image.src = default_image;
        show_particles = true;
    }
}

document.addEventListener('mousemove', (event) => {
    const target = document.elementFromPoint(
        event.clientX,
        event.clientY
    );

    if (isHoverTarget(target)) {
        setCursorMode('hover');
        return;
    }

    if (
        isTextTarget(target) &&
        isOverText(event.clientX, event.clientY)
    ) {
        setCursorMode('text');
        return;
    }

    setCursorMode('default');
});

// ----------------------------------------------------------------------------

let clicks = 0;

function countClicks() {
    clicks++;
    alert("you clicked the potatos " + clicks + " times");
}