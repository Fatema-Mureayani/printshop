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
                    <a href="#warenkorb" className="headerItem">🛒 Warenkorb</a>
                    <a href="#kontakt" className="headerItem">📞 Kontakt</a>
                </div>
            </header>

            <nav className="mainNav">
                <a href="#produkte" className="navLink">
                    Alle Produkte
                </a>
                <a href="#ueber-uns" className="navLink">
                    Über uns
                </a>
            </nav>

            <section className="heroSection">
                <div className="heroText">
                    <h2>Willkommen bei MUR Printing</h2>
                    <p>
                        Hochwertige Druckprodukte für Unternehmen und Privatkunden.
                    </p>
                </div>
            </section>

            <section id="produkte" className="section">
                <h2 className="sectionTitle">Alle Produkte</h2>

                <div className="productsGrid">
                    {products.map((product) => (
                        <div key={product.id} className="productCard">
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <strong>{product.price} €</strong>
                        </div>
                    ))}
                </div>
            </section>

            <section id="ueber-uns" className="section">
                <h2 className="sectionTitle">Über uns</h2>
                <div className="infoBox">
                    <p>
                        MUR Printing ist Ihr Partner für moderne und hochwertige
                        Drucklösungen.
                    </p>
                    <p>
                        Wir bieten einfache, schnelle und professionelle Druckprodukte für
                        unsere Kunden an.
                    </p>
                </div>
            </section>

            <section id="kontakt" className="section">
                <h2 className="sectionTitle">Kontakt</h2>
                <div className="infoBox">
                    <p>Telefon: +49 17631709641</p>
                    <p>E-Mail: mur.printing.service@gmail.com</p>
                </div>
            </section>

            <section id="warenkorb" className="section">
                <h2 className="sectionTitle">Warenkorb</h2>
                <div className="infoBox">
                    <p>Ihr Warenkorb ist momentan leer.</p>
                </div>
            </section>
        </main>
    );
}