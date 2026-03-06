// data.js
const archiveData = {
    meta: {
        name: "Bora Karataş",
        title: { tr: "Eğitim Materyalleri Arşivi", en: "Educational Materials Archive" },
        subtitle: { tr: "Etkileşimli Figma Sunumları", en: "Interactive Figma Slides" },
        email: "borakaratas@anadolu.edu.tr",
        mainSite: "https://karatasbora.github.io/me",
        backBtn: { tr: "← Özgeçmişe Dön", en: "← Back to Resume" }
    },
    ui: {
        loadBtn: { tr: "Etkileşimli Sunumu Yükle", en: "Load Interactive Slides" },
        topicLabel: { tr: "Konu:", en: "Topic:" }
    },
    slides: [
        {
            id: "slide-elt-101",
            title: { tr: "Hayvanlar", en: "Animals" },
            topic: { tr: "Comparatives", en: "Karşılaştırma Sıfatları" },
            description: { 
                tr: "Eğitimciler için üretken yapay zeka araçlarının sınıfa entegrasyonunu anlatan interaktif sunum.", 
                en: "An interactive presentation on integrating generative AI tools into the classroom for educators." 
            },
            figmaUrl: "https://embed.figma.com/proto/zMks6XTgyB6cYu0CxwFvcf/Animals_Grammar?node-id=0-1&embed-host=share",
            tags: ["EdTech", "Generative AI", "Instructional Design"]
        },
        // Add more slide objects here
    ]
};
