"use client";

import { useState } from "react";

const colors = [
    { name: "Weiß", file: "white", hex: "#ffffff" },
    { name: "Rot", file: "red", hex: "#dc2626" },
    { name: "Navi", file: "navi", hex: "#1a2330" },
    { name: "Schwarz", file: "black", hex: "#111111" },
    { name: "Grau", file: "gray", hex: "#6b7280" },
    { name: "Light Grau", file: "light gray", hex: "#6a6967" },
    { name: "Gelb", file: "yellow", hex: "#facc15" },
    { name: "Grün", file: "green", hex: "#187532" },
    { name: "Blau", file: "blue", hex: "#2563eb" },
    { name: "Orange", file: "orange", hex: "#ff5f2e" },
];

const sizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];

export default function TShirtPage() {
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [selectedSize, setSelectedSize] = useState("S");
    const [designPreview, setDesignPreview] = useState<string | null>(null);

    const selectedShirtImage = `/tshirts/${selectedColor.file}.png`;

    function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        setDesignPreview(URL.createObjectURL(file));
    }

    return (
        <main className="tshirtPage">
            <section className="tshirtGallery">
                <div className="thumbnailList">
                    <img src={selectedShirtImage} alt="T-Shirt Vorderseite" />
                    <img src={selectedShirtImage} alt="T-Shirt Rückseite" />
                    <img src={selectedShirtImage} alt="T-Shirt Detail" />
                </div>

                <div className="mainPreview">
                    <img
                        src={selectedShirtImage}
                        alt={`${selectedColor.name} T-Shirt Vorschau`}
                        className="shirtImage"
                    />

                    {designPreview && (
                        <img
                            src={designPreview}
                            alt="Design Vorschau"
                            className="designOnShirt"
                        />
                    )}
                </div>
            </section>

            <section className="tshirtConfig">
                <h1>Klassisches Unisex T-Shirt</h1>

                <div className="configBlock">
                    <h3>Technik</h3>
                    <div className="techButtons">
                        <button className="active">Druck</button>
                    </div>
                </div>

                <div className="configBlock">
                    <h3>Drucktyp</h3>
                    <label className="optionBox">
                        <input type="radio" readOnly />
                        DTFlex
                    </label>
                </div>

                <div className="configBlock">
                    <h3>Farbe</h3>

                    <div className="colorGrid">
                        {colors.map((color) => (
                            <button
                                key={color.file}
                                className={`colorButton ${
                                    selectedColor.file === color.file ? "selected" : ""
                                }`}
                                style={{ backgroundColor: color.hex }}
                                onClick={() => setSelectedColor(color)}
                                title={color.name}
                                type="button"
                            />
                        ))}
                    </div>

                    <p className="selectedText">
                        Ausgewählt: {selectedColor.name}
                    </p>
                </div>

                <div className="configBlock">
                    <h3>Größe</h3>
                    <div className="sizeGrid">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                className={selectedSize === size ? "selectedSize" : ""}
                                onClick={() => setSelectedSize(size)}
                                type="button"
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="configBlock">
                    <h3>Design hochladen</h3>

                    <label className="uploadBox">
                        Design hochladen
                        <input type="file" accept="image/*" onChange={handleUpload} />
                    </label>
                </div>

                <div className="priceBox">
                    <p>Preis</p>
                    <strong>29.99 €</strong>
                </div>

                <button className="startDesignButton" disabled={!designPreview}>
                    Mit Design beginnen
                </button>
            </section>
        </main>
    );
}