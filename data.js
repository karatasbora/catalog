// data.js
const archiveData = {
    meta: {
        name: "Bora Karataş",
        title: { tr: "BK Katalog", en: "BK Catalog" },
        subtitle: { tr: "Etkileşimli Figma Sunumları", en: "Interactive Figma Slides" },
        email: "borakaratas@anadolu.edu.tr",
        mainSite: "https://karatasbora.github.io/me"
    },
    ui: {
        loadBtn: { tr: "Etkileşimli Sunumu Yükle", en: "Load Interactive Slides" },
        topicLabel: { tr: "Konu:", en: "Topic:" }
    },
    slides: [
        {
            id: "slide-elt-101",
            title: { tr: "Hayvanat Bahçesinde", en: "At the Zoo" },
            topic: { tr: "Karşılaştırma Sıfatları", en: "Comparative Adjectives" },
            description: {
                tr: "Bu ders materyali, PPP (Presentation, Practice, Production) metodolojisini modern kullanıcı deneyimi tasarımıyla birleştiren bütüncül bir dijital öğrenme modülüdür.",
                en: "This course material is a holistic digital learning module that combines the PPP (Presentation, Practice, Production) methodology with modern user experience design."
            },
            figmaUrl: "https://www.figma.com/design/zMks6XTgyB6cYu0CxwFvcf/Animals-%7C-Grammar---Comparatives?node-id=0-1&p=f&t=zsVbbOPpxkJW6kvi-0",
            pdfUrl: "ws/ws-elt-101.pdf",
            tags: ["Grammar", "5th Grade", "A1"]
        },
        // Add more slide objects here
    ]
};
