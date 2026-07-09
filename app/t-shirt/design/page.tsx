"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PrintSide = "front" | "back" | "side-left" | "side-right" | "detail";
type ActiveElementType = "image" | "text";

type ShirtConfig = {
    productId: number;
    productName: string;
    color: string;
    colorFile: string;
    size: string;
    druckdaten?: string;
    text?: string;
    description?: string;
    price: number;
};

type DesignImage = {
    src: string;
    x: number;
    y: number;
    width: number;
};

type DesignText = {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    font: string;
    rotate: number;
    bend: number;
};

type SideDesign = {
    image?: DesignImage;
    texts: DesignText[];
};

type CartItem = {
    id: number;
    productId: number;
    productName: string;
    color: string;
    colorFile: string;
    size: string;
    price: number;
    quantity: number;
    designData: Partial<Record<PrintSide, SideDesign>>;
};

const sideLabels: Record<PrintSide, string> = {
    front: "Vorderseite",
    back: "Rückseite",
    "side-left": "Linke Seite",
    "side-right": "Rechte Seite",
    detail: "Detailansicht",
};

const printAreas = {
    front: {
        left: 30,
        top: 22,
        width: 44,
        height: 58,
        minWidth: 20,
        maxWidth: 90,
        defaultWidth: 55,
    },
    back: {
        left: 28,
        top: 18,
        width: 44,
        height: 62,
        minWidth: 20,
        maxWidth: 90,
        defaultWidth: 55,
    },
    "side-left": {
        left: 36,
        top: 18,
        width: 20,
        height: 20,
        minWidth: 25,
        maxWidth: 95,
        defaultWidth: 60,
    },

    "side-right": {
        left: 41,
        top: 14,
        width: 20,
        height: 20,
        minWidth: 25,
        maxWidth: 95,
        defaultWidth: 60,
    },
    detail: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        minWidth: 0,
        maxWidth: 0,
        defaultWidth: 0,
    },
};

const fontOptions = [
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Verdana", value: "Verdana, sans-serif" },
    { label: "Times New Roman", value: "'Times New Roman', serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Courier New", value: "'Courier New', monospace" },
    { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
    { label: "Impact", value: "Impact, sans-serif" },
    { label: "Comic Sans", value: "'Comic Sans MS', cursive" },
];

function ArcText({ text }: { text: DesignText }) {
    if (text.bend === 0) {
        return <span>{text.text}</span>;
    }

    const chars = [...text.text];
    const isTop = text.bend > 0;
    const absBend = Math.abs(text.bend);

    const radius = Math.max(45, 190 - absBend);
    const spacing = text.fontSize * 0.65;
    const totalAngle = (chars.length * spacing) / radius;

    let currentAngle = -totalAngle / 2;

    return (
        <span
            className="arcTextBox"
            style={{
                width: `${radius * 2}px`,
                height: `${radius}px`,
            }}
        >
      {chars.map((char, index) => {
          const charAngle = spacing / radius;
          const angle = currentAngle + charAngle / 2;

          currentAngle += charAngle;

          const x = radius + radius * Math.sin(angle);
          const y = isTop
              ? radius - radius * Math.cos(angle)
              : radius * Math.cos(angle);

          return (
              <span
                  key={`${char}-${index}`}
                  className="arcTextChar"
                  style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: `translate(-50%, -50%) rotate(${
                          isTop ? angle : -angle
                      }rad)`,
                  }}
              >
            {char === " " ? "\u00A0" : char}
          </span>
          );
      })}
    </span>
    );
}

export default function DesignPage() {
    const router = useRouter();

    const [shirtConfig, setShirtConfig] = useState<ShirtConfig | null>(null);
    const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);

    const [designs, setDesigns] = useState<
        Partial<Record<PrintSide, SideDesign>>
    >({});

    const [activeElement, setActiveElement] =
        useState<ActiveElementType>("text");
    const [activeTextId, setActiveTextId] = useState<string | null>(null);

    const [dragData, setDragData] = useState<{
        side: PrintSide;
        element: ActiveElementType;
        textId?: string;
    } | null>(null);

    const selectedColorFile = shirtConfig?.colorFile || "white";

    const galleryImages: { side: PrintSide; src: string; alt: string }[] = [
        {
            side: "front",
            src: `/tshirts/${selectedColorFile}.png`,
            alt: "T-Shirt Vorderseite",
        },
        {
            side: "back",
            src: "/tshirts/white-back.png",
            alt: "T-Shirt Rückseite",
        },
        {
            side: "side-left",
            src: "/tshirts/white-side-left.png",
            alt: "Linker Ärmel",
        },
        {
            side: "side-right",
            src: "/tshirts/white-side-right.png",
            alt: "Rechter Ärmel",
        },
        {
            side: "detail",
            src: "/tshirts/white-detail.png",
            alt: "T-Shirt Detailansicht",
        },
    ];

    const selectedSide = galleryImages[selectedGalleryIndex].side;
    const selectedPrintArea = printAreas[selectedSide];
    const selectedDesign = designs[selectedSide] || { texts: [] };

    const activeText =
        selectedDesign.texts.find((text) => text.id === activeTextId) || null;

    useEffect(() => {
        const savedConfig = localStorage.getItem("tshirtConfig");

        if (savedConfig) {
            const parsedConfig: ShirtConfig = JSON.parse(savedConfig);
            setShirtConfig(parsedConfig);

            if (parsedConfig.text) {
                const id = crypto.randomUUID();

                setDesigns({
                    front: {
                        texts: [
                            {
                                id,
                                text: parsedConfig.text,
                                x: 50,
                                y: 50,
                                fontSize: 18,
                                color: "#facc15",
                                font: "Arial, sans-serif",
                                rotate: 0,
                                bend: 0,
                            },
                        ],
                    },
                });

                setActiveTextId(id);
            }
        }
    }, []);

    function getSideDesign(side: PrintSide): SideDesign {
        return designs[side] || { texts: [] };
    }

    function updateSideDesign(side: PrintSide, newDesign: SideDesign) {
        setDesigns((prev) => ({
            ...prev,
            [side]: newDesign,
        }));
    }

    function handleImageUpload(
        event: React.ChangeEvent<HTMLInputElement>,
        side: PrintSide
    ) {
        const file = event.target.files?.[0];
        if (!file) return;

        const current = getSideDesign(side);

        updateSideDesign(side, {
            ...current,
            image: {
                src: URL.createObjectURL(file),
                x: 50,
                y: 50,
                width: printAreas[side].defaultWidth,
            },
        });

        setSelectedGalleryIndex(
            galleryImages.findIndex((item) => item.side === side)
        );
        setActiveElement("image");
        event.target.value = "";
    }

    function addText(side: PrintSide) {
        const id = crypto.randomUUID();
        const current = getSideDesign(side);

        const newText: DesignText = {
            id,
            text: "Dein Text",
            x: 50,
            y: 50,
            fontSize: 18,
            color: "#111111",
            font: "Arial, sans-serif",
            rotate: 0,
            bend: 0,
        };

        updateSideDesign(side, {
            ...current,
            texts: [...current.texts, newText],
        });

        setActiveElement("text");
        setActiveTextId(id);
    }

    function updateImage(changes: Partial<DesignImage>) {
        const current = getSideDesign(selectedSide);
        if (!current.image) return;

        updateSideDesign(selectedSide, {
            ...current,
            image: {
                ...current.image,
                ...changes,
            },
        });
    }

    function updateActiveText(changes: Partial<DesignText>) {
        if (!activeTextId) return;

        const current = getSideDesign(selectedSide);

        updateSideDesign(selectedSide, {
            ...current,
            texts: current.texts.map((text) =>
                text.id === activeTextId ? { ...text, ...changes } : text
            ),
        });
    }

    function removeActiveElement() {
        const current = getSideDesign(selectedSide);

        if (activeElement === "image") {
            updateSideDesign(selectedSide, {
                ...current,
                image: undefined,
            });
        }

        if (activeElement === "text" && activeTextId) {
            updateSideDesign(selectedSide, {
                ...current,
                texts: current.texts.filter((text) => text.id !== activeTextId),
            });

            setActiveTextId(null);
        }
    }

    function handlePointerDown(
        event: React.PointerEvent,
        side: PrintSide,
        element: ActiveElementType,
        textId?: string
    ) {
        event.preventDefault();
        event.stopPropagation();

        setActiveElement(element);

        if (textId) {
            setActiveTextId(textId);
        }

        setDragData({ side, element, textId });
    }

    function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
        if (!dragData) return;

        const rect = event.currentTarget.getBoundingClientRect();

        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        const cleanX = Math.min(95, Math.max(5, x));
        const cleanY = Math.min(95, Math.max(5, y));

        const current = getSideDesign(dragData.side);

        if (dragData.element === "image" && current.image) {
            updateSideDesign(dragData.side, {
                ...current,
                image: {
                    ...current.image,
                    x: cleanX,
                    y: cleanY,
                },
            });
        }

        if (dragData.element === "text" && dragData.textId) {
            updateSideDesign(dragData.side, {
                ...current,
                texts: current.texts.map((text) =>
                    text.id === dragData.textId
                        ? { ...text, x: cleanX, y: cleanY }
                        : text
                ),
            });
        }
    }

    function handlePointerUp() {
        setDragData(null);
    }

    function handleAddToCart() {
        if (!shirtConfig) {
            alert("T-Shirt Daten wurden nicht gefunden.");
            return;
        }

        const cartItem: CartItem = {
            id: Date.now(),
            productId: shirtConfig.productId,
            productName: shirtConfig.productName,
            color: shirtConfig.color,
            colorFile: shirtConfig.colorFile,
            size: shirtConfig.size,
            price: shirtConfig.price,
            quantity: 1,
            designData: designs,
        };

        const existingCart = localStorage.getItem("cart");
        const cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

        cart.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(cart));

        router.push("/warenkorb");
    }

    if (!shirtConfig) {
        return (
            <main className="designPage">
                <h1>Keine T-Shirt Daten gefunden</h1>
                <Link href="/t-shirt" className="topCartButton">
                    Zurück
                </Link>
            </main>
        );
    }

    return (
        <main className="designPage">
            <div className="designTopBar">
                <h1>Online Designer</h1>

                <Link href="/warenkorb" className="topCartButton">
                    Zum Warenkorb
                </Link>
            </div>

            <div className="designLayout">
                <section className="controlPanel">
                    <div className="designerSection">
                        <h2>Seite auswählen</h2>

                        <div className="sideTabs">
                            {galleryImages
                                .filter((item) => item.side !== "detail")
                                .map((item, index) => (
                                    <button
                                        key={item.side}
                                        type="button"
                                        className={
                                            selectedGalleryIndex === index ? "activeSideTab" : ""
                                        }
                                        onClick={() => setSelectedGalleryIndex(index)}
                                    >
                                        {sideLabels[item.side]}
                                    </button>
                                ))}
                        </div>
                    </div>

                    <div className="designerSection">
                        <h2>Bild hochladen</h2>

                        <label className="designerUploadBox">
                            Datei auswählen
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(event) => handleImageUpload(event, selectedSide)}
                            />
                        </label>
                    </div>

                    <div className="designerSection">
                        <h2>Texte hinzufügen und bearbeiten</h2>

                        <button
                            type="button"
                            className="secondaryButton"
                            onClick={() => addText(selectedSide)}
                        >
                            Text hinzufügen
                        </button>

                        <p className="designerHint">
                            Sie können mehrere Texte hinzufügen. Klicken Sie auf einen Text im
                            T-Shirt oder in der Liste, um ihn zu bearbeiten.
                        </p>

                        {selectedDesign.texts.length > 0 && (
                            <div className="textList">
                                {selectedDesign.texts.map((text, index) => (
                                    <button
                                        key={text.id}
                                        type="button"
                                        className={`textListItem ${
                                            activeTextId === text.id ? "activeTextListItem" : ""
                                        }`}
                                        onClick={() => {
                                            setActiveElement("text");
                                            setActiveTextId(text.id);
                                        }}
                                    >
                                        Text {index + 1}: {text.text}
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeText && (
                            <>
                <textarea
                    value={activeText.text}
                    onChange={(e) => updateActiveText({ text: e.target.value })}
                    placeholder="Schreib deinen Text hier"
                />

                                <label>Schriftart</label>
                                <select
                                    value={activeText.font}
                                    onChange={(e) => updateActiveText({ font: e.target.value })}
                                >
                                    {fontOptions.map((font) => (
                                        <option key={font.value} value={font.value}>
                                            {font.label}
                                        </option>
                                    ))}
                                </select>

                                <label>Schriftgröße: {activeText.fontSize}</label>
                                <input
                                    className="customSlider"
                                    type="range"
                                    min="8"
                                    max="48"
                                    value={activeText.fontSize}
                                    onChange={(e) =>
                                        updateActiveText({ fontSize: Number(e.target.value) })
                                    }
                                />

                                <label>Drehung: {activeText.rotate}°</label>
                                <input
                                    className="customSlider"
                                    type="range"
                                    min="-180"
                                    max="180"
                                    value={activeText.rotate}
                                    onChange={(e) =>
                                        updateActiveText({ rotate: Number(e.target.value) })
                                    }
                                />

                                <label>Biegen: {activeText.bend}</label>
                                <input
                                    className="customSlider"
                                    type="range"
                                    min="-160"
                                    max="160"
                                    value={activeText.bend}
                                    onChange={(e) =>
                                        updateActiveText({ bend: Number(e.target.value) })
                                    }
                                />

                                <label>Text Farbe</label>
                                <input
                                    type="color"
                                    value={activeText.color}
                                    onChange={(e) => updateActiveText({ color: e.target.value })}
                                    className="normalColorInput"
                                />
                            </>
                        )}
                    </div>

                    {activeElement === "image" && selectedDesign.image && (
                        <div className="designerSection">
                            <h2>Bild bearbeiten</h2>

                            <label>Bildgröße: {selectedDesign.image.width}%</label>
                            <input
                                className="customSlider"
                                type="range"
                                min={selectedPrintArea.minWidth}
                                max={selectedPrintArea.maxWidth}
                                value={selectedDesign.image.width}
                                onChange={(e) => updateImage({ width: Number(e.target.value) })}
                            />

                            <button
                                type="button"
                                className="removeDesignerButton"
                                onClick={removeActiveElement}
                            >
                                Bild entfernen
                            </button>
                        </div>
                    )}

                    {activeElement === "text" && activeText && (
                        <div className="designerSection">
                            <h2>Text entfernen</h2>

                            <button
                                type="button"
                                className="removeDesignerButton"
                                onClick={removeActiveElement}
                            >
                                Text entfernen
                            </button>
                        </div>
                    )}

                    <button className="cartButton" onClick={handleAddToCart}>
                        Zum Warenkorb hinzufügen
                    </button>
                </section>

                <section className="previewPanel">
                    <div className="designerPreview">
                        <div className="shirtStage">
                            <img
                                src={galleryImages[selectedGalleryIndex].src}
                                alt={galleryImages[selectedGalleryIndex].alt}
                                className="designerTshirtImage"
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
                                    {selectedDesign.image && (
                                        <img
                                            src={selectedDesign.image.src}
                                            alt="Design"
                                            className={`designerObject ${
                                                activeElement === "image" ? "activeDesignerObject" : ""
                                            }`}
                                            onPointerDown={(event) =>
                                                handlePointerDown(event, selectedSide, "image")
                                            }
                                            style={{
                                                width: `${selectedDesign.image.width}%`,
                                                left: `${selectedDesign.image.x}%`,
                                                top: `${selectedDesign.image.y}%`,
                                            }}
                                        />
                                    )}

                                    {selectedDesign.texts.map((text) => (
                                        <div
                                            key={text.id}
                                            className={`designerText ${
                                                activeElement === "text" && activeTextId === text.id
                                                    ? "activeDesignerObject"
                                                    : ""
                                            }`}
                                            onPointerDown={(event) =>
                                                handlePointerDown(event, selectedSide, "text", text.id)
                                            }
                                            style={{
                                                left: `${text.x}%`,
                                                top: `${text.y}%`,
                                                color: text.color,
                                                fontSize: `${text.fontSize}px`,
                                                fontFamily: text.font,
                                                transform: `translate(-50%, -50%) rotate(${text.rotate}deg)`,
                                            }}
                                        >
                                            <ArcText text={text} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}