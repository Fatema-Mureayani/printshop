"use client";

import { useEffect, useState } from "react";

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
    quantity?: number;
};

export default function WarenkorbPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

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

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * (item.quantity ?? 1),
        0
    );

    async function submitOrder() {
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

        try {
            for (const item of cart) {
                const orderData = {
                    productId: item.productId,
                    productName: item.productName,
                    color: item.color,
                    size: item.size,
                    customText: item.customText,
                    description: item.description,
                    font: item.font,
                    fontSize: item.fontSize,
                    textColor: item.textColor,
                    position: item.position,
                    rotate: item.rotate,
                    bend: item.bend,
                    price: item.price * (item.quantity ?? 1),
                    quantity: item.quantity ?? 1,

                    customerName: customerName,
                    customerEmail: customerEmail,
                    customerPhone: customerPhone,

                    status: "Pending",
                };

                const res = await fetch("http://localhost:5098/api/Orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderData),
                });

                if (!res.ok) {
                    throw new Error("Fehler beim Senden der Bestellung");
                }
            }

            localStorage.removeItem("cart");
            setCart([]);

            setCustomerName("");
            setCustomerEmail("");
            setCustomerPhone("");

            alert("Bestellung wurde erfolgreich abgeschickt");
        } catch (error) {
            console.error(error);
            alert("Fehler beim Abschicken der Bestellung");
        }
    }

    return (
        <main className="cartPage">
            <h1>Warenkorb</h1>

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
                                    src={item.previewImage}
                                    alt="T-Shirt Vorschau"
                                    className="cartPreviewImage"
                                />

                                <div className="cartItemInfo">
                                    <h3>{item.productName}</h3>

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
                            <button className="submitOrderButton" onClick={submitOrder}>
                                Bestellung abschicken
                            </button>

                            <button className="clearCartButton" onClick={clearCart}>
                                Warenkorb leeren
                            </button>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}