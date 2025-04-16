// ==UserScript==
// @name         BM Bol Business + ST auf Produktseite
// @namespace    https://brickmerge.de/
// @version      2.0.0
// @description  Anzeige BOL BusinessPrice und ST Preis auf BM Produktseite
// @updateURL    https://github.com/Flyor/BM-BOL-BusinessPrice-Product/raw/refs/heads/main/BM-BOL-BusinessPrice-Product.user.js
// @downloadURL  https://github.com/Flyor/BM-BOL-BusinessPrice-Product/raw/refs/heads/main/BM-BOL-BusinessPrice-Product.user.js
// @match        https://www.brickmerge.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=brickmerge.de
// @author       Stonehiller Industries
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Funktion zum Anzeigen der Preise
    function displayPrices() {
        setTimeout(function() {
            var refImg = document.querySelector('div.medium-1.small-3.columns.text-center img[alt="Nach Shop filtern"]');
            if (!refImg) {
                console.error("Referenzelement (Bild 'Nach Shop filtern') nicht gefunden.");
                return;
            }
            var refDiv = refImg.parentNode;
            console.log("Referenz-Div gefunden:", refDiv);

            var bolElem = document.querySelector('[data-mid="439"] .price');
            var bolText = "";
            if (bolElem) {
                console.log("bol.de Preis-Element gefunden:", bolElem);
                var priceText = bolElem.textContent;
                if (priceText.includes("[Code]")) {
                    console.log("Zusatz '[Code]' gefunden im Preistext.");
                    bolText = "BOL Business: Code";
                } else {
                    var matchPrice = priceText.match(/(\d+,\d+)/);
                    if (matchPrice) {
                        var priceStr = matchPrice[1];
                        var priceNum = parseFloat(priceStr.replace(',', '.'));
                        var discounted = priceNum * 0.87;
                        var discountedStr = discounted.toFixed(2).replace('.', ',');
                        bolText = `BOL Business Preis: ${discountedStr} €<br>`;

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
                                    bolText += `Rabatt: ${discountPercent}%`;
                                }
                            } else {
                                console.warn("Kein UVP-Preis im UVP-Paragraph gefunden.");
                            }
                        } else {
                            console.warn("UVP-Paragraph nicht gefunden.");
                        }
                    } else {
                        bolText = "BOL Business: Nicht verfügbar";
                    }
                }
            } else {
                bolText = "BOL Business: Nicht verfügbar";
            }
            console.log("BOL Text:", bolText);

            const url = window.location.href;
            const productNumberMatch = url.match(/\/(\d{5})-/);
            if (!productNumberMatch) return;

            const productNumber = productNumberMatch[1];
            const searchUrl = `https://www.smythstoys.com/de/de-de/search?text=lego+${productNumber}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: searchUrl,
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const productTitleElement = doc.querySelector('div[data-test="card-title"] h2');
                    const priceElement = doc.querySelector('.ios-price .text-price-lg');
                    const priceTextElement = doc.querySelector('.ios-price .notranslate');
                    const discountElement = doc.querySelector('.decal.inline-flex.text-white');

                    let smythsText = "";
                    if (productTitleElement && productTitleElement.textContent.includes(productNumber)) {
                        if (priceElement && priceTextElement) {
                            const price = priceElement.textContent.trim();
                            const priceText = priceTextElement.textContent.trim();
                            const discount = discountElement ? discountElement.textContent.trim().match(/-(\d+)%/)[1] : '0';

                            smythsText = `SmythsToys Preis: ${price}${priceText} <br> Rabatt: ${discount}% <br> <a href="${searchUrl}" style="color: #bb1d29;" target="_blank">Zu SmythsToys</a>`;
                        }
                    } else {
                        smythsText = "SmythsToys: Nicht verfügbar";
                    }

                    const priceDisplay = document.createElement('div');
                    priceDisplay.style.position = 'fixed';
                    priceDisplay.style.top = '100px';
                    priceDisplay.style.right = '10px';
                    priceDisplay.style.backgroundColor = 'black';
                    priceDisplay.style.color = 'white';
                    priceDisplay.style.border = '1px solid white';
                    priceDisplay.style.padding = '10px';
                    priceDisplay.style.zIndex = '1000';
                    priceDisplay.innerHTML = bolText + '<hr style="border: 1px solid white; margin: 10px 0;">' + smythsText;

                    document.body.appendChild(priceDisplay);
                }
            });
        }, 2000);
    }

    // Funktion aufrufen, wenn die Seite geladen ist
    window.addEventListener("load", function() {
        displayPrices();
    });
})();
