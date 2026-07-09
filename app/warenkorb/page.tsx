"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
    id: number;
    productId: number;
    productName: string;
    color: string;
    colorFile: string;
    size: string;
    customText: string;
    description: string;
    druckdatenOption?: string;
    druckdatenFileName?: string;
    druckdatenFileUrl?: string;
    designWishes?: string;
    designerPreviewFront?: string;
    designerPreviewBack?: string;
    designerJson?: string;
    designData?: unknown; // t-shirt
    designs?: unknown;  // t-shirt
    font: string;
    fontSize: number;
    textColor: string;
    position: string;
    rotate: number;
    bend: number;
    price: number;
    previewImage: string;
    quantity?: number;
};

export default function WarenkorbPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // حماية من الضغط مرتين. لازم نضيف isSubmitting

    useEffect(() => {
        const savedCart = localStorage.getItem("cart");

        if (savedCart) {
            const parsedCart: CartItem[] = JSON.parse(savedCart);

            const cartWithQuantity = parsedCart.map((item) => ({
                ...item,
                quantity: item.quantity ?? 1,
            }));

            setCart(cartWithQuantity);
            localStorage.setItem("cart", JSON.stringify(cartWithQuantity));
        }
    }, []);

    function removeItem(id: number) {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    function updateQuantity(id: number, type: "increase" | "decrease") {
        const updatedCart = cart.map((item) => {
            if (item.id !== id) return item;

            const currentQuantity = item.quantity ?? 1;

            const newQuantity =
                type === "increase"
                    ? currentQuantity + 1
                    : Math.max(1, currentQuantity - 1);

            return {
                ...item,
                quantity: newQuantity,
            };
        });

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    function clearCart() {
        setCart([]);
        localStorage.removeItem("cart");
    }

    function leaveCart() {
        router.push("/");
    }

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * (item.quantity ?? 1),
        0
    );

    async function submitOrder() {
        if (isSubmitting) return;

        if (cart.length === 0) {
            alert("Der Warenkorb ist leer");
            return;
        }

        if (!customerName.trim()) {
            alert("Bitte geben Sie Ihren Namen ein");
            return;
        }

        if (!customerEmail.trim()) {
            alert("Bitte geben Sie Ihre E-Mail-Adresse ein");
            return;
        }

        if (!customerEmail.includes("@")) {
            alert("Bitte geben Sie eine gültige E-Mail-Adresse ein");
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                customerName: customerName,
                customerEmail: customerEmail,
                customerPhone: customerPhone,

                items: cart.map((item) => ({
                    productId: item.productId,
                    productName: item.productName,
                    color: item.color,
                    size: item.size,
                    customText: item.customText,
                    description: item.description,
                    druckdatenOption: item.druckdatenOption,
                    druckdatenFileName: item.druckdatenFileName,
                    druckdatenFileUrl: item.druckdatenFileUrl,
                    designWishes: item.designWishes,
                    designerPreviewFront: item.designerPreviewFront,
                    designerPreviewBack: item.designerPreviewBack,
                    designerJson: item.designerJson ?? JSON.stringify(item.designs ?? {}),
                    font: item.font,
                    fontSize: item.fontSize,
                    textColor: item.textColor,
                    position: item.position,
                    rotate: item.rotate,
                    bend: item.bend,
                    price: item.price,
                    quantity: item.quantity ?? 1,
                })),
            };

            const res = await fetch("http://localhost:5098/api/Orders/group", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            if (!res.ok) {
                throw new Error("Fehler beim Senden der Bestellung");
            }

            localStorage.removeItem("cart");
            setCart([]);

            setCustomerName("");
            setCustomerEmail("");
            setCustomerPhone("");

            setSuccessMessage(
                "Ihre Bestellung wurde erfolgreich abgeschickt. Sie werden in 5 Sekunden zur Startseite weitergeleitet."
            );

            setTimeout(() => {
                router.push("/");
            }, 5000);
        } catch (error) {
            console.error(error);
            alert("Fehler beim Abschicken der Bestellung");
            setIsSubmitting(false);
        }
    }

    return (
        <main className="cartPage">
            <div className="cartHeader">
                <h1>Warenkorb</h1>

                <button className="leaveCartButton" onClick={leaveCart}>
                    Warenkorb verlassen
                </button>
            </div>

            {successMessage && (
                <div className="successMessage">
                    {successMessage}
                </div>
            )}

            {cart.length === 0 ? (
                <div className="infoBox">
                    <p>Ihr Warenkorb ist momentan leer.</p>
                </div>
            ) : (
                <>
                    <div className="cartList">
                        {cart.map((item) => (
                            <div key={item.id} className="cartItem">
                                <img
                                    src={
                                        item.designerPreviewFront
                                            ? `http://localhost:5098${item.designerPreviewFront}`
                                            : item.previewImage
                                    }
                                    alt="T-Shirt Vorschau"
                                    className="cartPreviewImage"
                                />

                                <div className="cartItemInfo">
                                    <h3>{item.productName}</h3>

                                    {item.productName === "Visitenkarten" ? (
                                        <>
                                            <p>
                                                <strong>Seiten:</strong> {item.color}
                                            </p>

                                            <p>
                                                <strong>Menge:</strong> {item.size}
                                            </p>

                                            <p>
                                                <strong>Format:</strong> {item.customText}
                                            </p>

                                            <p style={{ whiteSpace: "pre-line" }}>
                                                <strong>Details:</strong>
                                                <br />
                                                {item.description || "-"}
                                            </p>

                                            {item.druckdatenOption && (
                                                <p>
                                                    <strong>Druckdaten:</strong> {item.druckdatenOption}
                                                </p>
                                            )}

                                            {item.druckdatenFileName && (
                                                <p>
                                                    <strong>Datei:</strong> {item.druckdatenFileName}
                                                </p>
                                            )}

                                            {item.druckdatenFileUrl && (
                                                <p>
                                                    <strong>Datei-Link:</strong>{" "}
                                                    <a
                                                        href={`http://localhost:5098${item.druckdatenFileUrl}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Druckdatei öffnen
                                                    </a>
                                                </p>
                                            )}

                                            {item.designWishes && (
                                                <p>
                                                    <strong>Designwünsche:</strong> {item.designWishes}
                                                </p>
                                            )}

                                            {item.designerPreviewFront && (
                                                <>
                                                    <p><strong>Vorderseite:</strong></p>

                                                    <img
                                                        src={`http://localhost:5098${item.designerPreviewFront}`}
                                                        alt="Vorderseite"
                                                        style={{
                                                            width: 220,
                                                            border: "1px solid #ddd",
                                                            borderRadius: 8,
                                                            marginBottom: 12,
                                                        }}
                                                    />
                                                </>
                                            )}

                                            {item.designerPreviewBack && (
                                                <>
                                                    <p><strong>Rückseite:</strong></p>

                                                    <img
                                                        src={`http://localhost:5098${item.designerPreviewBack}`}
                                                        alt="Rückseite"
                                                        style={{
                                                            width: 220,
                                                            border: "1px solid #ddd",
                                                            borderRadius: 8,
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <p>
                                                <strong>Farbe:</strong> {item.color}
                                            </p>

                                            <p>
                                                <strong>Größe:</strong> {item.size}
                                            </p>

                                            <p>
                                                <strong>Text:</strong> {item.customText || "-"}
                                            </p>

                                            <p>
                                                <strong>Beschreibung:</strong>{" "}
                                                {item.description || "-"}
                                            </p>
                                        </>
                                    )}

                                    <p>
                                        <strong>Preis:</strong> {item.price.toFixed(2)} €
                                    </p>

                                    <div className="quantityBox">
                                        <span className="quantityLabel">Menge:</span>

                                        <div className="quantityControl">
                                            <span className="quantityNumber">{item.quantity ?? 1}</span>

                                            <div className="quantityButtons">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, "increase")}
                                                >
                                                    ▲
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, "decrease")}
                                                >
                                                    ▼
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className="removeCartButton"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        Entfernen
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="customerForm">
                        <h2>Kundendaten</h2>

                        <div className="customerInputGroup">
                            <label>Vor- und Nachname</label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Max Mustermann"
                            />
                        </div>

                        <div className="customerInputGroup">
                            <label>E-Mail</label>
                            <input
                                type="email"
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                placeholder="ihre.email@example.com"
                            />
                        </div>

                        <div className="customerInputGroup">
                            <label>Telefon</label>
                            <input
                                type="text"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                placeholder="Ihre Telefonnummer"
                            />
                        </div>
                    </div>

                    <div className="cartSummary">
                        <h2>Gesamtpreis: {totalPrice.toFixed(2)} €</h2>

                        <div className="cartSummaryButtons">
                            <button
                                type="button"
                                className="submitOrderButton"
                                onClick={submitOrder}
                                disabled={isSubmitting} //يمنع أن الطلب ينرسل مرتين إذا ضغط المستخدم مرتين بسرعة
                            >
                                {isSubmitting ? "Bestellung wird gesendet..." : "Bestellung abschicken"}
                            </button>

                            <button
                                type="button"
                                className="clearCartButton"
                                onClick={clearCart}
                                disabled={isSubmitting}
                            >
                                Warenkorb leeren
                            </button>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}
