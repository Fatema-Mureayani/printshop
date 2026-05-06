"use client";

import { useState } from "react";
import Link from "next/link"; // استيراد Link من Next.js

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
    { name: "Pink", file: "pink", hex: "#dd004e" },
    { name: "Cherry Berry", file: "cherry berry", hex: "#852638" },
    { name: "Navi", file: "navi", hex: "#1a2330" },
    { name: "Schwarz", file: "black", hex: "#111111" },
];

const sizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

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

    // دالة handleDesignStart
    function handleDesignStart() {
        console.log("تنفيذ الضغط على الزر");
        // هنا يمكن إضافة عملية توجيه المستخدم
        window.location.href = "/t-shirt/design";  // أو يمكنك استخدام Link كما في الأمثلة السابقة
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
                        className="shirtImage tshirtPageImage" // إضافة class مميز
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

                {/* استبدال window.location.href بـ Link من Next.js */}
                <button className="startDesignButton" onClick={handleDesignStart}>
                    Mit Design beginnen
                </button>
            </section>
        </main>
    );
}