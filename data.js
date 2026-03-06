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
            title: { tr: "İngilizce Öğretiminde YZ Kullanımı", en: "AI in ELT Practices" },
            topic: { tr: "Öğretim Teknolojileri", en: "EdTech" },
            description: { 
                tr: "Eğitimciler için üretken yapay zeka araçlarının sınıfa entegrasyonunu anlatan interaktif sunum.", 
                en: "An interactive presentation on integrating generative AI tools into the classroom for educators." 
            },
            figmaUrl: "https://www.figma.com/embed?embed_host=share&url=YOUR_FIGMA_LINK_HERE",
            tags: ["EdTech", "Generative AI", "Instructional Design"]
        },
        // Add more slide objects here
    ]
};
