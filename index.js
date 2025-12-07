const input = document.querySelector("input#image")
const canva = document.querySelector("#canva")
const btn = document.querySelector("#btn")
const ctx = canva.getContext("2d");
const legends = document.querySelector("#legend")

async function displayImage() {
    if (input.value) {
        const file = input.files[0];

        const texte = (await file.text()).split("\n");
        const dimensions = texte.at(2);
        const [width, height] = dimensions.split(" ").map(number => parseInt(number))

        console.log("Largeur : ", width);
        console.log("Hauteur : ", height);

        let pixels = Array.from(await file.bytes())
        for (let i = 0; i < 4; i++) {
            pixels = pixels.slice(pixels.indexOf(10) + 1, pixels.length - 1);
        }
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const r = pixels.shift();
                const g = pixels.shift();
                const b = pixels.shift();
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillRect(x, y, 1, 1);
            }
        }

        legends.textContent = `width=${width} height=${height}`;
    }
}

btn.addEventListener("click", displayImage)
