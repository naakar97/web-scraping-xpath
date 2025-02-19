document.getElementById("scraping-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const url = document.getElementById("url").value;
    const xpath = document.getElementById("xpath").value;

    // Limpiar resultados anteriores
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "Cargando...";

    try {
        const response = await fetch(url);
        const htmlText = await response.text();

        // Crear un DOM temporal para aplicar el XPath
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");

        // Aplicar XPath
        const nodes = [];
        const iterator = document.evaluate(xpath, doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        let node = iterator.iterateNext();
        
        while (node) {
            nodes.push(node.textContent || node.innerHTML);
            node = iterator.iterateNext();
        }

        if (nodes.length > 0) {
            resultsContainer.innerHTML = `<ul>${nodes.map(item => `<li>${item}</li>`).join('')}</ul>`;
        } else {
            resultsContainer.innerHTML = "<p>No se encontraron resultados.</p>";
        }
    } catch (error) {
        resultsContainer.innerHTML = "<p>Error al realizar el scraping. Verifica la URL y el XPath.</p>";
        console.error(error);
    }
});
