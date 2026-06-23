"use client";

import { useEffect, useState } from "react";

type Order = {
    id: number;
    orderGroupId: string;
    productId: number;
    productName: string;
    color: string;
    size: string;
    customText: string | null;
    description: string | null;
    druckdatenOption: string | null;
    druckdatenFileName: string | null;
    druckdatenFileUrl: string | null;
    designWishes: string | null;
    font: string | null;
    fontSize: number;
    textColor: string | null;
    position: string | null;
    rotate: number;
    bend: number;
    price: number;
    quantity: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string | null;
    status: string;
    createdAt: string;
};

type OrderGroup = {
    orderGroupId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string | null;
    status: string;
    createdAt: string;
    totalPrice: number;
    totalQuantity: number;
    items: Order[];
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [openGroupId, setOpenGroupId] = useState<string | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        try {
            const res = await fetch("http://localhost:5098/api/Orders");

            if (!res.ok) {
                throw new Error("Fehler beim Laden der Bestellungen");
            }

            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error(error);
            alert("Bestellungen konnten nicht geladen werden");
        } finally {
            setLoading(false);
        }
    }

    function groupOrdersByOrderGroupId(orders: Order[]): OrderGroup[] {
        const grouped: Record<string, OrderGroup> = {};

        orders.forEach((order) => {
            const groupId = order.orderGroupId || `OLD-${order.id}`;

            if (!grouped[groupId]) {
                grouped[groupId] = {
                    orderGroupId: groupId,
                    customerName: order.customerName,
                    customerEmail: order.customerEmail,
                    customerPhone: order.customerPhone,
                    status: order.status,
                    createdAt: order.createdAt,
                    totalPrice: 0,
                    totalQuantity: 0,
                    items: [],
                };
            }

            grouped[groupId].items.push(order);
            grouped[groupId].totalPrice += Number(order.price);
            grouped[groupId].totalQuantity += order.quantity ?? 1;
        });

        return Object.values(grouped).sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }

    async function updateOrderGroupStatus(
        orderGroupId: string,
        action: "confirm" | "reject"
    ) {
        try {
            const actionText = action === "confirm" ? "bestätigen" : "ablehnen";

            const confirmed = window.confirm(
                `Möchten Sie diese Bestellung wirklich ${actionText}? Danach kann der Status nicht erneut geändert werden.`
            );

            if (!confirmed) return;

            const res = await fetch(
                `http://localhost:5098/api/Orders/group/${orderGroupId}/${action}`,
                {
                    method: "PUT",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || data.Message || "Status konnte nicht geändert werden");
                return;
            }

            alert(data.message || data.Message || "Status wurde erfolgreich geändert");

            await loadOrders();
        } catch (error) {
            console.error(error);
            alert("Fehler beim Ändern des Status");
        }
    }

    async function deleteOrderGroup(orderGroupId: string) {
        const confirmed = window.confirm(
            "Möchten Sie diese komplette Bestellung wirklich löschen?"
        );

        if (!confirmed) return;

        try {
            const res = await fetch(
                `http://localhost:5098/api/Orders/group/${orderGroupId}`,
                {
                    method: "DELETE",
                }
            );

            if (!res.ok) {
                throw new Error("Bestellung konnte nicht gelöscht werden");
            }

            setOrders((prevOrders) =>
                prevOrders.filter((order) => order.orderGroupId !== orderGroupId)
            );
        } catch (error) {
            console.error(error);
            alert("Fehler beim Löschen der Bestellung");
        }
    }

    const groupedOrders = groupOrdersByOrderGroupId(orders);

    if (loading) {
        return (
            <main className="adminOrdersPage">
                <h1>Bestellungen</h1>
                <p className="adminLoadingText">Bestellungen werden geladen...</p>
            </main>
        );
    }

    return (
        <main className="adminOrdersPage">
            <h1>Bestellungen</h1>

            {groupedOrders.length === 0 ? (
                <p className="adminEmptyText">Keine Bestellungen vorhanden.</p>
            ) : (
                <div className="adminOrdersList">
                    {groupedOrders.map((group) => {
                        const isOpen = openGroupId === group.orderGroupId;

                        return (
                            <div key={group.orderGroupId} className="adminOrderCard">
                                <div
                                    className="adminOrderSummary"
                                    onClick={() =>
                                        setOpenGroupId(isOpen ? null : group.orderGroupId)
                                    }
                                >
                                    <div className="adminOrderMainInfo">
                                        <h2>Bestellung {group.orderGroupId}</h2>

                                        <p>
                                            {group.customerName || "Kein Name"} ·{" "}
                                            {group.totalPrice.toFixed(2)} € · Produkte:{" "}
                                            {group.items.length} · Menge:{" "}
                                            {group.totalQuantity}
                                        </p>
                                    </div>

                                    <div className="adminOrderRightSide">
                                        <span
                                            className={`orderStatus ${getStatusClass(
                                                group.status
                                            )}`}
                                        >
                                            {group.status}
                                        </span>

                                        <span className="accordionIcon">
                                            {isOpen ? "▲" : "▼"}
                                        </span>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="adminOrderDetails">
                                        <div className="adminOrderGrid">
                                            <div className="adminDetailBox">
                                                <h3>Kundendaten</h3>
                                                <p>
                                                    <strong>Name:</strong>{" "}
                                                    {group.customerName || "-"}
                                                </p>
                                                <p>
                                                    <strong>E-Mail:</strong>{" "}
                                                    {group.customerEmail || "-"}
                                                </p>
                                                <p>
                                                    <strong>Telefon:</strong>{" "}
                                                    {group.customerPhone || "-"}
                                                </p>
                                                <p>
                                                    <strong>Bestellnummer:</strong>{" "}
                                                    {group.orderGroupId}
                                                </p>
                                            </div>

                                            <div className="adminDetailBox">
                                                <h3>Zusammenfassung</h3>
                                                <p>
                                                    <strong>Produkte:</strong>{" "}
                                                    {group.items.length}
                                                </p>
                                                <p>
                                                    <strong>Gesamtmenge:</strong>{" "}
                                                    {group.totalQuantity}
                                                </p>
                                                <p>
                                                    <strong>Gesamtpreis:</strong>{" "}
                                                    {group.totalPrice.toFixed(2)} €
                                                </p>
                                                <p>
                                                    <strong>Status:</strong> {group.status}
                                                </p>
                                            </div>

                                            <div className="adminDetailBox">
                                                <h3>Datum</h3>
                                                <p>
                                                    <strong>Erstellt am:</strong>{" "}
                                                    {new Date(
                                                        group.createdAt
                                                    ).toLocaleString("de-DE")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="adminProductsSection">
                                            <h3>Produkte dieser Bestellung</h3>

                                            <div className="adminProductsList">
                                                {group.items.map((item, index) => {
                                                    const isVisitenkarte = item.productName === "Visitenkarten";

                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className="adminProductItem"
                                                        >
                                                            <h4>
                                                                {isVisitenkarte
                                                                    ? `Visitenkarten ${index + 1}`
                                                                    : `T-Shirt ${index + 1}`}
                                                            </h4>

                                                            {isVisitenkarte ? (
                                                                <div className="adminProductGrid">
                                                                    <p>
                                                                        <strong>Produkt:</strong>{" "}
                                                                        {item.productName}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Seiten:</strong>{" "}
                                                                        {item.color}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Bestellte Menge:</strong>{" "}
                                                                        {item.size}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Anzahl im Warenkorb:</strong>{" "}
                                                                        {item.quantity}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Format:</strong>{" "}
                                                                        {item.customText || "-"}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Preis:</strong>{" "}
                                                                        {Number(item.price).toFixed(2).replace(".", ",")} €
                                                                    </p>

                                                                    <p className="adminProductDetails">
                                                                        <strong>Details:</strong>
                                                                        <br />
                                                                        {(item.description || "-")
                                                                            .split("\n")
                                                                            .map((line, lineIndex) => (
                                                                                <span key={lineIndex}>
                                                                                     {line}
                                                                                    <br />
                                                                                </span>
                                                                            ))}
                                                                    </p>

                                                                    {item.druckdatenOption && (
                                                                        <p>
                                                                            <strong>Druckdaten:</strong>{" "}
                                                                            {item.druckdatenOption}
                                                                        </p>
                                                                    )}

                                                                    {item.druckdatenFileName && (
                                                                        <p>
                                                                            <strong>Datei:</strong>{" "}
                                                                            {item.druckdatenFileName}
                                                                        </p>
                                                                    )}

                                                                    {item.druckdatenFileUrl && (
                                                                        <p>
                                                                            <strong>Druckdatei:</strong>{" "}
                                                                            <a
                                                                                href={`http://localhost:5098${item.druckdatenFileUrl}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="adminFileLink"
                                                                            >
                                                                                Datei öffnen
                                                                            </a>
                                                                        </p>
                                                                    )}

                                                                    {item.druckdatenFileUrl &&
                                                                        (
                                                                            item.druckdatenFileUrl.toLowerCase().endsWith(".png") ||
                                                                            item.druckdatenFileUrl.toLowerCase().endsWith(".jpg") ||
                                                                            item.druckdatenFileUrl.toLowerCase().endsWith(".jpeg")
                                                                        ) && (
                                                                            <div className="adminDruckdatenPreviewBox">
                                                                                <img
                                                                                    src={`http://localhost:5098${item.druckdatenFileUrl}`}
                                                                                    alt="Druckdatei Vorschau"
                                                                                    className="adminDruckdatenPreview"
                                                                                />
                                                                            </div>
                                                                        )}

                                                                    {item.designWishes && (
                                                                        <p className="adminProductDetails">
                                                                            <strong>Designwünsche:</strong>
                                                                            <br />
                                                                            {item.designWishes}
                                                                        </p>
                                                                    )}

                                                                </div>
                                                            ) : (
                                                                <div className="adminProductGrid">
                                                                    <p>
                                                                        <strong>Produkt:</strong>{" "}
                                                                        {item.productName}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Farbe:</strong>{" "}
                                                                        {item.color}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Größe:</strong>{" "}
                                                                        {item.size}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Menge:</strong>{" "}
                                                                        {item.quantity}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Text:</strong>{" "}
                                                                        {item.customText || "-"}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Beschreibung:</strong>{" "}
                                                                        {item.description || "-"}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Schrift:</strong>{" "}
                                                                        {item.font || "-"}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Textfarbe:</strong>{" "}
                                                                        {item.textColor || "-"}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Preis:</strong>{" "}
                                                                        {Number(item.price).toFixed(2).replace(".", ",")} €
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="adminOrderFooter">
                                            <p>
                                                Beim Bestätigen oder Ablehnen wird eine
                                                E-Mail an den Kunden gesendet.
                                            </p>

                                            <div className="adminActionButtons">
                                                {group.status === "Pending" ? (
                                                    <>
                                                        <button
                                                            className="confirmButton"
                                                            onClick={() =>
                                                                updateOrderGroupStatus(
                                                                    group.orderGroupId,
                                                                    "confirm"
                                                                )
                                                            }
                                                        >
                                                            Bestätigen
                                                        </button>

                                                        <button
                                                            className="rejectButton"
                                                            onClick={() =>
                                                                updateOrderGroupStatus(
                                                                    group.orderGroupId,
                                                                    "reject"
                                                                )
                                                            }
                                                        >
                                                            Ablehnen
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="statusLockedMessage">
                                                        Diese Bestellung wurde bereits {group.status}.
                                                    </div>
                                                )}

                                                <button
                                                    className="deleteButton"
                                                    onClick={() =>
                                                        deleteOrderGroup(group.orderGroupId)
                                                    }
                                                >
                                                    Löschen
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}

function getStatusClass(status: string) {
    if (status === "Bestätigt") return "statusConfirmed";
    if (status === "Abgelehnt") return "statusRejected";
    return "statusPending";
}