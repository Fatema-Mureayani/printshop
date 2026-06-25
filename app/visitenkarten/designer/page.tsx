"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Template = {
    id: string;
    name: string;
    layout: "blank" | "classic" | "darkGold" | "blue" | "green";
    backgroundColor: string;
    textColor: string;
    accentColor: string;
};

const templates: Template[] = [
    {
        id: "blank",
        name: "Leer / Weiß",
        layout: "blank",
        backgroundColor: "#ffffff",
        textColor: "#111111",
        accentColor: "#d6af28",
    },
    {
        id: "classic",
        name: "Klassisch",
        layout: "classic",
        backgroundColor: "#ffffff",
        textColor: "#111111",
        accentColor: "#d6af28",
    },
    {
        id: "darkGold",
        name: "Schwarz Gold",
        layout: "darkGold",
        backgroundColor: "#111111",
        textColor: "#ffffff",
        accentColor: "#d6af28",
    },
    {
        id: "blue",
        name: "Business Blau",
        layout: "blue",
        backgroundColor: "#f8fbff",
        textColor: "#111827",
        accentColor: "#2563eb",
    },
    {
        id: "green",
        name: "Modern Grün",
        layout: "green",
        backgroundColor: "#f8fff9",
        textColor: "#111111",
        accentColor: "#22c55e",
    },
];

function DesignerIcon({ type }: { type: string }) {
    if (type === "user") {
        return (
            <svg viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
        );
    }

    if (type === "briefcase") {
        return (
            <svg viewBox="0 0 24 24">
                <path d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
                <rect x="4" y="6" width="16" height="13" rx="2" />
                <path d="M4 11h16" />
            </svg>
        );
    }

    if (type === "phone") {
        return (
            <svg viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 5.18 2 2 0 0 1 5.06 3h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.6 2.61a2 2 0 0 1-.45 2.11L9 10.65a16 16 0 0 0 4.35 4.35l1.21-1.21a2 2 0 0 1 2.11-.45c.84.28 1.71.48 2.61.6A2 2 0 0 1 22 16.92z" />
            </svg>
        );
    }

    if (type === "mail") {
        return (
            <svg viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
            </svg>
        );
    }

    if (type === "globe") {
        return (
            <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18" />
                <path d="M12 3a14 14 0 0 1 0 18" />
                <path d="M12 3a14 14 0 0 0 0 18" />
            </svg>
        );
    }

    if (type === "upload") {
        return (
            <svg viewBox="0 0 24 24">
                <path d="M12 16V4" />
                <path d="M7 9l5-5 5 5" />
                <path d="M5 20h14" />
            </svg>
        );
    }

    if (type === "text") {
        return <span className="designerTextIcon">Aa</span>;
    }

    if (type === "location") {
        return (
            <svg viewBox="0 0 24 24">
                <path d="M12 21s7-5.2 7-12a7 7 0 0 0-14 0c0 6.8 7 12 7 12z" />
                <circle cx="12" cy="9" r="2.5" />
            </svg>
        );
    }

    return null;
}

/*  كود Drag & Drop */
type DraggableKey = "logo" | "name" | "contact"| "backLogo" | "backWebsite" | "backLine";

type DragPosition = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type DraggableElementProps = {
    itemKey: DraggableKey;
    position: DragPosition;
    cardRef: React.RefObject<HTMLDivElement | null>;
    onMove: (key: DraggableKey, position: DragPosition) => void;
    children: ReactNode;
};

function DraggableElement({
                              itemKey,
                              position,
                              cardRef,
                              onMove,
                              children,
                          }: DraggableElementProps) {
    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        e.preventDefault();

        const card = cardRef.current;
        const element = e.currentTarget;

        if (!card) return;

        const cardRect = card.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        const offsetX = e.clientX - elementRect.left;
        const offsetY = e.clientY - elementRect.top;

        function handlePointerMove(moveEvent: PointerEvent) {
            let newX =
                ((moveEvent.clientX - cardRect.left - offsetX) / cardRect.width) * 100;

            let newY =
                ((moveEvent.clientY - cardRect.top - offsetY) / cardRect.height) * 100;

            newX = Math.max(0, Math.min(newX, 100 - position.width));
            newY = Math.max(0, Math.min(newY, 100 - position.height));

            onMove(itemKey, {
                ...position,
                x: newX,
                y: newY,
            });
        }

        function handlePointerUp() {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        }

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
    }

    function handleResizePointerDown(e: React.PointerEvent<HTMLSpanElement>) {
        e.preventDefault();
        e.stopPropagation();

        const card = cardRef.current;

        if (!card) return;

        const cardRect = card.getBoundingClientRect();

        function handlePointerMove(moveEvent: PointerEvent) {
            const newWidth =
                ((moveEvent.clientX - cardRect.left) / cardRect.width) * 100 - position.x;

            const newHeight =
                ((moveEvent.clientY - cardRect.top) / cardRect.height) * 100 - position.y;

            onMove(itemKey, {
                ...position,
                width: Math.max(10, Math.min(newWidth, 100 - position.x)),
                height: Math.max(10, Math.min(newHeight, 100 - position.y)),
            });
        }

        function handlePointerUp() {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        }

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
    }

    return (
        <div
            className="draggableCardElement"
            onPointerDown={handlePointerDown}
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                width: `${position.width}%`,
                height: `${position.height}%`,
            }}
        >
            <div className="draggableContent">
                {children}
            </div>

            <span
                className="resizeHandle"
                onPointerDown={handleResizePointerDown}
            />
        </div>
    );
}

export default function VisitenkartenDesignerPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const seiten = searchParams.get("seiten") || "Beidseitig bedruckt";
    const format = searchParams.get("format") || "85 × 55 mm";

    const isDoubleSided = seiten === "Beidseitig bedruckt";
    const cardRef = useRef<HTMLDivElement | null>(null);

    const [dragPositions, setDragPositions] = useState<Record<DraggableKey, DragPosition>>({
        logo: {
            x: 65,
            y: 35,
            width: 18,
            height: 18,
        },
        name: {
            x: 8,
            y: 12,
            width: 48,
            height: 24,
        },
        contact: {
            x: 10,
            y: 48,
            width: 45,
            height: 35,
        },

        backLogo: {
            x: 42,
            y: 25,
            width: 20,
            height: 20,
        },
        backWebsite: {
            x: 35,
            y: 50,
            width: 30,
            height: 12,
        },
        backLine: {
            x: 20,
            y: 67,
            width: 60,
            height: 4,
        },
    });

    function updateDragPosition(key: DraggableKey, position: DragPosition) {
        setDragPositions((prev) => ({
            ...prev,
            [key]: position,
        }));
    }

    function getResponsiveFontSize(base: number, position: DragPosition) {
        const scale = Math.min(position.width / 45, position.height / 24);

        return Math.max(8, Math.round(base * scale));
    }

    const [activeSide, setActiveSide] = useState<"front" | "back">("front");

    const [name, setName] = useState("Max Mustermann");
    const [jobTitle, setJobTitle] = useState("Geschäftsführer");
    const [phone, setPhone] = useState("+49 123 456789");
    const [email, setEmail] = useState("info@example.com");
    const [website, setWebsite] = useState("www.example.com");
    const [address, setAddress] = useState("Musterstraße 1");

    const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);

    const [customBackgroundColor, setCustomBackgroundColor] = useState(templates[0].backgroundColor);
    const [customTextColor, setCustomTextColor] = useState(templates[0].textColor);
    const [customAccentColor, setCustomAccentColor] = useState(templates[0].accentColor);

    const [showColorPanel, setShowColorPanel] = useState(false);

    const [fontSize, setFontSize] = useState(18);
    const [logoUrl, setLogoUrl] = useState("");

    const [frontBackgroundImageUrl, setFrontBackgroundImageUrl] = useState("");
    const [backBackgroundImageUrl, setBackBackgroundImageUrl] = useState("");

    const [backgroundTargetSide, setBackgroundTargetSide] = useState<"front" | "back">("front");
    const [showBackgroundPanel, setShowBackgroundPanel] = useState(false);

    const [undoStack, setUndoStack] = useState<any[]>([]); // Rückgängig
    const [redoStack, setRedoStack] = useState<any[]>([]); // Wiederholen

    function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            setLogoUrl(reader.result as string);
        };

        reader.readAsDataURL(file);
    }
    // دالة رفع صورة الخلفية
    function handleBackgroundUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Bitte nur Bilder hochladen.");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const imageUrl = reader.result as string;

            if (backgroundTargetSide === "front") {
                setFrontBackgroundImageUrl(imageUrl);
            } else {
                setBackBackgroundImageUrl(imageUrl);
            }
        };

        reader.readAsDataURL(file);
    }

    function finishDesign() {
        const designData = {
            seiten,
            format,
            templateId: selectedTemplate.id,
            templateName: selectedTemplate.name,
            name,
            jobTitle,
            phone,
            email,
            website,
            address,
            frontBackgroundImageUrl,
            backBackgroundImageUrl,
            backgroundColor: customBackgroundColor,
            textColor: customTextColor,
            accentColor: customAccentColor,
            fontSize,
            logoUrl,
            hasBackSide: isDoubleSided,
            dragPositions,
        };

        localStorage.setItem("visitenkartenDesignerData", JSON.stringify(designData));
        router.push("/visitenkarten");
    }

    const currentBackgroundImageUrl =
        activeSide === "front" ? frontBackgroundImageUrl : backBackgroundImageUrl;

    return (
        <main className="designerPage">
            <header className="designerTopBar">
                <div className="designerTopLeft">
                    <div className="designerLogoMark">▱</div>
                    <strong>Online Designer</strong>

                    <button
                        type="button"
                        className="designerBackButton"
                        onClick={() => router.push("/visitenkarten")}
                    >
                        ← Zurück zu Produkten
                    </button>
                </div>

                <div className="designerTopCenter">
                    <button type="button">↶</button>
                    <span>Rückgängig</span>
                    <button type="button">↷</button>
                    <span>Wiederholen</span>
                </div>

                <div className="designerTopRight">
                    <div className="designerZoom">
                        <button type="button">−</button>
                        <span>100%</span>
                        <button type="button">+</button>
                    </div>

                    <button
                        type="button"
                        className="designerFinishTopButton"
                        onClick={finishDesign}
                    >
                        ✓ Design übernehmen
                    </button>
                </div>
            </header>

            <div className="designerLayout">
                <aside className="designerSidebar">
                    <div className="designerSectionHeader">
                        <h2>Vorlagen</h2>
                        <button type="button">Alle anzeigen</button>
                    </div>

                    <div className="designerTemplateGrid">
                        {templates.map((template) => (
                            <button
                                key={template.id}
                                type="button"
                                className={
                                    selectedTemplate.id === template.id
                                        ? "designerTemplateCard designerTemplateActive"
                                        : "designerTemplateCard"
                                }
                                onClick={() => {
                                    setSelectedTemplate(template);
                                    setCustomBackgroundColor(template.backgroundColor);
                                    setCustomTextColor(template.textColor);
                                    setCustomAccentColor(template.accentColor);
                                    setFrontBackgroundImageUrl("");
                                    setBackBackgroundImageUrl(""); //لما تنتقل من قالب فيه صورة لقالب ثاني، ما تضل الصورة القديمة
                                }}
                            >
                                <div
                                    className={`templatePreviewMini templatePreview-${template.layout}`}
                                    style={{
                                        backgroundColor: template.backgroundColor,
                                        color: template.textColor,
                                        borderColor: template.accentColor,
                                    }}
                                >
                                    <div
                                        className="templateMiniLine"
                                        style={{ backgroundColor: template.accentColor }}
                                    />

                                    <div className="templateMiniContent">
                                        <strong>MAX MUSTERMANN</strong>
                                        <span>Geschäftsführer</span>
                                        <small>+49 123 456789</small>
                                        <small>info@example.com</small>
                                    </div>
                                </div>

                                <strong>{template.name}</strong>
                            </button>
                        ))}
                    </div>

                    <div className="designerSectionTitle">
                        <h2>Design bearbeiten</h2>
                    </div>

                    <div className="designerInputRow">
                        <span className="designerFieldIcon">
                           <DesignerIcon type="user" />
                        </span>
                        <div>
                            <label>Name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                    </div>

                    <div className="designerInputRow">
                        <span className="designerFieldIcon">
                          <DesignerIcon type="briefcase" />
                        </span>
                        <div>
                            <label>Position / Beruf</label>
                            <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                        </div>
                    </div>

                    <div className="designerInputRow">
                        <span className="designerFieldIcon">
                          <DesignerIcon type="phone" />
                        </span>
                        <div>
                            <label>Telefon</label>
                            <input value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                    </div>

                    <div className="designerInputRow">
                        <span className="designerFieldIcon">
                          <DesignerIcon type="mail" />
                        </span>
                        <div>
                            <label>E-Mail</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>

                    <div className="designerInputRow">
                        <span className="designerFieldIcon">
                          <DesignerIcon type="globe" />
                        </span>
                        <div>
                            <label>Webseite</label>
                            <input value={website} onChange={(e) => setWebsite(e.target.value)} />
                        </div>
                    </div>

                    <div className="designerInputRow">
                        <span className="designerFieldIcon">
                          <DesignerIcon type="location" />
                        </span>
                        <div>
                            <label>Adresse</label>
                            <input value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                    </div>

                    <div className="designerInputRow">
                        <span className="designerFieldIcon">
                          <DesignerIcon type="upload" />
                        </span>
                        <div>
                            <label>Logo hochladen</label>
                            <input
                                type="file"
                                accept="image/png,image/jpeg"
                                onChange={handleLogoUpload}
                            />
                            <small>PNG oder JPG</small>
                        </div>
                    </div>

                    <div className="designerInputRow">
                        <span className="designerFieldIcon">
                          <DesignerIcon type="text" />
                        </span>
                        <div>
                            <label>Schriftgröße</label>
                            <input
                                type="range"
                                min="12"
                                max="28"
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value))}
                            />
                        </div>
                    </div>
                </aside>

                <section className="designerCanvasArea">
                    <div className="designerFormatBadge">{format}</div>

                    <div className="designerWorkSurface">
                        <div
                            ref={cardRef}
                            className="businessCardPreview"
                            style={{
                                backgroundColor: customBackgroundColor,
                                backgroundImage: frontBackgroundImageUrl ? `url(${frontBackgroundImageUrl})` : "none",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                color: customTextColor,
                                borderColor: customAccentColor,
                            }}
                        >
                            <div
                                className="cardAccentLine"
                                style={{ backgroundColor: customAccentColor }}
                            />

                            {activeSide === "front" ? (
                                <>
                                    {selectedTemplate.layout === "blank" && (
                                        <div
                                            className="cardBlankLayout"
                                            style={{
                                                backgroundColor: customBackgroundColor,
                                                backgroundImage: frontBackgroundImageUrl ? `url(${frontBackgroundImageUrl})` : "none",
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                backgroundRepeat: "no-repeat",
                                                color: customTextColor,
                                            }}
                                        >
                                            <DraggableElement
                                                itemKey="logo"
                                                position={dragPositions.logo}
                                                cardRef={cardRef}
                                                onMove={updateDragPosition}
                                            >
                                                <div className="blankLogoBlock">
                                                    {logoUrl ? (
                                                        <img
                                                            src={logoUrl}
                                                            alt="Logo"
                                                            className="blankDesignerLogo"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="blankLogoPlaceholder"
                                                            style={{
                                                                borderColor: customAccentColor,
                                                                color: customAccentColor,
                                                                fontSize: `${getResponsiveFontSize(18, dragPositions.logo)}px`,
                                                            }}
                                                        >
                                                            LOGO
                                                        </div>
                                                    )}
                                                </div>
                                            </DraggableElement>

                                            <DraggableElement
                                                itemKey="name"
                                                position={dragPositions.name}
                                                cardRef={cardRef}
                                                onMove={updateDragPosition}
                                            >
                                                <div className="blankNameBlock">
                                                    <h2
                                                        style={{
                                                            fontSize: `${getResponsiveFontSize(fontSize + 18, dragPositions.name)}px`,
                                                            color: customTextColor,
                                                        }}
                                                    >
                                                        {name}
                                                    </h2>

                                                    <p
                                                        style={{
                                                            color: customAccentColor,
                                                            fontSize: `${getResponsiveFontSize(fontSize + 6, dragPositions.name)}px`,
                                                        }}
                                                    >
                                                        {jobTitle}
                                                    </p>
                                                </div>
                                            </DraggableElement>

                                            <DraggableElement
                                                itemKey="contact"
                                                position={dragPositions.contact}
                                                cardRef={cardRef}
                                                onMove={updateDragPosition}
                                            >
                                                <div
                                                    className="blankContactList"
                                                    style={{
                                                        fontSize: `${getResponsiveFontSize(fontSize + 4, dragPositions.contact)}px`,
                                                    }}
                                                >
                                                  <span className="cardContactItem">
                                                      <span
                                                          className="cardContactIcon"
                                                          style={{ color: customAccentColor }}
                                                      >
                                                          <DesignerIcon type="phone" />
                                                      </span>
                                                      {phone}
                                                  </span>

                                                  <span className="cardContactItem">
                                                      <span
                                                          className="cardContactIcon"
                                                          style={{ color: customAccentColor }}
                                                      >
                                                          <DesignerIcon type="mail" />
                                                      </span>
                                                      {email}
                                                  </span>

                                                  <span className="cardContactItem">
                                                      <span
                                                          className="cardContactIcon"
                                                          style={{ color: customAccentColor }}
                                                      >
                                                          <DesignerIcon type="globe" />
                                                      </span>
                                                        {website}
                                                  </span>

                                                  <span className="cardContactItem">
                                                      <span
                                                          className="cardContactIcon"
                                                          style={{ color: customAccentColor }}
                                                      >
                                                          <DesignerIcon type="location" />
                                                      </span>
                                                        {address}
                                                  </span>
                                                </div>
                                            </DraggableElement>
                                        </div>
                                    )}

                                    {selectedTemplate.layout === "classic" && (
                                        <>
                                            <div
                                                className="cardAccentLine"
                                                style={{ backgroundColor: customAccentColor }}
                                            />

                                            <div className="designerCardLogoArea">
                                                {logoUrl ? (
                                                    <img src={logoUrl} alt="Logo" className="designerLogo" />
                                                ) : (
                                                    <div
                                                        className="designerFakeLogo"
                                                        style={{ color: customAccentColor }}
                                                    >
                                                        M
                                                    </div>
                                                )}

                                                <strong>COMPANY</strong>
                                                <span style={{ color: customAccentColor }}>
                                                    SLOGAN HIER
                                                </span>
                                            </div>

                                            <div
                                                className="designerDivider"
                                                style={{ backgroundColor: customAccentColor }}
                                            />

                                            <div className="cardTextContent">
                                                <div className="selectedTextBox">
                                                    <h2 style={{ fontSize: `${fontSize + 6}px` }}>
                                                        {name}
                                                    </h2>
                                                    <p style={{ color: customAccentColor }}>
                                                        {jobTitle}
                                                    </p>
                                                </div>

                                                <div className="cardContact">
                                                    <span className="cardContactItem">
                                                        <span className="cardContactIcon">
                                                            <DesignerIcon type="phone" />
                                                        </span>
                                                        {phone}
                                                    </span>

                                                    <span className="cardContactItem">
                                                        <span className="cardContactIcon">
                                                            <DesignerIcon type="mail" />
                                                        </span>
                                                        {email}
                                                    </span>

                                                    <span className="cardContactItem">
                                                        <span className="cardContactIcon">
                                                            <DesignerIcon type="globe" />
                                                        </span>
                                                        {website}
                                                    </span>

                                                    <span className="cardContactItem">
                                                        <span className="cardContactIcon">
                                                            <DesignerIcon type="location" />
                                                        </span>
                                                        {address}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {selectedTemplate.layout === "darkGold" && (
                                        <div
                                            className="cardDarkGoldLayout"
                                            style={{
                                                backgroundColor: customBackgroundColor,
                                                backgroundImage: frontBackgroundImageUrl ? `url(${frontBackgroundImageUrl})` : "none",
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                backgroundRepeat: "no-repeat",
                                                color: customTextColor,
                                            }}
                                        >
                                            <div className="darkGoldShape"></div>

                                            <div className="darkGoldContent">
                                                <h2
                                                    style={{
                                                        color: customTextColor,
                                                        fontSize: `${fontSize + 10}px`,
                                                    }}
                                                >
                                                    {name.toUpperCase()}
                                                </h2>

                                                <p style={{ color: customAccentColor }}>
                                                    {jobTitle}
                                                </p>

                                                <div
                                                    className="darkGoldLine"
                                                    style={{ backgroundColor: customAccentColor }}
                                                />

                                                <span className="cardContactItem">
                                                  <span
                                                    className="cardContactIcon"
                                                    style={{ color: customAccentColor }}
                                                  >
                                                    <DesignerIcon type="phone" />
                                                </span>
                                                    {phone}
                                                </span>

                                                <span className="cardContactItem">
                                                  <span
                                                     className="cardContactIcon"
                                                     style={{ color: customAccentColor }}
                                                  >
                                                      <DesignerIcon type="mail" />
                                                  </span>
                                                    {email}
                                                </span>

                                                <span className="cardContactItem">
                                                    <span
                                                        className="cardContactIcon"
                                                        style={{ color: customAccentColor }}
                                                    >
                                                        <DesignerIcon type="globe" />
                                                    </span>
                                                    {website}
                                                </span>

                                                <span className="cardContactItem">
                                                    <span
                                                        className="cardContactIcon"
                                                        style={{ color: customAccentColor }}
                                                    >
                                                        <DesignerIcon type="location" />
                                                    </span>
                                                    {address}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {selectedTemplate.layout === "blue" && (
                                        <div
                                            className="cardBlueLayout"
                                            style={{
                                                backgroundColor: customBackgroundColor,
                                                backgroundImage: frontBackgroundImageUrl ? `url(${frontBackgroundImageUrl})` : "none",
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                backgroundRepeat: "no-repeat",
                                                color: customTextColor,
                                            }}
                                        >
                                            <div className="blueLeftBar"></div>
                                            <div className="bluePolygon"></div>

                                            <div className="blueContent">
                                                <h2
                                                    style={{
                                                        color: customAccentColor,
                                                        fontSize: `${fontSize + 10}px`,
                                                    }}
                                                >
                                                    {name.toUpperCase()}
                                                </h2>

                                                <p>{jobTitle}</p>

                                                <div className="blueContact">
                                                <span className="cardContactItem">
                                                      <span
                                                          className="cardContactIcon"
                                                          style={{ color: customAccentColor }}
                                                      >
                                                          <DesignerIcon type="phone" />
                                                      </span>
                                                      {phone}
                                                  </span>

                                                    <span className="cardContactItem">
                                                      <span
                                                          className="cardContactIcon"
                                                          style={{ color: customAccentColor }}
                                                      >
                                                          <DesignerIcon type="mail" />
                                                      </span>
                                                        {email}
                                                  </span>

                                                    <span className="cardContactItem">
                                                      <span
                                                          className="cardContactIcon"
                                                          style={{ color: customAccentColor }}
                                                      >
                                                          <DesignerIcon type="globe" />
                                                      </span>
                                                        {website}
                                                  </span>

                                                    <span className="cardContactItem">
                                                      <span
                                                          className="cardContactIcon"
                                                          style={{ color: customAccentColor }}
                                                      >
                                                          <DesignerIcon type="location" />
                                                      </span>
                                                        {address}
                                                  </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedTemplate.layout === "green" && (
                                        <div
                                            className="cardGreenLayout"
                                            style={{
                                                backgroundColor: customBackgroundColor,
                                                backgroundImage: frontBackgroundImageUrl ? `url(${frontBackgroundImageUrl})` : "none",
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                backgroundRepeat: "no-repeat",
                                                color: customTextColor,
                                            }}
                                        >
                                            <div
                                                className="greenLeftBar"
                                                style={{ backgroundColor: customAccentColor }}
                                            />

                                            <div className="greenLogoBlock">
                                                {logoUrl ? (
                                                    <img src={logoUrl} alt="Logo" className="designerLogo" />
                                                ) : (
                                                    <div
                                                        className="designerFakeLogo"
                                                        style={{ color: customAccentColor }}
                                                    >
                                                        M
                                                    </div>
                                                )}

                                                <strong>COMPANY</strong>
                                            </div>

                                            <div
                                                className="greenDivider"
                                                style={{ backgroundColor: customAccentColor }}
                                            />

                                            <div className="greenContent">
                                                <h2
                                                    style={{
                                                        color: customTextColor,
                                                        fontSize: `${fontSize + 10}px`,
                                                    }}
                                                >
                                                    {name}
                                                </h2>

                                                <p style={{ color: customAccentColor }}>
                                                    {jobTitle}
                                                </p>

                                                <span className="cardContactItem">
                                                  <span
                                                      className="cardContactIcon"
                                                      style={{ color: customAccentColor }}
                                                  >
                                                      <DesignerIcon type="phone" />
                                                  </span>
                                                    {phone}
                                              </span>

                                                <span className="cardContactItem">
                                                  <span
                                                      className="cardContactIcon"
                                                      style={{ color: customAccentColor }}
                                                  >
                                                      <DesignerIcon type="mail" />
                                                  </span>
                                                    {email}
                                              </span>

                                                <span className="cardContactItem">
                                                  <span
                                                      className="cardContactIcon"
                                                      style={{ color: customAccentColor }}
                                                  >
                                                      <DesignerIcon type="globe" />
                                                  </span>
                                                    {website}
                                              </span>

                                                <span className="cardContactItem">
                                                  <span
                                                      className="cardContactIcon"
                                                      style={{ color: customAccentColor }}
                                                  >
                                                      <DesignerIcon type="location" />
                                                  </span>
                                                    {address}
                                              </span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div
                                    className="cardBackContentEditable"
                                    style={{
                                        backgroundColor: customBackgroundColor,
                                        backgroundImage: backBackgroundImageUrl ? `url(${backBackgroundImageUrl})` : "none",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                        color: customTextColor,
                                    }}
                                >
                                    <DraggableElement
                                        itemKey="backLogo"
                                        position={dragPositions.backLogo}
                                        cardRef={cardRef}
                                        onMove={updateDragPosition}
                                    >
                                        <div className="backLogoBlock">
                                            {logoUrl ? (
                                                <img
                                                    src={logoUrl}
                                                    alt="Logo"
                                                    className="blankDesignerLogo"
                                                />
                                            ) : (
                                                <div
                                                    className="blankLogoPlaceholder"
                                                    style={{
                                                        borderColor: customAccentColor,
                                                        color: customAccentColor,
                                                        fontSize: `${getResponsiveFontSize(18, dragPositions.backLogo)}px`,
                                                    }}
                                                >
                                                    LOGO
                                                </div>
                                            )}
                                        </div>
                                    </DraggableElement>

                                    <DraggableElement
                                        itemKey="backWebsite"
                                        position={dragPositions.backWebsite}
                                        cardRef={cardRef}
                                        onMove={updateDragPosition}
                                    >
                                        <p
                                            className="backWebsiteText"
                                            style={{
                                                color: customTextColor,
                                                fontSize: `${getResponsiveFontSize(fontSize + 4, dragPositions.backWebsite)}px`,
                                            }}
                                        >
                                            {website}
                                        </p>
                                    </DraggableElement>

                                    <DraggableElement
                                        itemKey="backLine"
                                        position={dragPositions.backLine}
                                        cardRef={cardRef}
                                        onMove={updateDragPosition}
                                    >
                                        <div
                                            className="cardBackLineEditable"
                                            style={{
                                                backgroundColor: customAccentColor,
                                            }}
                                        />
                                    </DraggableElement>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="designerPages">
                        <button
                            type="button"
                            className={activeSide === "front" ? "designerPageActive" : ""}
                            onClick={() => setActiveSide("front")}
                        >
                            Vorderseite
                        </button>

                        {isDoubleSided && (
                            <button
                                type="button"
                                className={activeSide === "back" ? "designerPageActive" : ""}
                                onClick={() => setActiveSide("back")}
                            >
                                Rückseite
                            </button>
                        )}
                    </div>
                </section>

                <aside className="designerRightPanel">
                    <h2>Produktdaten</h2>

                    <div className="designerProductInfo">
                        <p><strong>Produkt:</strong> Visitenkarten</p>
                        <p><strong>Format:</strong> {format}</p>
                        <p><strong>Druck:</strong> {seiten}</p>
                        <p><strong>Vorlage:</strong> {selectedTemplate.name}</p>
                    </div>

                    <hr />

                    <h3>Schnellaktionen</h3>

                    <div className="designerQuickActions">
                        <button
                            type="button"
                            onClick={() => setShowBackgroundPanel(!showBackgroundPanel)}
                        >
                            Hintergrund ändern
                        </button>

                        {showBackgroundPanel && (
                            <div className="designerBackgroundPanel">
                                <h4>Hintergrundbild</h4>

                                <div className="designerBackgroundTarget">
                                    <button
                                        type="button"
                                        className={backgroundTargetSide === "front" ? "activeBackgroundTarget" : ""}
                                        onClick={() => setBackgroundTargetSide("front")}
                                    >
                                        Vorderseite
                                    </button>

                                    <button
                                        type="button"
                                        className={backgroundTargetSide === "back" ? "activeBackgroundTarget" : ""}
                                        onClick={() => setBackgroundTargetSide("back")}
                                    >
                                        Rückseite
                                    </button>
                                </div>

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    onChange={handleBackgroundUpload}
                                />

                                {backgroundTargetSide === "front" && frontBackgroundImageUrl && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setFrontBackgroundImageUrl("")}
                                            className="designerRemoveBackgroundButton"
                                        >
                                            Vorderseite Hintergrund entfernen
                                        </button>

                                        <div
                                            className="designerBackgroundPreview"
                                            style={{
                                                backgroundImage: `url(${frontBackgroundImageUrl})`,
                                            }}
                                        />
                                    </>
                                )}

                                {backgroundTargetSide === "back" && backBackgroundImageUrl && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setBackBackgroundImageUrl("")}
                                            className="designerRemoveBackgroundButton"
                                        >
                                            Rückseite Hintergrund entfernen
                                        </button>

                                        <div
                                            className="designerBackgroundPreview"
                                            style={{
                                                backgroundImage: `url(${backBackgroundImageUrl})`,
                                            }}
                                        />
                                    </>
                                )}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => setShowColorPanel(!showColorPanel)}
                        >
                            Farben anpassen
                        </button>

                        {showColorPanel && (
                            <div className="designerColorPanel">
                                <h4>Farben anpassen</h4>

                                <div className="designerColorRow">
                                    <label>Hintergrund</label>
                                    <input
                                        type="color"
                                        value={customBackgroundColor}
                                        onChange={(e) => setCustomBackgroundColor(e.target.value)}
                                    />
                                    <span>{customBackgroundColor}</span>
                                </div>

                                <div className="designerColorRow">
                                    <label>Textfarbe</label>
                                    <input
                                        type="color"
                                        value={customTextColor}
                                        onChange={(e) => setCustomTextColor(e.target.value)}
                                    />
                                    <span>{customTextColor}</span>
                                </div>

                                <div className="designerColorRow">
                                    <label>Akzentfarbe</label>
                                    <input
                                        type="color"
                                        value={customAccentColor}
                                        onChange={(e) => setCustomAccentColor(e.target.value)}
                                    />
                                    <span>{customAccentColor}</span>
                                </div>
                            </div>
                        )}

                        <button type="button">Element hinzufügen</button>
                        <button type="button">Ausrichten ›</button>
                    </div>

                    <h3>Ebenen</h3>

                    <div className="designerLayers">
                        <div> T&nbsp; {name} <span>👁</span></div>
                        <div> T&nbsp; {jobTitle} <span>👁</span></div>
                        <div>▤ Kontaktinformationen <span>👁</span></div>
                        <div>▧ Logo <span>👁</span></div>
                        <div>■ Hintergrund <span>🔒</span></div>
                    </div>

                    <div className="designerTipBox">
                        <strong>💡 Tipp</strong>
                        <p>Ziehen Sie Elemente, um ihre Position zu ändern.</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}