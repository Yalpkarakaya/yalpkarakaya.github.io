---
layout: default
---

<div class="main-container">
    <header class="header-section">
        <button id="home-btn" title="Ana Sayfa">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25">
                <path d="M1 10 l 11 -8 l 11 8 v 2 h -3 v 10 H 5 v -10 H 2 z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        </button>
        <button id="back-btn-header" title="Geri Dön">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25">
                <path d="M15 18l-6-6 6-6"/>
            </svg>
        </button>
        <h1 class="main-title">Akıllı Eldiven Projesi</h1>
        <h2 class="sub-title" id="main-subtitle">Lütfen bir kılavuz seçin</h2>
    </header>

    <div id="selection-container">
        <div class="selection-card" id="select-hardware">
            <h2>Donanım Montaj</h2>
            <p>İnteraktif devre şemaları.</p>
        </div>
        <div class="selection-card" id="select-software">
            <h2>Yazılım Algoritması</h2>
            <p>Codecell ve Android mimarisi.</p>
        </div>
        <div class="selection-card" id="select-report">
            <h2>Komponent Raporu</h2>
            <p>Proje malzeme listesi yönetimi.</p>
        </div>
        <div class="selection-card" id="select-details">
            <h2>Proje Raporu ve Detaylar</h2>
            <p>Genel rapor, kişisel bilgiler ve kaynakça.</p>
        </div>
    </div>

    <div id="hardware-guide-container">
        <div class="main-layout">
            <div class="left-column">
                <div class="map-container">
                    <h2 class="section-title">
                        <div class="section-title-text">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                            </svg>
                            Devre Aşamaları
                        </div>
                    </h2>
                    <svg viewBox="0 0 840 150" class="interactive-map-svg"></svg>
                </div>
                <div class="schematic-container">
                    <h2 class="section-title">
                        <div class="section-title-text">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M6 2h12l2 2v2h2v8h-2v2l-2 2H6l-2-2v-2H2V6h2V4l2-2z"></path>
                                <rect x="8" y="8" width="8" height="8" rx=".5"></rect>
                                <path d="M9 8V7M10.75 8V7M12.5 8V7M14.25 8V7"></path>
                                <path d="M9 16v1M10.75 16v1M12.5 16v1M14.25 16v1"></path>
                                <path d="M8 9H7M8 10.75H7M8 12.5H7M8 14.25H7"></path>
                                <path d="M16 9h1M16 10.75h1M16 12.5h1M16 14.25h1"></path>
                                <rect x="4.5" y="3.5" width="3" height="2" rx="1"></rect>
                                <rect x="9.5" y="3.5" width="3" height="2" rx="1"></rect>
                                <rect x="14.5" y="3.5" width="3" height="2" rx="1"></rect>
                                <line x1="7.5" y1="4.5" x2="9.5" y2="4.5"></line>
                                <line x1="12.5" y1="4.5" x2="14.5" y2="4.5"></line>
                                <line x1="18" y1="8" x2="18" y2="16"></line>
                                <circle cx="18" cy="8" r=".75"></circle>
                                <circle cx="18" cy="10.66" r=".75"></circle>
                                <circle cx="18"cy="13.33" r=".75"></circle>
                                <circle cx="18" cy="16" r=".75"></circle>
                            </svg>
                            Fiziksel Bağlantı Şeması
                        </div>
                    </h2>
                    <div id="hardware-schematic-container"></div>
                </div>
                <div id="hardware-connection-list-container" class="connection-list-container">
                    <h2 class="section-title" style="font-size:1.25rem">
                        <div class="section-title-text">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
                            </svg>
                            Bağlantı Noktası Detayları
                        </div>
                    </h2>
                    <ul class="connection-list"></ul>
                    <button class="analyze-connection-btn">✨ Bu Bağlantıyı Analiz Et</button>
                </div>
            </div>
            <div class="right-column" id="hardware-ai-column"></div>
        </div>
    </div>

    <div id="software-guide-container">
        <div class="main-layout">
            <div class="left-column">
                <div class="map-container">
                    <h2 class="section-title">
                        <div class="section-title-text">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="16 18 22 12 16 6"></polyline>
                                <polyline points="8 6 2 12 8 18"></polyline>
                                <line x1="10" y1="19" x2="14" y2="5"></line>
                            </svg>
                            Yazılım Mimarisi
                        </div>
                    </h2>
                    <svg viewBox="0 0 840 150" class="interactive-map-svg"></svg>
                </div>
                <div class="schematic-container">
                    <h2 class="section-title">
                        <div class="section-title-text">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect width="18" height="18" x="3" y="3" rx="2"/>
                                <path d="M8 12h8"/>
                                <path d="M12 8v8"/>
                            </svg>
                            Algoritma Akış Şeması
                        </div>
                    </h2>
                    <div id="software-schematic-container"></div>
                </div>
                <div id="software-connection-list-container" class="connection-list-container">
                    <h2 class="section-title" style="font-size:1.25rem">
                        <div class="section-title-text">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
                            </svg>
                            Algoritma Detayları
                        </div>
                    </h2>
                    <ul class="connection-list"></ul>
                    <button class="analyze-connection-btn">✨ Bu Adımı Analiz Et</button>
                </div>
            </div>
            <div class="right-column" id="software-ai-column"></div>
        </div>
    </div>

    <div id="report-guide-container">
        <div class="report-container">
            <h2 class="section-title">
                <div class="section-title-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Komponent Raporu
                </div>
            </h2>
            <div class="report-controls">
                <div class="add-component-form">
                    <input type="text" id="new-component-input" placeholder="Yeni komponent ekle (örn: 100nF Kapasitör)">
                    <button id="add-component-btn">Ekle</button>
                </div>
                <div class="report-actions-row">
                    <div class="sort-controls">
                        <button class="sort-btn" data-sort-by="name">İsme Göre (A-Z)</button>
                        <button class="sort-btn" data-sort-by="type">Türe Göre (Yapay Zeka)</button>
                        <button class="sort-btn" data-sort-by="stage">Aşamaya Göre (Yapay Zeka)</button>
                    </div>
                    <div class="extra-actions">
                        <button id="undo-delete-btn" style="display:none">Geri Al</button>
                        <button id="export-csv-btn">Listeyi Dışa Aktar</button>
                    </div>
                </div>
            </div>
            <ul id="component-list"></ul>
        </div>
    </div>

    <div id="details-guide-container">
        <div id="details-selection-container">
            <div class="selection-card" id="select-project-report">
                <h2>Proje Raporu</h2>
                <p>Proje detaylarını ve raporunu oluşturun/görüntüleyin.</p>
            </div>
            <div class="selection-card" id="select-personal-info">
                <h2>Kişisel Bilgiler</h2>
                <p>Proje sahibi bilgilerini oluşturun/görüntüleyin.</p>
            </div>
            <div class="selection-card" id="select-credits">
                <h2>Emeği Geçenler & Kaynakça</h2>
                <p>Katkıda bulunanları ve kaynakları yönetin.</p>
            </div>
        </div>

        <div id="project-report-container">
            <div class="details-card">
                <div class="details-card-header">
                    <div class="section-title-text">
                        <h3>Proje Raporu</h3>
                        <button class="ai-action-btn" id="ai-report-btn" title="Yapay Zeka ile Raporu Geliştir">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="m12 14 4-4"/>
                                <path d="M16 10h-4V6"/>
                                <path d="M2 12a10 10 0 1 1 10 10H2v-4a2 2 0 0 1 2-2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div id="report-content" class="details-content" contenteditable="false"></div>
                <div class="details-actions">
                    <button id="undo-report-btn" class="details-btn undo-btn" disabled>Geri Al</button>
                    <button id="edit-report-btn" class="details-btn">Düzenle</button>
                    <button id="save-report-btn" class="details-btn save-btn">Kaydet</button>
                </div>
            </div>
        </div>

        <div id="personal-info-container">
            <div class="details-card">
                <div class="details-card-header">
                    <div class="section-title-text">
                        <h3>Kişisel Bilgiler</h3>
                        <button class="ai-action-btn" id="ai-personal-info-btn" title="Yapay Zeka ile Bilgileri Geliştir">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="m12 14 4-4"/>
                                <path d="M16 10h-4V6"/>
                                <path d="M2 12a10 10 0 1 1 10 10H2v-4a2 2 0 0 1 2-2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div id="personal-info-content" class="details-content" contenteditable="false"></div>
                <div class="details-actions">
                    <button id="undo-personal-info-btn" class="details-btn undo-btn" disabled>Geri Al</button>
                    <button id="edit-personal-info-btn" class="details-btn">Düzenle</button>
                    <button id="save-personal-info-btn" class="details-btn save-btn">Kaydet</button>
                </div>
            </div>
        </div>

        <div id="credits-container">
            <div class="details-card">
                <div class="details-card-header">
                    <h3>Emeği Geçenler ve Kaynakça</h3>
                </div>
                <h4>Emeği Geçenler</h4>
                <ul id="credits-list"></ul>
                <div class="contributor-form">
                    <input type="text" id="contributor-input" class="ai-hint-input" placeholder="İsim Soyisim, Rol">
                    <button id="add-contributor-btn" class="details-btn">Ekle (AI ile)</button>
                </div>
                <h4 style="margin-top:2rem">Kaynakça</h4>
                <ul id="bibliography-list">
                    <li>Google. (2024). Gemini [Büyük Dil Modeli]. Bu projede kullanılan metinlerin, açıklamaların ve kodların bir kısmı Gemini yapay zeka modeli tarafından üretilmiş veya düzenlenmiştir.</li>
                </ul>
            </div>
        </div>
    </div>

    <div id="ai-modal-overlay"></div>

    <div id="ai-inspector-wrapper">
        <div class="inspector-container">
            <h2 class="section-title">
                <div class="section-title-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m12 14 4-4"/>
                        <path d="M16 10h-4V6"/>
                        <path d="M2 12a10 10 0 1 1 10 10H2v-4a2 2 0 0 1 2-2z"/>
                    </svg>
                    AI Analizci
                </div>
                <button id="clear-chat-btn" title="Sohbeti Temizle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </h2>
            <div id="inspector-content" class="inspector-content">
                <div id="chat-log"></div>
                <div class="follow-up-section" id="follow-up-section">
                    <div class="follow-up-input-group">
                        <textarea id="follow-up-input" placeholder="Mesajınızı yazın..." rows="1"></textarea>
                        <button id="follow-up-btn">Gönder</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<button id="admin-login-btn">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
    <span>Proje Sahibi Girişi</span>
</button>

<div id="login-modal-overlay">
    <div id="login-modal">
        <h2>Yönetici Girişi</h2>
        <p>Lütfen proje sahibi kimlik bilgilerinizi girin.</p>
        <div id="login-error-msg"></div>
        <input type="email" id="login-email" placeholder="Admin ID" required>
        <input type="password" id="login-password" placeholder="Şifre" required>
        <button id="login-submit-btn">Giriş Yap</button>
        <button id="login-close-btn" title="Kapat">&times;</button>
    </div>
</div>