"use client";
import { useState, useRef, useEffect } from "react";

function drawArcText(ctx, text, centerX, baseY, radius, isTop = true) {
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

function getTextPosition(canvas, position) {
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
    const [designText, setDesignText] = useState(""); // النص المدخل
    const [font, setFont] = useState("sans-serif");
    const [position, setPosition] = useState("center");
    const [rotate, setRotate] = useState(0);
    const [textColor, setTextColor] = useState("#facc15"); // اللون الافتراضي للنص
    const canvasRef = useRef(null); // لإشارة إلى الـ canvas
    const [bend, setBend] = useState(0); // انحناء النص

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const shirtImage = new Image();
        shirtImage.src = "/tshirts/white.png";

        shirtImage.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(shirtImage, 0, 0, canvas.width, canvas.height);

            if (!designText.trim()) return;

            ctx.font = `bold 28px ${font}`;
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
    }, [designText, font, position, rotate, textColor, bend]);
    // دالة لاختيار اللون
    const colorOptions = [
        "#facc15", "#000000", "#ffffff", "#dc2626",
        "#2563eb", "#187532", "#c6d659", "#00a6a2",
        "#bbd4ee", "#852638", "#dd004e", "#696142",
        "#ff5f2e", "#6a6967"
    ];

    return (
        <div className="designPage">
            <h1>Design dein T-Shirt</h1>

            <div className="designLayout">
                {/* القسم اليسار */}
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
                        <select onChange={(e) => setFont(e.target.value)} value={font}>
                            <option value="sans-serif">Sans Serif</option>
                            <option value="serif">Serif</option>
                            <option value="monospace">Monospace</option>
                        </select>
                    </div>

                    <div className="positionSelection">
                        <label>Position</label>
                        <select onChange={(e) => setPosition(e.target.value)} value={position}>
                            <option value="center">Zentrum</option>
                            <option value="top-left">Oben links</option>
                            <option value="top-right">Oben rechts</option>
                            <option value="bottom-left">Unten links</option>
                            <option value="bottom-right">Unten rechts</option>
                        </select>
                    </div>

                    <div className="rotationSelection">
                        <label>Drehung</label>
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
                        <label>Biegen</label>
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
                        <div className="colorGrid">
                            {colorOptions.map((color, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    style={{ backgroundColor: color }}
                                    className="colorButton"
                                    onClick={() => setTextColor(color)}
                                />
                            ))}
                        </div>
                    </div>

                    <button className="cartButton">
                        Zum Warenkorb hinzufügen
                    </button>
                </div>

                {/* القسم اليمين */}
                <div className="previewPanel">
                    <div className="tshirtPreview">
                        <canvas
                            ref={canvasRef}
                            width={500}
                            height={500}
                            style={{ border: "1px solid #ddd", backgroundColor: "#fff" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}