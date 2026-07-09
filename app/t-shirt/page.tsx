"use client";

import { useState } from "react";

const colors = [
    { name: "Weiß", file: "white", hex: "#ffffff" },
    { name: "Baby Blau", file: "baby blue", hex: "#bbd4ee" },
    { name: "Wild Lime", file: "wild lime", hex: "#c6d659" },
    { name: "Gelb", file: "yellow", hex: "#facc15" },
    { name: "Grau", file: "gray", hex: "#a5a7a9" },
    { name: "Light Grau", file: "light gray", hex: "#6a6967" },
    { name: "Jade", file: "jade", hex: "#00a6a2" },
    { name: "Blau", file: "blue", hex: "#2563eb" },
    { name: "Grün", file: "green", hex: "#007223" },
    { name: "Khaki", file: "khaki", hex: "#696142" },
    { name: "Rot", file: "red", hex: "#dc2626" },
    { name: "Orange", file: "orange", hex: "#ff5f2e" },
    { name: "Brown", file: "brown", hex: "#694939" },
    { name: "Cherry Berry", file: "cherry berry", hex: "#852638" },
    { name: "Navi", file: "navi", hex: "#1a2330" },
    { name: "Schwarz", file: "black", hex: "#111111" },
];

const sizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

type DruckdatenOption =
    | "Eigene Druckdaten"
    | "Online Designer"
    | "Gestaltungsservice";

type PrintSide = "front" | "back"  | "side-left" | "side-right" | "detail";

type UploadedDesign = {
    src: string;
    x: number; // %
    y: number; // %
    width: number; // %
};

const sideLabels = {
    front: "Vorderseite",
    back: "Rückseite",
    "side-left": "Linker Ärmel",
    "side-right": "Rechter Ärmel",
    detail: "Detailansicht",
};

const printAreas: Record<
    PrintSide,
    {
        left: number;
        top: number;
        width: number;
        height: number;
        defaultDesignWidth: number;
        minDesignWidth: number;
        maxDesignWidth: number;
    }
> = {
    front: {
        left: 30,
        top: 24,
        width: 44,
        height: 56,
        defaultDesignWidth: 55,
        minDesignWidth: 20,
        maxDesignWidth: 90,
    },
    back: {
        left: 28,
        top: 18,
        width: 44,
        height: 62,
        defaultDesignWidth: 55,
        minDesignWidth: 20,
        maxDesignWidth: 90,
    },
    "side-left": {
        left: 36,
        top: 18,
        width: 20,
        height: 20,
        defaultDesignWidth: 60,
        minDesignWidth: 25,
        maxDesignWidth: 95,
    },
    "side-right": {
        left: 41,
        top: 14,
        width: 20,
        height: 20,
        defaultDesignWidth: 60,
        minDesignWidth: 25,
        maxDesignWidth: 95,
    },
    detail: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        defaultDesignWidth: 0,
        minDesignWidth: 0,
        maxDesignWidth: 0,
    },
};

export default function TShirtPage() {
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [selectedSize, setSelectedSize] = useState("S");
    const [selectedDruckdaten, setSelectedDruckdaten] =
        useState<DruckdatenOption>("Eigene Druckdaten");

    const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
    const [dragSide, setDragSide] = useState<PrintSide | null>(null);

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const [designs, setDesigns] = useState<
        Partial<Record<PrintSide, UploadedDesign>>
    >({});

    const [textInput, setTextInput] = useState("");
    const [description, setDescription] = useState("");

    const selectedShirtImage = `/tshirts/${selectedColor.file}.png`;

    const galleryImages: { side: PrintSide; src: string; alt: string }[] = [
        {
            side:"front",
            src:selectedShirtImage,
            alt:"Vorderseite"
        },
        {
            side:"back",
            src:"/tshirts/white-back.png",
            alt:"Rückseite"
        },
        {
            side:"side-left",
            src:"/tshirts/white-side-left.png",
            alt:"Linke Seite"
        },
        {
            side:"side-right",
            src:"/tshirts/white-side-right.png",
            alt:"Rechte Seite"
        },
        {
            side:"detail",
            src:"/tshirts/white-detail.png",
            alt:"Detail"
        },
    ];

    const selectedSide = galleryImages[selectedGalleryIndex].side;
    const selectedDesign = designs[selectedSide];
    const selectedPrintArea = printAreas[selectedSide];

    const basePrice = 29.99;
    const servicePrice = selectedDruckdaten === "Gestaltungsservice" ? 15 : 0;
    const totalPrice = basePrice + servicePrice;

    function handleUpload(event: React.ChangeEvent<HTMLInputElement>, side: PrintSide) {
        const file = event.target.files?.[0];
        if (!file) return;

        setDesigns((prev) => ({
            ...prev,
            [side]: {
                src: URL.createObjectURL(file),
                x: 50,
                y: 50,
                width: printAreas[side].defaultDesignWidth,
            },
        }));

        event.target.value = "";
    }

    function updateDesign(side: PrintSide, changes: Partial<UploadedDesign>) {
        setDesigns((prev) => {
            const current = prev[side];
            if (!current) return prev;

            return {
                ...prev,
                [side]: {
                    ...current,
                    ...changes,
                },
            };
        });
    }

    function removeDesign(side: PrintSide) {
        setDesigns((prev) => {
            const copy = { ...prev };
            delete copy[side];
            return copy;
        });
    }

    function handlePointerDown(
        event: React.PointerEvent<HTMLImageElement>,
        side: PrintSide
    ) {
        event.preventDefault();
        setDragSide(side);
    }

    function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
        if (!dragSide || !designs[dragSide]) return;

        const rect = event.currentTarget.getBoundingClientRect();

        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        updateDesign(dragSide, {
            x: Math.min(95, Math.max(5, x)),
            y: Math.min(95, Math.max(5, y)),
        });
    }

    function handlePointerUp() {
        setDragSide(null);
    }

    function handleDesignStart() {
        const tshirtConfig = {
            productId: 1,
            productName: "Klassisches Unisex T-Shirt",
            color: selectedColor.name,
            colorFile: selectedColor.file,
            size: selectedSize,
            druckdaten: selectedDruckdaten,
            designs,
            printAreas,
            text: textInput,
            description,
            price: totalPrice,
        };

        localStorage.setItem("tshirtConfig", JSON.stringify(tshirtConfig));
        window.location.href = "/t-shirt/design";
    }

    return (
        <main className="tshirtPage">
            <section className="tshirtGalleryCard">
                <h1>Klassisches Unisex T-Shirt</h1>

                <div className="mainPreview largePreview" onClick={() => setIsPreviewOpen(true)}>
                    <div className="shirtStage">
                        <img
                            src={galleryImages[selectedGalleryIndex].src}
                            alt={galleryImages[selectedGalleryIndex].alt}
                            className="tshirtPageImage"
                        />

                        {selectedSide !== "detail" && (
                            <div
                                className="printArea"
                                style={{
                                    left: `${selectedPrintArea.left}%`,
                                    top: `${selectedPrintArea.top}%`,
                                    width: `${selectedPrintArea.width}%`,
                                    height: `${selectedPrintArea.height}%`,
                                }}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                onPointerLeave={handlePointerUp}
                            >
                                {selectedDesign && (
                                    <img
                                        src={selectedDesign.src}
                                        alt="Design Vorschau"
                                        className="designOnShirt draggableDesign"
                                        onPointerDown={(event) => handlePointerDown(event, selectedSide)}
                                        style={{
                                            width: `${selectedDesign.width}%`,
                                            left: `${selectedDesign.x}%`,
                                            top: `${selectedDesign.y}%`,
                                        }}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="thumbnailList">
                    {galleryImages.map((image, index) => (
                        <button
                            key={image.alt}
                            className={`thumbnailButton ${
                                selectedGalleryIndex === index ? "selectedThumbnail" : ""
                            }`}
                            type="button"
                            onClick={() => setSelectedGalleryIndex(index)}
                        >
                            <img src={image.src} alt={image.alt} />

                            {designs[image.side] && image.side !== "detail" && (
                                <span className="thumbnailHasDesign">✓</span>
                            )}
                        </button>
                    ))}
                </div>

                {selectedSide !== "detail" && selectedDesign && (
                    <div className="designControlBox">
                        <strong>{sideLabels[selectedSide]} bearbeiten</strong>

                        <label>
                            Größe
                            <input
                                type="range"
                                min={selectedPrintArea.minDesignWidth}
                                max={selectedPrintArea.maxDesignWidth}
                                value={selectedDesign.width}
                                onChange={(e) =>
                                    updateDesign(selectedSide, {
                                        width: Number(e.target.value),
                                    })
                                }
                            />
                        </label>

                        <button
                            type="button"
                            className="removeDesignButton"
                            onClick={() => removeDesign(selectedSide)}
                        >
                            Entfernen
                        </button>
                    </div>
                )}
            </section>

            <section className="tshirtConfig">
                <h2>Produktdetails auswählen</h2>

                <div className="configBlock">
                    <h3>Technik</h3>
                    <div className="choiceGrid twoColumns">
                        <button className="choiceButton activeChoice" type="button">
                            Druck
                        </button>
                    </div>
                </div>

                <div className="configBlock">
                    <h3>Drucktyp</h3>
                    <div className="choiceGrid twoColumns">
                        <button className="choiceButton activeChoice" type="button">
                            DTFlex
                        </button>
                    </div>
                </div>

                <div className="configBlock">
                    <h3>Farbe</h3>

                    <div className="colorGrid">
                        {colors.map((color) => (
                            <button
                                key={color.file}
                                className={`colorButton ${
                                    selectedColor.file === color.file ? "selectedColor" : ""
                                }`}
                                style={{ backgroundColor: color.hex }}
                                onClick={() => setSelectedColor(color)}
                                title={color.name}
                                type="button"
                            />
                        ))}
                    </div>

                    <p className="selectedText">Ausgewählt: {selectedColor.name}</p>
                </div>

                <div className="configBlock">
                    <h3>Größe</h3>

                    <div className="sizeGrid">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                className={`sizeButton ${
                                    selectedSize === size ? "activeChoice" : ""
                                }`}
                                onClick={() => setSelectedSize(size)}
                                type="button"
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="configBlock">
                    <h3>Druckdaten</h3>

                    <div className="druckdatenGrid">
                        <button
                            type="button"
                            className={`druckdatenCard ${
                                selectedDruckdaten === "Eigene Druckdaten"
                                    ? "activeChoice"
                                    : ""
                            }`}
                            onClick={() => setSelectedDruckdaten("Eigene Druckdaten")}
                        >
                            <span className="radioCircle" />
                            <span className="druckIcon">↥</span>
                            <strong>Eigene Druckdaten</strong>
                            <p>PDF, PNG oder JPG hochladen.</p>
                            <b>Kostenlos</b>
                        </button>

                        <button
                            type="button"
                            className={`druckdatenCard ${
                                selectedDruckdaten === "Online Designer" ? "activeChoice" : ""
                            }`}
                            onClick={() => setSelectedDruckdaten("Online Designer")}
                        >
                            <span className="radioCircle" />
                            <span className="druckIcon">✎</span>
                            <strong>Online Designer</strong>
                            <p>T-Shirt direkt online gestalten.</p>
                            <b>Kostenlos</b>
                        </button>

                        <button
                            type="button"
                            className={`druckdatenCard ${
                                selectedDruckdaten === "Gestaltungsservice"
                                    ? "activeChoice"
                                    : ""
                            }`}
                            onClick={() => setSelectedDruckdaten("Gestaltungsservice")}
                        >
                            <span className="radioCircle" />
                            <span className="druckIcon">♚</span>
                            <strong>Gestaltungsservice</strong>
                            <p>Design nach Ihren Wünschen erstellen lassen.</p>
                            <b>15,00 €</b>
                        </button>
                    </div>
                </div>

                {selectedDruckdaten === "Eigene Druckdaten" && (
                    <div className="uploadPanel uploadPanelWide">
                        <h3>Druckdateien hochladen</h3>

                        <div className="sideUploadGrid">
                            {galleryImages
                                .filter((image) => image.side !== "detail")
                                .map((image, index) => (
                                    <div
                                        key={image.side}
                                        className={`sideUploadCard ${
                                            selectedSide === image.side ? "activeSideUpload" : ""
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            className="sideChooseButton"
                                            onClick={() => setSelectedGalleryIndex(index)}
                                        >
                                            {sideLabels[image.side]}
                                        </button>

                                        <label className="fileUploadBox smallUploadBox">
                                            Datei auswählen
                                            <input
                                                type="file"
                                                accept="image/*,.pdf"
                                                onChange={(event) => handleUpload(event, image.side)}
                                            />
                                        </label>

                                        {designs[image.side] && (
                                            <button
                                                type="button"
                                                className="removeSmallButton"
                                                onClick={() => removeDesign(image.side)}
                                            >
                                                Entfernen
                                            </button>
                                        )}
                                    </div>
                                ))}
                        </div>

                        <p className="uploadHint">
                            Nach dem Hochladen: Bild direkt auf dem T-Shirt ziehen und Größe
                            ändern.
                        </p>
                    </div>
                )}

                {selectedDruckdaten === "Gestaltungsservice" && (
                    <div className="servicePanel">
                        <h3>Der Print-Shop erstellt Ihr Design.</h3>

                        <label className="fieldLabel">
                            Text eingeben
                            <input
                                type="text"
                                className="textInputField"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="z.B. Mein tolles T-Shirt"
                            />
                        </label>

                        <label className="fieldLabel">
                            Beschreibung / Notizen
                            <textarea
                                className="descriptionInput"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="z.B. Besondere Wünsche, Farben, Platzierung, etc."
                                rows={4}
                            />
                        </label>
                    </div>
                )}
            </section>

            <aside className="summaryCard">
                <h2>Ihre Auswahl</h2>

                <div className="summaryRow">
                    <span>Produkt</span>
                    <strong>T-Shirt</strong>
                </div>

                <div className="summaryRow">
                    <span>Technik</span>
                    <strong>Druck</strong>
                </div>

                <div className="summaryRow">
                    <span>Drucktyp</span>
                    <strong>DTFlex</strong>
                </div>

                <div className="summaryRow">
                    <span>Farbe</span>
                    <strong>{selectedColor.name}</strong>
                </div>

                <div className="summaryRow">
                    <span>Größe</span>
                    <strong>{selectedSize}</strong>
                </div>

                <div className="summaryRow">
                    <span>Druckdaten</span>
                    <strong>{selectedDruckdaten}</strong>
                </div>

                <div className="summaryRow">
                    <span>Preis</span>
                    <strong>{totalPrice.toFixed(2).replace(".", ",")} €</strong>
                </div>

                {selectedDruckdaten === "Online Designer" ? (
                    <button className="cartButton" onClick={handleDesignStart}>
                        Mit Design beginnen
                    </button>
                ) : (
                    <button className="cartButton" type="button">
                        In den Warenkorb
                    </button>
                )}
            </aside>

            {isPreviewOpen && (
                <div className="previewModal" onClick={() => setIsPreviewOpen(false)}>
                    <div className="previewModalContent" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="previewModalClose"
                            onClick={() => setIsPreviewOpen(false)}
                        >
                            ×
                        </button>

                        <div className="modalPreview">
                            <div className="shirtStage modalShirtStage">
                                <img
                                    src={galleryImages[selectedGalleryIndex].src}
                                    alt={galleryImages[selectedGalleryIndex].alt}
                                    className="modalTshirtImage"
                                />

                                {selectedSide !== "detail" && (
                                    <div
                                        className="printArea"
                                        style={{
                                            left: `${selectedPrintArea.left}%`,
                                            top: `${selectedPrintArea.top}%`,
                                            width: `${selectedPrintArea.width}%`,
                                            height: `${selectedPrintArea.height}%`,
                                        }}
                                        onPointerMove={handlePointerMove}
                                        onPointerUp={handlePointerUp}
                                        onPointerLeave={handlePointerUp}
                                    >
                                        {selectedDesign && (
                                            <img
                                                src={selectedDesign.src}
                                                alt="Design Vorschau"
                                                className="designOnShirt draggableDesign"
                                                onPointerDown={(event) => handlePointerDown(event, selectedSide)}
                                                style={{
                                                    width: `${selectedDesign.width}%`,
                                                    left: `${selectedDesign.x}%`,
                                                    top: `${selectedDesign.y}%`,
                                                }}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedSide !== "detail" && selectedDesign && (
                            <div className="modalControls">
                                <strong>{sideLabels[selectedSide]} bearbeiten</strong>

                                <label>
                                    Größe
                                    <input
                                        type="range"
                                        min={selectedPrintArea.minDesignWidth}
                                        max={selectedPrintArea.maxDesignWidth}
                                        value={selectedDesign.width}
                                        onChange={(e) =>
                                            updateDesign(selectedSide, {
                                                width: Number(e.target.value),
                                            })
                                        }
                                    />
                                </label>

                                <button
                                    type="button"
                                    className="removeDesignButton"
                                    onClick={() => removeDesign(selectedSide)}
                                >
                                    Entfernen
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}