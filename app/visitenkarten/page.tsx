export default function VisitenkartenPage() {
    return (
        <main className="vkPage">
            <div className="vkContainer">

                {/* اليسار */}
                <div className="vkPreview">

                    <h1>Visitenkarten</h1>

                    <img
                        src="/showcase/visitenkarte-vor-rueck.jpg"
                        alt="Visitenkarten"
                        className="vkMainImage"
                    />

                    <div className="vkGallery">
                        <img
                            src="/showcase/visitenkarte-vorderseite.jpg"
                            alt="Vorderseite"
                        />

                        <img
                            src="/showcase/visitenkarte-rueckseite.jpg"
                            alt="Rückseite"
                        />
                    </div>
                </div>

                {/* الوسط */}
                <div className="vkOptions">

                    <h2>Produktdetails auswählen</h2>

                    <div className="vkOptionBox">
                        <label>Menge</label>

                        <div className="vkButtons">
                            <button>500</button>
                            <button>1000</button>
                            <button>2500</button>
                            <button>5000</button>
                        </div>
                    </div>

                    <div className="vkOptionBox">
                        <label>Format</label>

                        <div className="vkButtons">
                            <button>85 × 55 mm</button>
                            <button>90 × 50 mm</button>
                        </div>
                    </div>

                    <div className="vkOptionBox">
                        <label>Druckdaten</label>

                        <div className="vkDesignOptions">

                            <div className="vkDesignCard">
                                <h3>Eigene Druckdaten</h3>
                                <p>Datei hochladen</p>
                            </div>

                            <div className="vkDesignCard">
                                <h3>Online Designer</h3>
                                <p>Jetzt gestalten</p>
                            </div>

                            <div className="vkDesignCard">
                                <h3>Gestaltungsservice</h3>
                                <p>22,32 €</p>
                            </div>

                        </div>
                    </div>

                </div>

                {/* اليمين */}
                <div className="vkSummary">

                    <h2>Ihre Auswahl</h2>

                    <div className="vkSummaryItem">
                        <span>Produkt</span>
                        <strong>Visitenkarten</strong>
                    </div>

                    <div className="vkSummaryItem">
                        <span>Preis</span>
                        <strong>19,99 €</strong>
                    </div>

                    <button className="vkCartButton">
                        In den Warenkorb
                    </button>

                </div>

            </div>
        </main>
    );
}