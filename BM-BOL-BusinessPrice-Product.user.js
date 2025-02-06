// ==UserScript==
// @name         BM Bol Business Produktseite
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Fügt oberhalb des Divs mit dem Bild "Nach Shop filtern" ein h2-Element ein, das den um 12 % reduzierten bol.de-Preis (Shop 439) anzeigt. Wird der Preis gefunden und enthält er den Zusatz "[Code]", wird "BOL Business: Code" ausgegeben. Wird der Shop nicht gefunden, erscheint "BOL Business: Nicht verfügbar".
// @updateURL    https://raw.githubusercontent.com/Flyor/BM-BOL-BusinessPrice-Product/new/main/BM-BOL-BusinessPrice-Product.user.js
// @downloadURL  https://raw.githubusercontent.com/Flyor/BM-BOL-BusinessPrice-Product/new/main/BM-BOL-BusinessPrice-Product.user.js
// @match        https://www.brickmerge.de/*
// @grant        none
// ==/UserScript==

window.addEventListener("load", function() {
    console.log("Window load event triggered.");
    setTimeout(function() {
        // Suche das Referenzelement anhand des Bildes "Nach Shop filtern"
        var refImg = document.querySelector('div.medium-1.small-3.columns.text-center img[alt="Nach Shop filtern"]');
        if (!refImg) {
            console.error("Referenzelement (Bild 'Nach Shop filtern') nicht gefunden.");
            return;
        }
        var refDiv = refImg.parentNode;
        console.log("Referenz-Div gefunden:", refDiv);

        // Suche nach dem bol.de-Preis (Shop 439)
        var bolElem = document.querySelector('[data-mid="439"] .price');
        var newText = "";
        if (bolElem) {
            console.log("bol.de Preis-Element gefunden:", bolElem);
            var priceText = bolElem.textContent;
            // Falls der Zusatz "[Code]" enthalten ist:
            if (priceText.includes("[Code]")) {
                console.log("Zusatz '[Code]' gefunden im Preistext.");
                newText = "BOL Business: Code";
            } else {
                // Versuche, den Preis als Zahl zu extrahieren (z. B. "532,39")
                var matchPrice = priceText.match(/(\d+,\d+)/);
                if (matchPrice) {
                    var priceStr = matchPrice[1];
                    var priceNum = parseFloat(priceStr.replace(',', '.'));
                    var discounted = priceNum * 0.88; // 12 % Rabatt: 88 % des Originalpreises
                    var discountedStr = discounted.toFixed(2).replace('.', ',');
                    newText = "BOL Business: " + discountedStr + " €";

                    // Suche den UVP in einem <p>-Element, das "UVP:" enthält.
                    var uvpParagraph = Array.from(document.getElementsByTagName("p"))
                        .find(p => p.textContent.includes("UVP:"));
                    if (uvpParagraph) {
                        console.log("UVP-Paragraf gefunden:", uvpParagraph);
                        var matchUvp = uvpParagraph.textContent.match(/UVP:\s*([\d,]+)\s*€/);
                        if (matchUvp) {
                            var uvpStr = matchUvp[1];
                            var uvpNum = parseFloat(uvpStr.replace(',', '.'));
                            if (uvpNum > 0) {
                                var discountPercent = Math.round((1 - (discounted / uvpNum)) * 100);
                                newText += " / " + discountPercent + "% Rabatt";
                            }
                        } else {
                            console.warn("Kein UVP-Preis im UVP-Paragraph gefunden.");
                        }
                    } else {
                        console.warn("UVP-Paragraph nicht gefunden.");
                    }
                } else {
                    newText = "BOL Business: Nicht verfügbar";
                }
            }
        } else {
            newText = "BOL Business: Nicht verfügbar";
        }
        console.log("Neuer Text:", newText);

        // Erstelle ein neues h2-Element zur Anzeige (mit auffälligen Styles)
        var newH2 = document.createElement("h2");
        newH2.textContent = newText;
        newH2.style.color = "red";
        newH2.style.backgroundColor = "yellow";
        newH2.style.border = "2px solid blue";
        newH2.style.marginBottom = "10px";
        console.log("Neues h2-Element:", newH2);

        // Füge das neue h2-Element unmittelbar vor dem Referenz-Div ein
        refDiv.parentNode.insertBefore(newH2, refDiv);
        console.log("Neues Element eingefügt.");
    }, 2000);
});
