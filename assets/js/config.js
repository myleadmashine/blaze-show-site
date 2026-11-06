/* BLAZE SHOW — единая точка настройки. Вставляйте только реальные ID и контакты. */
window.BLAZE_CONFIG = {
  site: {
    name: "BLAZE SHOW",
    url: "https://myleadmashine.github.io/blaze-show-site/", // GitHub Pages
    city: "Алматы",
    instagramUrl: "https://www.instagram.com/blaze.kz/"
  },
  contacts: {
    phoneDisplay: "",        // Например: +7 777 000 00 00 — не заполнять чужим номером
    phoneLink: "",           // Только цифры для tel:
    whatsappNumber: "",      // Только цифры, например 77770000000
    email: ""                // Только реальный рабочий адрес
  },
  leadDelivery: {
    endpoint: "",            // URL Cloudflare Worker после публикации backend
    producerLabel: "Продюсер BLAZE SHOW"
  },
  packages: {
    pricePerNumber: 125000,
    momentNumbers: 3,
    signaturePrice: 750000,
    celebrationFrom: 2500000
  },
  analytics: {
    ga4MeasurementId: "",       // G-XXXXXXXXXX
    googleAdsId: "",            // AW-XXXXXXXXX
    googleAdsConversionLabel: "", // Label из Google Ads Conversion Action
    yandexMetricaId: "",        // Числовой ID счётчика
    clarityProjectId: ""         // Project ID из Microsoft Clarity
  },
  media: {
    wistia: ["4nnek73dvf", "sx1i8mpjne", "7bjmxjnqsf", "nwstr5fcgl"],
    youtubePlaylist: "PLwggEGZ-DYyUGoH1fVzrmDOkTe02Rk8_x"
  }
};
