const input = document.querySelector("input#image")
const legends = document.querySelector("#legend")
const canva = document.querySelector("#canva")
const ctx = canva.getContext("2d");


/**
 * Read the bytes of the file give to the function.
 * @param {File}file File to read.
 * @returns {Promise<Array[number]>} The bytes of the file.
 */
async function readBytes(file) {
    return await new Promise((resolve, _) => {
        const reader = new FileReader();
        let fileByteArray = [];

        reader.readAsArrayBuffer(file);
        reader.onloadend = async (evt) => {
            if (evt.target.readyState === FileReader.DONE) {
                const arrayBuffer = evt.target.result,
                    array = new Uint8Array(arrayBuffer);
                for (const a of array) {
                    fileByteArray.push(a);
                }
            }

            resolve(fileByteArray)
        }
    })
}

/**
 * Display the image of the file given in the parameters.
 * @param {File}imageFile Image to display.
 * @returns {Promise<void>}
 */
async function displayImage(imageFile) {
    // Redeem the text to collect the metadatas of the image.
    const texte = (await imageFile.text()).split("\n");

    // Collect the dimensions.
    const dimensions = texte.at(2);
    const [width, height] = dimensions.split(" ").map(number => parseInt(number));

    console.log("Width : ", width);
    console.log("Height : ", height);

    // Read the bytes.
    let fileBytes = await readBytes(imageFile);

    for (let i = 0; i < 4; i++) {
        // Remove metadatas from bytes.
        // To only let images bytes.
        fileBytes = fileBytes.slice(fileBytes.indexOf(10) + 1, fileBytes.length - 1);
    }
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Draw all the pixels.
            const r = fileBytes.shift();
            const g = fileBytes.shift();
            const b = fileBytes.shift();
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }

    legends.textContent = `width=${width} height=${height}`;
}


input.addEventListener("change", async (evt) => {
    if (input.value) {
        const file = evt.target.files[0];
        await displayImage(file)
    }
});
