"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VisitenkartenPage() {
    const router = useRouter();
    const [selectedSeiten, setSelectedSeiten] = useState("Beidseitig bedruckt");
    const [selectedMenge, setSelectedMenge] = useState("500");
    const [selectedFormat, setSelectedFormat] = useState("85 × 55 mm");
    const [selectedVeredelung, setSelectedVeredelung] = useState("Matt");
    const [selectedDruckdaten, setSelectedDruckdaten] = useState("Eigene Druckdaten");
    //يحفظ بس اسم الملف بس
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [uploadedFileUrl, setUploadedFileUrl] = useState("");
    const [designWishes, setDesignWishes] = useState("");
    const [designerData, setDesignerData] = useState<any>(null);
    const mengePrices: Record<string, number> = {
        "500": 19.99,
        "1000": 29.99,
        "2500": 49.99,
        "5000": 79.99,
    };

    const formatPrices: Record<string, number> = {
        "85 × 55 mm": 0,
        "90 × 50 mm": 2,
    };

    const seitenPrices: Record<string, number> = {
        "Beidseitig bedruckt": 0,
        "Einseitig bedruckt": 0,
    };

    const veredelungPrices: Record<string, number> = {
        "Matt": 0,
        "Glänzend": 3,
        "Keine Veredelung": 0,
    };

    const druckdatenPrices: Record<string, number> = {
        "Eigene Druckdaten": 0,
        "Online Designer": 0,
        "Gestaltungsservice": 15,
    };

    const totalPrice =
        mengePrices[selectedMenge] +
        formatPrices[selectedFormat] +
        seitenPrices[selectedSeiten] +
        veredelungPrices[selectedVeredelung] +
        druckdatenPrices[selectedDruckdaten];

    async function handleDruckdatenUpload(file: File) {
        const allowedTypes = [
            "application/pdf",
            "image/png",
            "image/jpeg",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Bitte nur PDF, PNG oder JPG hochladen.");
            setUploadedFileName("");
            setUploadedFileUrl("");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:5098/api/uploads/druckdaten", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                alert("Die Datei konnte nicht hochgeladen werden.");
                setUploadedFileName("");
                setUploadedFileUrl("");
                return;
            }

            const data = await response.json();

            setUploadedFileName(data.fileName ?? data.FileName);
            setUploadedFileUrl(data.fileUrl ?? data.FileUrl);

            alert("Datei wurde erfolgreich hochgeladen.");
        } catch (error) {
            console.error(error);
            alert("Fehler beim Hochladen der Datei.");
            setUploadedFileName("");
            setUploadedFileUrl("");
        }
    }

    useEffect(() => {
        const savedDesignerData = localStorage.getItem("visitenkartenDesignerData");

        if (savedDesignerData) {
            setDesignerData(JSON.parse(savedDesignerData));
            setSelectedDruckdaten("Online Designer");
        }
    }, []);

    function handleAddToCart() {
        if (selectedDruckdaten === "Eigene Druckdaten" && uploadedFileUrl === "") {
            alert("Bitte laden Sie zuerst eine Druckdatei hoch.");
            return;
        }

        if (selectedDruckdaten === "Gestaltungsservice" && designWishes.trim() === "") {
            alert("Bitte beschreiben Sie Ihre Designwünsche.");
            return;
        }
        const cartItem = {
            id: Date.now(),
            productId: 2,
            productName: "Visitenkarten",

            druckdatenOption: selectedDruckdaten,
            druckdatenFileName: uploadedFileName,
            druckdatenFileUrl: uploadedFileUrl,
            designWishes: designWishes,
            designerData: designerData,

            color: selectedSeiten,
            colorFile: "",
            size: selectedMenge,

            customText: selectedFormat,

            description:
                `Seiten: ${selectedSeiten} (+${seitenPrices[selectedSeiten].toFixed(2)} €)\n` +
                `Menge: ${selectedMenge} (${mengePrices[selectedMenge].toFixed(2)} €)\n` +
                `Format: ${selectedFormat} (+${formatPrices[selectedFormat].toFixed(2)} €)\n` +
                `Veredelung: ${selectedVeredelung} (+${veredelungPrices[selectedVeredelung].toFixed(2)} €)\n` +
                `Druckdaten: ${selectedDruckdaten} (+${druckdatenPrices[selectedDruckdaten].toFixed(2)} €)` +
                (selectedDruckdaten === "Eigene Druckdaten" && uploadedFileName
                    ? `\nDatei: ${uploadedFileName}`
                    : "") +
                (selectedDruckdaten === "Gestaltungsservice" && designWishes
                    ? `\nDesignwünsche: ${designWishes}`
                    : "") +
                (selectedDruckdaten === "Online Designer" && designerData
                    ? `\nOnline Designer Daten:\n` +
                    `Name: ${designerData.name}\n` +
                    `Position: ${designerData.jobTitle}\n` +
                    `Telefon: ${designerData.phone}\n` +
                    `E-Mail: ${designerData.email}\n` +
                    `Webseite: ${designerData.website}`
                    : ""),

            font: "",
            fontSize: 0,
            textColor: "",
            position: "",
            rotate: 0,
            bend: 0,

            price: Number(totalPrice.toFixed(2)),
            quantity: 1,

            previewImage: "/showcase/visitenkarte-vor-rueck.jpg",
        };

        const existingCart = localStorage.getItem("cart");
        const cart = existingCart ? JSON.parse(existingCart) : [];

        cart.push(cartItem);

        localStorage.setItem("cart", JSON.stringify(cart));

        router.push("/warenkorb");
    }

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

                    {/* Seiten */}
                    <div className="vkOptionBox">
                        <div className="vkOptionLabelRow">
                            <label>Seiten</label>
                        </div>

                        <div className="vkButtons vkSideButtons">
                            {["Beidseitig bedruckt", "Einseitig bedruckt"].map((seiten) => (
                                <button
                                    key={seiten}
                                    onClick={() => setSelectedSeiten(seiten)}
                                    className={selectedSeiten === seiten ? "vkSelected" : ""}
                                >
                                    {seiten === "Beidseitig bedruckt" }
                                    {seiten}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Format */}
                    <div className="vkOptionBox">
                        <label>Format</label>

                        <div className="vkButtons">
                            {["85 × 55 mm", "90 × 50 mm"].map((format) => (
                                <button
                                    key={format}
                                    onClick={() => setSelectedFormat(format)}
                                    className={selectedFormat === format ? "vkSelected" : ""}
                                >
                                    {format}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Menge */}
                    <div className="vkOptionBox">
                        <label>Menge</label>

                        <div className="vkButtons">
                            {["500", "1000", "2500", "5000"].map((menge) => (
                                <button
                                    key={menge}
                                    onClick={() => setSelectedMenge(menge)}
                                    className={selectedMenge === menge ? "vkSelected" : ""}
                                >
                                    {menge}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Veredelung */}
                    <div className="vkOptionBox">
                        <div className="vkOptionLabelRow">
                            <label>Veredelung</label>
                        </div>

                        <div className="vkButtons vkFinishButtons">
                            {["Matt", "Glänzend", "Keine Veredelung"].map((veredelung) => (
                                <button
                                    key={veredelung}
                                    onClick={() => setSelectedVeredelung(veredelung)}
                                    className={selectedVeredelung === veredelung ? "vkSelected" : ""}
                                >
                                    {veredelung}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Druckdaten */}
                    <div className="vkOptionBox">
                        <label>Druckdaten</label>

                        <div className="vkDesignOptions">
                            {[
                                {
                                    title: "Eigene Druckdaten",
                                    text: "PDF, PNG oder JPG hochladen.",
                                    price: "Kostenlos",
                                    icon: "upload"
                                },
                                {
                                    title: "Online Designer",
                                    text: "Visitenkarte direkt online gestalten.",
                                    price: "Kostenlos",
                                    icon: "edit"
                                },
                                {
                                    title: "Gestaltungsservice",
                                    text: "Design nach Ihren Wünschen erstellen lassen.",
                                    price: "15,00 €",
                                    icon: "users"
                                },
                            ].map((option) => (
                                <div
                                    key={option.title}
                                    onClick={() => {
                                        if (option.title === "Online Designer") {
                                            router.push(
                                                `/visitenkarten/designer?seiten=${encodeURIComponent(selectedSeiten)}&format=${encodeURIComponent(selectedFormat)}`
                                            );
                                            return;
                                        }

                                        setSelectedDruckdaten(option.title);
                                    }}
                                    className={
                                        selectedDruckdaten === option.title
                                            ? "vkDesignCard vkDesignSelected"
                                            : "vkDesignCard"
                                    }
                                >
                                    <span className="vkRadioCircle"></span>

                                    <div className="vkDesignIcon">
                                        {option.icon === "upload" && (
                                            <svg viewBox="0 0 24 24">
                                                <path d="M12 3v12" />
                                                <path d="M7 8l5-5 5 5" />
                                                <path d="M5 15v4h14v-4" />
                                            </svg>
                                        )}

                                        {option.icon === "edit" && (
                                            <svg viewBox="0 0 24 24">
                                                <path d="M4 20h4l11-11-4-4L4 16v4z" />
                                                <path d="M14 6l4 4" />
                                            </svg>
                                        )}

                                        {option.icon === "users" && (
                                            <svg viewBox="0 0 24 24">
                                                <path d="M16 11a4 4 0 1 0-8 0" />
                                                <path d="M4 21a8 8 0 0 1 16 0" />
                                                <path d="M19 8a3 3 0 0 1 0 6" />
                                                <path d="M22 21a6 6 0 0 0-4-5.7" />
                                            </svg>
                                        )}
                                    </div>

                                    <h3>{option.title}</h3>
                                    <p>{option.text}</p>
                                    <strong>{option.price}</strong>
                                </div>
                            ))}
                            {selectedDruckdaten === "Eigene Druckdaten" && (
                                <div className="vkUploadBox">
                                    <label>Druckdatei hochladen</label>

                                    <input
                                        type="file"
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];

                                            if (!file) return;

                                            await handleDruckdatenUpload(file);
                                        }}
                                    />

                                    {uploadedFileName && (
                                        <p className="vkFileName">
                                            Ausgewählte Datei: {uploadedFileName}
                                        </p>
                                    )}
                                </div>
                            )}

                            {selectedDruckdaten === "Gestaltungsservice" && (
                                <div className="vkDesignServiceBox">
                                    <label>Beschreiben Sie Ihre Designwünsche</label>

                                    <textarea
                                        value={designWishes}
                                        onChange={(e) => setDesignWishes(e.target.value)}
                                        placeholder="z. B. schwarze Visitenkarte, goldenes Logo, moderner Stil, Name, Telefonnummer, E-Mail..."
                                        className="vkDesignTextarea"
                                    />

                                    <p className="vkExtraPrice">
                                        Für den Gestaltungsservice werden zusätzlich 15,00 € berechnet.
                                    </p>
                                </div>
                            )}

                            {selectedDruckdaten === "Online Designer" && designerData && (
                                <div className="vkDesignServiceBox">
                                    <label>Online Designer</label>

                                    <p>
                                        Ihr Design wurde erstellt und wird mit der Bestellung gespeichert.
                                    </p>

                                    <p>
                                        <strong>Name:</strong> {designerData.name}
                                    </p>

                                    <p>
                                        <strong>E-Mail:</strong> {designerData.email}
                                    </p>

                                    <p>
                                        <strong>Telefon:</strong> {designerData.phone}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => router.push("/visitenkarten/designer")}
                                    >
                                        Design bearbeiten
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* اليمين */}
                <div className="vkSummary">

                    <h2>Ihre Auswahl</h2>

                    <div className="vkSummaryItem">
                        <span>Seiten</span>
                        <strong>{selectedSeiten}</strong>
                    </div>

                    <div className="vkSummaryItem">
                        <span>Produkt</span>
                        <strong>Visitenkarten</strong>
                    </div>

                    <div className="vkSummaryItem">
                        <span>Menge</span>
                        <strong>{selectedMenge}</strong>
                    </div>

                    <div className="vkSummaryItem">
                        <span>Format</span>
                        <strong>{selectedFormat}</strong>
                    </div>

                    <div className="vkSummaryItem">
                        <span>Veredelung</span>
                        <strong>{selectedVeredelung}</strong>
                    </div>

                    <div className="vkSummaryItem">
                        <span>Druckdaten</span>
                        <strong>{selectedDruckdaten}</strong>
                    </div>

                    {selectedDruckdaten === "Eigene Druckdaten" && uploadedFileName && (
                        <div className="vkSummaryInfo">
                            Datei: {uploadedFileName}
                        </div>
                    )}

                    {selectedDruckdaten === "Eigene Druckdaten" && uploadedFileUrl && (
                        <div className="vkSummaryInfo">
                            Upload erfolgreich
                        </div>
                    )}

                    {selectedDruckdaten === "Gestaltungsservice" && (
                        <div className="vkSummaryInfo">
                            Aufpreis: 15,00 €
                        </div>
                    )}

                    <div className="vkSummaryItem">
                        <span>Preis</span>
                        <strong>{totalPrice.toFixed(2).replace(".", ",")} €</strong>
                    </div>

                    <button className="vkCartButton" onClick={handleAddToCart}>
                        In den Warenkorb
                    </button>

                </div>

            </div>
        </main>
    );
}