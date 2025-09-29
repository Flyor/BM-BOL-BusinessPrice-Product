// ==UserScript==
// @name         BM Bol Business + ST auf Produktseite
// @namespace    https://brickmerge.de/
// @version      2.1.0
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

    let priceDisplayExists = false;
    let retryCount = 0;
    const maxRetries = 10;

    // Funktion zum Warten auf Elemente mit Retry-Logik
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} nicht gefunden nach ${timeout}ms`));
            }, timeout);
        });
    }

    // Funktion zum Anzeigen der Preise
    function displayPrices() {
        // Prüfen ob Dialog bereits existiert
        if (priceDisplayExists || document.querySelector('#bm-price-display')) {
            console.debug("Preis-Display bereits vorhanden");
            return;
        }

        retryCount++;
        console.debug(`Versuche Preise anzuzeigen (Versuch ${retryCount}/${maxRetries})`);

        // Warten auf das Referenzelement
        waitForElement('div.medium-1.small-3.columns.text-center img[alt="Nach Shop filtern"]', 3000)
        .then(refImg => {
            var refDiv = refImg.parentNode;
            console.debug("Referenz-Div gefunden:", refDiv);

            // BOL Preis ermitteln
            var bolElem = document.querySelector('[data-mid="439"] .price');
            var bolText = "";
            if (bolElem) {
                console.debug("bol.de Preis-Element gefunden:", bolElem);
                var priceText = bolElem.textContent;
                if (priceText.includes("[Code]")) {
                    console.debug("Zusatz '[Code]' gefunden im Preistext.");
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
                            console.debug("UVP-Paragraf gefunden:", uvpParagraph);
                            var matchUvp = uvpParagraph.textContent.match(/UVP:\s*([\d,]+)\s*€/);
                            if (matchUvp) {
                                var uvpStr = matchUvp[1];
                                var uvpNum = parseFloat(uvpStr.replace(',', '.'));
                                if (uvpNum > 0) {
                                    var discountPercent = Math.round((1 - (discounted / uvpNum)) * 100);
                                    bolText += `Rabatt: ${discountPercent}%`;
                                }
                            } else {
                                console.debug("Kein UVP-Preis im UVP-Paragraph gefunden.");
                            }
                        } else {
                            console.debug("UVP-Paragraph nicht gefunden.");
                        }
                    } else {
                        bolText = "BOL Business: Nicht verfügbar";
                    }
                }
            } else {
                bolText = "BOL Business: Nicht verfügbar";
            }
            console.debug("BOL Text:", bolText);

            // Produktnummer extrahieren - verschiedene URL-Formate unterstützen
            const url = window.location.href;
            let productNumber = null;
            
            // Standard Format: /12345-1_name
            let productNumberMatch = url.match(/\/(\d{4,5})-\d+_/);
            if (productNumberMatch) {
                productNumber = productNumberMatch[1];
            } else {
                // Alternatives Format: nur /12345-
                productNumberMatch = url.match(/\/(\d{4,5})-/);
                if (productNumberMatch) {
                    productNumber = productNumberMatch[1];
                }
            }
            
            if (!productNumber) {
                console.debug("Keine gültige Produktnummer in URL gefunden:", url);
                createPriceDisplay(bolText, "SmythsToys: Produktnummer nicht erkannt");
                return;
            }
            
            console.debug("Produktnummer gefunden:", productNumber);
            
            // SmythsToys durchsuchen
            const searchUrl = `https://www.smythstoys.com/de/de-de/search?text=lego+${productNumber}`;
            console.debug("SmythsToys Suche:", searchUrl);

            GM_xmlhttpRequest({
                method: 'GET',
                url: searchUrl,
                timeout: 10000,
                onload: function(response) {
                    console.debug("SmythsToys Response Status:", response.status);
                    
                    if (response.status !== 200) {
                        createPriceDisplay(bolText, "SmythsToys: Fehler beim Laden");
                        return;
                    }

                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        
                        // Verschiedene Selektoren für Produkttitel versuchen
                        const titleSelectors = [
                            'div[data-test="card-title"] h2',
                            '.product-name h2',
                            '.product-title',
                            'h2[data-test="product-title"]'
                        ];
                        
                        let productTitleElement = null;
                        for (const selector of titleSelectors) {
                            productTitleElement = doc.querySelector(selector);
                            if (productTitleElement) break;
                        }

                        // Verschiedene Selektoren für Preise versuchen
                        const priceSelectors = [
                            '.ios-price .text-price-lg',
                            '.price .current-price',
                            '.product-price .price',
                            '[data-test="price"]'
                        ];
                        
                        let priceElement = null;
                        for (const selector of priceSelectors) {
                            priceElement = doc.querySelector(selector);
                            if (priceElement) break;
                        }

                        const priceTextElement = doc.querySelector('.ios-price .notranslate') || doc.querySelector('.currency');
                        const discountElement = doc.querySelector('.decal.inline-flex.text-white') || doc.querySelector('.discount-badge');

                        let smythsText = "";
                        
                        // Prüfen ob Produkt gefunden wurde
                        if (productTitleElement && productTitleElement.textContent.includes(productNumber)) {
                            if (priceElement) {
                                const price = priceElement.textContent.trim();
                                const priceText = priceTextElement ? priceTextElement.textContent.trim() : '';
                                let discount = '0';
                                
                                if (discountElement) {
                                    const discountMatch = discountElement.textContent.trim().match(/-?(\d+)%/);
                                    if (discountMatch) discount = discountMatch[1];
                                }

                                smythsText = `SmythsToys Preis: ${price}${priceText}<br>Rabatt: ${discount}%<br><a href="${searchUrl}" style="color: #bb1d29;" target="_blank">Zu SmythsToys</a>`;
                            } else {
                                smythsText = `SmythsToys: Produkt gefunden, Preis nicht verfügbar<br><a href="${searchUrl}" style="color: #bb1d29;" target="_blank">Zu SmythsToys</a>`;
                            }
                        } else {
                            smythsText = "SmythsToys: Nicht verfügbar";
                        }
                        
                        createPriceDisplay(bolText, smythsText);
                        
                    } catch (error) {
                        console.error("Fehler beim Parsen der SmythsToys-Antwort:", error);
                        createPriceDisplay(bolText, "SmythsToys: Parsing-Fehler");
                    }
                },
                onerror: function(error) {
                    console.error("SmythsToys Request Fehler:", error);
                    createPriceDisplay(bolText, "SmythsToys: Verbindungsfehler");
                },
                ontimeout: function() {
                    console.error("SmythsToys Request Timeout");
                    createPriceDisplay(bolText, "SmythsToys: Timeout");
                }
            });
        })
        .catch(error => {
            console.debug("Fehler beim Warten auf Referenzelement:", error);
            
            // Fallback: Versuche es trotzdem mit den verfügbaren Informationen
            if (retryCount < maxRetries) {
                setTimeout(() => displayPrices(), 1000);
            } else {
                console.error("Max. Anzahl Versuche erreicht, zeige minimal Dialog");
                createPriceDisplay("BOL Business: Seite noch nicht geladen", "SmythsToys: Seite noch nicht geladen");
            }
        });
    }

    // Hilfsfunktion zum Erstellen des Preis-Displays
    function createPriceDisplay(bolText, smythsText) {
        if (priceDisplayExists || document.querySelector('#bm-price-display')) {
            console.debug("Preis-Display bereits vorhanden, überspringe");
            return;
        }

        const priceDisplay = document.createElement('div');
        priceDisplay.id = 'bm-price-display';
        priceDisplay.style.position = 'fixed';
        priceDisplay.style.top = '100px';
        priceDisplay.style.right = '10px';
        priceDisplay.style.backgroundColor = 'black';
        priceDisplay.style.color = 'white';
        priceDisplay.style.border = '1px solid white';
        priceDisplay.style.padding = '10px';
        priceDisplay.style.zIndex = '1000';
        priceDisplay.style.borderRadius = '5px';
        priceDisplay.style.fontFamily = 'Arial, sans-serif';
        priceDisplay.style.fontSize = '12px';
        priceDisplay.style.maxWidth = '300px';
        priceDisplay.innerHTML = bolText + '<hr style="border: 1px solid white; margin: 10px 0;">' + smythsText;

        document.body.appendChild(priceDisplay);
        priceDisplayExists = true;
        console.debug("Preis-Display erstellt und angezeigt");
    }

    // Funktion aufrufen, wenn die Seite geladen ist
    window.addEventListener("load", function() {
        console.debug("Seite geladen, starte displayPrices");
        displayPrices();
    });

    // Zusätzlich bei Navigation/URL-Änderungen (für SPA-Verhalten)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            priceDisplayExists = false;
            retryCount = 0;
            
            // Alten Dialog entfernen falls vorhanden
            const oldDisplay = document.querySelector('#bm-price-display');
            if (oldDisplay) {
                oldDisplay.remove();
            }
            
            console.debug("URL geändert, starte displayPrices neu");
            setTimeout(() => displayPrices(), 1000);
        }
    }).observe(document, { subtree: true, childList: true });
})();
