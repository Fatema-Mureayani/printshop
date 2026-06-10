import Link from "next/link";

async function getProducts() {
    const res = await fetch("http://127.0.0.1:5098/api/Products", {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Fehler beim Laden der Produkte");
    }

    return res.json();
}

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
};

function getProductImage(productName: string) {
    const name = productName.toLowerCase();

    if (name.includes("t-shirt") || name.includes("shirt")) {
        return "/showcase/tshirt.jpg";
    }

    if (name.includes("visiten")) {
        return "/showcase/visitenkarte.jpg";
    }

    if (name.includes("tasse")) {
        return "/showcase/tasse.jpg";
    }

    if (name.includes("kissen")) {
        return "/showcase/kissen.jpg";
    }

    if (name.includes("aufkleber")) {
        return "/showcase/aufkleber.jpg";
    }

    return "/showcase/visitenkarte.jpg";
}

export default async function Home() {
    const products: Product[] = await getProducts();

    return (
        <main>
            <header className="topHeader">
                <div className="logoArea">
                    <img src="/logo.png" alt="Logo" className="logoImg" />

                    <div className="logoText">
                        <h1>MUR Printing</h1>
                        <p>Wir drucken für Sie</p>
                    </div>
                </div>

                <div className="headerActions">
                    <a href="#start" className="headerItem">Startseite</a>
                    <a href="#produkte" className="headerItem">Produkte</a>
                    <a href="#ueber-uns" className="headerItem">Über uns</a>
                    <a href="#kontakt" className="headerItem">Kontakt</a>

                    <Link href="/warenkorb" className="cartHeaderButton">
                        Warenkorb
                    </Link>
                </div>
            </header>

            <section id="start" className="heroSection">
                <div className="heroText">
                    <p className="sectionLabel">MUR PRINTING</p>

                    <h2>
                        Ihre Ideen. <br />
                        <span>Unser Druck.</span> <br />
                        Perfekte Ergebnisse.
                    </h2>

                    <p>
                        Hochwertige Druckprodukte für Unternehmen und Privatkunden –
                        individuell, kreativ und professionell.
                    </p>

                    <a href="#produkte" className="heroButton">
                        Produkte entdecken
                    </a>

                    <div className="heroFeatures">
                        <div>
                            <span>✦</span>
                            Premium Qualität
                        </div>
                        <div>
                            <span>✎</span>
                            Individuelles Design
                        </div>
                        <div>
                            <span>☏</span>
                            WhatsApp Kontakt
                        </div>
                    </div>
                </div>

                <div className="heroImageBox">
                    <img src="/showcase/visitenkarte.jpg" alt="Visitenkarten Mockup" />
                </div>
            </section>

            <section className="section" id="arbeiten">
                <p className="sectionLabel">UNSERE ARBEITEN</p>
                <div className="sectionHeaderRow">
                    <h2 className="sectionTitle">Qualität, die man sieht.</h2>
                    <a href="#produkte" className="outlineButton">Mehr ansehen</a>
                </div>

                <div className="showcaseGrid">
                    <div className="showcaseCard">
                        <img src="/showcase/visitenkarte.jpg" alt="Visitenkarten" />
                        <span>Visitenkarten</span>
                    </div>

                    <div className="showcaseCard">
                        <img src="/showcase/tshirt.jpg" alt="T-Shirts" />
                        <span>T-Shirts</span>
                    </div>

                    <div className="showcaseCard">
                        <img src="/showcase/tasse.jpg" alt="Tassen" />
                        <span>Tassen</span>
                    </div>

                    <div className="showcaseCard">
                        <img src="/showcase/kissen.jpg" alt="Kissen" />
                        <span>Kissen</span>
                    </div>

                    <div className="showcaseCard">
                        <img src="/showcase/aufkleber.jpg" alt="Aufkleber" />
                        <span>Aufkleber</span>
                    </div>
                </div>
            </section>

            <section id="produkte" className="section">
                <p className="sectionLabel">PRODUKTE</p>
                <div className="sectionHeaderRow">
                    <h2 className="sectionTitle">Unsere Kunden lieben diese Produkte.</h2>
                    <span className="outlineButton">Alle Produkte</span>
                </div>

                <div className="productsGrid">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={
                                product.name === "T-Shirt mit Logo"
                                    ? "/t-shirt"
                                    : product.name === "Visitenkarten"
                                        ? "/visitenkarten"
                                        : "#"
                            }
                            className="productCard"
                        >
                            <div className="productImageBox">
                                <img src={getProductImage(product.name)} alt={product.name} />
                            </div>

                            <div className="productContent">
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <strong>Ab {product.price} €</strong>
                                <span className="productButton">Jetzt ansehen</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="section processSection">
                <p className="sectionLabel">SO EINFACH GEHT'S</p>
                <h2 className="sectionTitle">In 5 Schritten zu deinem Produkt.</h2>

                <div className="processGrid">
                    <div className="processStep">
                        <div className="processIcon">
                            <i className="fa-solid fa-layer-group"></i>
                        </div>
                        <span className="processNumber">01</span>
                        <h3>Produkt wählen</h3>
                        <p>Wähle das passende Druckprodukt für dein Projekt aus.</p>
                    </div>

                    <div className="processStep">
                        <div className="processIcon">
                            <i className="fa-solid fa-pen-to-square"></i>
                        </div>
                        <span className="processNumber">02</span>
                        <h3>Design erstellen</h3>
                        <p>Lade deine Druckdatei hoch oder gestalte dein Design online.</p>
                    </div>

                    <div className="processStep">
                        <div className="processIcon">
                            <i className="fa-solid fa-cart-shopping"></i>
                        </div>
                        <span className="processNumber">03</span>
                        <h3>Bestellung absenden</h3>
                        <p>Prüfe deine Auswahl und sende deine Bestellung bequem ab.</p>
                    </div>

                    <div className="processStep">
                        <div className="processIcon">
                            <i className="fa-solid fa-print"></i>
                        </div>
                        <span className="processNumber">04</span>
                        <h3>Wir drucken</h3>
                        <p>Dein Produkt wird hochwertig und professionell produziert.</p>
                    </div>

                    <div className="processStep">
                        <div className="processIcon">
                            <i className="fa-solid fa-store"></i>
                        </div>
                        <span className="processNumber">05</span>
                        <h3>Abholen</h3>
                        <p>Sobald dein Auftrag fertig ist, kannst du ihn direkt abholen.</p>
                    </div>
                </div>
            </section>

            <section id="ueber-uns" className="aboutSection">
                <div className="aboutLeft">
                    <p className="sectionLabel">VON DER IDEE ZUM PRODUKT</p>

                    <h2>
                        So entsteht <br />
                        etwas Großartiges.
                    </h2>

                    <p>
                        Bei MUR Printing verwandeln wir deine Ideen in hochwertige
                        Druckprodukte. Von der Gestaltung bis zum fertigen Druck
                        begleiten wir dich mit Qualität, Präzision und Leidenschaft.
                    </p>

                    <details className="aboutDetails">
                        <summary>Mehr über uns</summary>

                        <div className="aboutMoreText">
                            <p>
                                MUR Printing steht für Qualität, Kreativität und Zuverlässigkeit.
                            </p>

                            <p>
                                Wir fertigen Visitenkarten, Banner, Textilien und viele weitere
                                Druckprodukte individuell nach Kundenwunsch.
                            </p>

                            <p>
                                Unser Ziel ist es, professionelle Drucklösungen schnell und
                                unkompliziert anzubieten.
                            </p>
                        </div>
                    </details>
                </div>

                <div className="aboutFlow">
                    <div className="aboutCard">
                        <img src="/logo.png" alt="Design" />
                        <span>Dein Design</span>
                    </div>

                    <div className="aboutArrow">
                        <i className="fa-solid fa-arrow-right"></i>
                    </div>

                    <div className="aboutCard">
                        <img src="/showcase/visitenkarte.jpg" alt="Produkt" />
                        <span>Gedrucktes Produkt</span>
                    </div>
                </div>
            </section>


            <footer className="footer">
                <div className="footerContent">
                    <div className="footerBrand">
                        <div className="footerLogoArea">
                            <img src="/logo.png" alt="MUR Printing Logo" />
                            <h3>MUR Printing</h3>
                        </div>

                        <p>
                            Wir bieten hochwertige Druckprodukte für Unternehmen und
                            Privatkunden. Kreativ, schnell und zuverlässig.
                        </p>
                    </div>

                    <div className="footerColumn">
                        <h4>Kontakt</h4>

                        <a href="tel:+4917631709641" className="footerContactLink">
                            <i className="fa-solid fa-phone-volume"></i>
                            <span>+49 17631709641</span>
                        </a>

                        <a
                            href="https://wa.me/4917631709641"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footerContactLink"
                        >
                            <i className="fa-brands fa-whatsapp"></i>
                            <span>WhatsApp Chat</span>
                        </a>

                        <a
                            href="mailto:mur.printing.service@gmail.com"
                            className="footerContactLink"
                        >
                            <i className="fa-solid fa-envelope-open-text"></i>
                            <span>mur.printing.service@gmail.com</span>
                        </a>

                        <a
                            href="https://maps.google.com/?q=Prinzenstraße+91+47058+Duisburg"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footerContactLink"
                        >
                            <i className="fa-solid fa-map-location-dot"></i>
                            <span>Prinzenstraße 91, 47058 Duisburg</span>
                        </a>
                    </div>

                    <div className="footerColumn">
                        <h4>Navigation</h4>
                        <a href="#start">Startseite</a>
                        <a href="#produkte">Produkte</a>
                        <a href="#ueber-uns">Über uns</a>
                        <a href="#kontakt">Kontakt</a>
                    </div>

                    <div className="footerColumn">
                        <h4>Rechtliches</h4>
                        <a href="#">Impressum</a>
                        <a href="#">Datenschutz</a>
                        <a href="#">AGB</a>
                        <a href="#">Widerrufsrecht</a>
                    </div>

                    <div className="footerColumn">
                        <h4>Folge uns</h4>

                        <div className="footerSocials">
                            <a
                                href="https://www.instagram.com/mur_printing?igsh=MWVrNmp3NHhrbWVpNA=="
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fa-brands fa-instagram"></i>
                            </a>

                            <a
                                href="https://www.facebook.com/share/1DzN6qpQDm/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fa-brands fa-facebook-f"></i>
                            </a>

                            <a
                                href="https://www.tiktok.com/@mur.printing?_r=1&_t=ZG-974ezE6UvDd"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fa-brands fa-tiktok"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footerBottom">
                    © 2026 MUR Printing. Alle Rechte vorbehalten.
                </div>
            </footer>
        </main>
    );
}