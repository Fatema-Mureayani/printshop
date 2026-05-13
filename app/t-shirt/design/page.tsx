"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type ShirtConfig = {
    productId: number;
    productName: string;
    color: string;
    colorFile: string;
    size: string;
    text: string;
    description: string;
    price: number;
};

type CartItem = {
    id: number;
    productId: number;
    productName: string;
    color: string;
    colorFile: string;
    size: string;
    customText: string;
    description: string;
    font: string;
    fontSize: number;
    textColor: string;
    position: string;
    rotate: number;
    bend: number;
    price: number;
    previewImage: string;
};

function drawArcText(
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    baseY: number,
    radius: number,
    isTop = true
) {
    const chars = [...text];
    const spacing = 2;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const widths = chars.map((char) => ctx.measureText(char).width + spacing);
    const totalAngle = widths.reduce((sum, w) => sum + w / radius, 0);

    let currentAngle = -totalAngle / 2;

    chars.forEach((char, i) => {
        const charAngle = widths[i] / radius;
        const angle = currentAngle + charAngle / 2;

        const x = centerX + radius * Math.sin(angle);
        const y = isTop
            ? baseY + radius - radius * Math.cos(angle)
            : baseY - radius + radius * Math.cos(angle);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(isTop ? angle : -angle);
        ctx.fillText(char, 0, 0);
        ctx.restore();

        currentAngle += charAngle;
    });
}

function getTextPosition(canvas: HTMLCanvasElement, position: string) {
    switch (position) {
        case "top-left":
            return { x: 120, y: 120 };
        case "top-right":
            return { x: canvas.width - 120, y: 120 };
        case "bottom-left":
            return { x: 120, y: canvas.height - 120 };
        case "bottom-right":
            return { x: canvas.width - 120, y: canvas.height - 120 };
        default:
            return { x: canvas.width / 2, y: canvas.height / 2 };
    }
}

export default function DesignPage() {
    const [designText, setDesignText] = useState("");
    const [font, setFont] = useState("sans-serif");
    const [position, setPosition] = useState("center");
    const [rotate, setRotate] = useState(0);
    const [textColor, setTextColor] = useState("#facc15");
    const [bend, setBend] = useState(0);
    const [fontSize, setFontSize] = useState(28);

    const [shirtConfig, setShirtConfig] = useState<ShirtConfig | null>(null);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // هنا نقرأ بيانات التيشيرت المختار من صفحة /t-shirt
    useEffect(() => {
        const savedConfig = localStorage.getItem("tshirtConfig");

        if (savedConfig) {
            const parsedConfig: ShirtConfig = JSON.parse(savedConfig);

            setShirtConfig(parsedConfig);

            if (parsedConfig.text) {
                setDesignText(parsedConfig.text);
            }
        }
    }, []);

    // هنا نرسم التيشيرت والنص على canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const shirtImage = new Image();

        shirtImage.src = shirtConfig?.colorFile
            ? `/tshirts/${shirtConfig.colorFile}.png`
            : "/tshirts/white.png";

        shirtImage.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(shirtImage, 0, 0, canvas.width, canvas.height);

            if (!designText.trim()) return;

            ctx.font = `bold ${fontSize}px ${font}`;
            ctx.fillStyle = textColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const { x, y } = getTextPosition(canvas, position);

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((rotate * Math.PI) / 180);

            if (bend === 0) {
                ctx.fillText(designText, 0, 0);
            } else {
                const isTop = bend > 0;
                const absBend = Math.abs(bend);
                const radius = Math.max(80, 280 - absBend);

                drawArcText(ctx, designText, 0, 0, radius, isTop);
            }

            ctx.restore();
        };
    }, [
        designText, font, position, rotate, textColor, bend, fontSize, shirtConfig]);

    function handleAddToCart() {
        const canvas = canvasRef.current;

        if (!canvas) {
            alert("Canvas wurde nicht gefunden");
            return;
        }

        if (!shirtConfig) {
            alert("T-Shirt Daten wurden nicht gefunden");
            return;
        }

        const previewImage = canvas.toDataURL("image/png");

        const cartItem: CartItem = {
            id: Date.now(),
            productId: shirtConfig.productId,
            productName: shirtConfig.productName,
            color: shirtConfig.color,
            colorFile: shirtConfig.colorFile,
            size: shirtConfig.size,
            customText: designText,
            description: shirtConfig.description,
            font: font,
            fontSize: fontSize,
            textColor: textColor,
            position: position,
            rotate: rotate,
            bend: bend,
            price: shirtConfig.price,
            previewImage: previewImage,
            quantity: 1
        };

        const existingCart = localStorage.getItem("cart");
        const cart: CartItem[] = existingCart ? JSON.parse(existingCart) : [];

        cart.push(cartItem);

        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Produkt wurde zum Warenkorb hinzugefügt");
    }

    return (
        <div className="designPage">
            <div className="designTopBar">
                <h1>Design dein T-Shirt</h1>

                <Link href="/warenkorb" className="topCartButton">
                    Zum Warenkorb
                </Link>
            </div>


            <div className="designLayout">
                <div className="controlPanel">
                    <div className="textInput">
                        <label>Text</label>
                        <textarea
                            value={designText}
                            onChange={(e) => setDesignText(e.target.value)}
                            placeholder="Schreib deinen Text hier"
                        />
                    </div>

                    <div className="fontSelection">
                        <label>Schriftart</label>
                        <select
                            onChange={(e) => setFont(e.target.value)}
                            value={font}
                        >
                            <option value="sans-serif">Sans Serif</option>
                            <option value="serif">Serif</option>
                            <option value="monospace">Monospace</option>
                        </select>
                    </div>

                    <div className="fontSizeSelection">
                        <label>Schriftgröße: {fontSize}px</label>
                        <input
                            className="customSlider"
                            type="range"
                            min="12"
                            max="80"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                        />
                    </div>

                    <div className="positionSelection">
                        <label>Position</label>
                        <select
                            onChange={(e) => setPosition(e.target.value)}
                            value={position}
                        >
                            <option value="center">Zentrum</option>
                            <option value="top-left">Oben links</option>
                            <option value="top-right">Oben rechts</option>
                            <option value="bottom-left">Unten links</option>
                            <option value="bottom-right">Unten rechts</option>
                        </select>
                    </div>

                    <div className="rotationSelection">
                        <label>Drehung: {rotate}°</label>
                        <input
                            className="customSlider"
                            type="range"
                            min="0"
                            max="360"
                            value={rotate}
                            onChange={(e) => setRotate(Number(e.target.value))}
                        />
                    </div>

                    <div className="bendSelection">
                        <label>Biegen: {bend}</label>
                        <input
                            className="customSlider"
                            type="range"
                            min="-180"
                            max="180"
                            value={bend}
                            onChange={(e) => setBend(Number(e.target.value))}
                        />
                    </div>

                    <div className="colorSelection">
                        <label>Text Farbe</label>

                        <label className="colorPickerIcon">
                            <span className="pickerSymbol">🖌</span>

                            <input
                                type="color"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                                className="hiddenColorInput"
                            />
                        </label>

                        <span className="selectedColorText">{textColor}</span>
                    </div>

                    <button className="cartButton" onClick={handleAddToCart}>
                        Zum Warenkorb hinzufügen
                    </button>
                </div>

                <div className="previewPanel">
                    <div className="tshirtPreview">
                        <canvas
                            ref={canvasRef}
                            width={500}
                            height={500}
                            style={{
                                border: "1px solid #ddd",
                                backgroundColor: "#fff"
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}