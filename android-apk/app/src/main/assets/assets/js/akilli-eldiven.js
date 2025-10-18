    // Global variables for Firebase callbacks
    let phaseData = [];


    document.addEventListener('DOMContentLoaded', function () {
        // Loading screen gizle
        const loading = document.getElementById('loading-screen');
        if (loading) loading.classList.add('hidden');

        // Admin butonunu görünür kıl
        const btn = document.getElementById('admin-login-btn');
        if (btn) {
            btn.style.display = 'flex';
            btn.style.opacity = '0.1'; // pasif görünüm
            btn.style.pointerEvents = 'auto';
            btn.style.position = 'fixed';
            btn.style.bottom = '1rem';
            btn.style.left = '1rem';
            btn.style.zIndex = '2147483647';
            btn.style.transition = 'opacity 0.2s ease';
        }
        // Admin giriş butonu eksikse oluştur (merkezî konum: sol alt)
        if (!document.getElementById('admin-login-btn')) {
            const adminBtn = document.createElement('button');
            adminBtn.id = 'admin-login-btn';
            adminBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                <span>Proje Sahibi Girişi</span>
            `;
            document.body.appendChild(adminBtn);
        }
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$', right: '$', display: false}
            ],
            throwOnError : false
        });

        Chart.register(ChartDataLabels);

        const themeColors = { slate400: '#94a3b8', slate800: '#1e293b', slate700: '#334155', sky500: '#0ea5e9', sky400: '#38bdf8', emerald500: '#10b981', amber400: '#fbbf24', red500: '#ef4444', slate100: '#f1f5f9' };
        Chart.defaults.color = themeColors.slate400;
        Chart.defaults.font.family = 'Inter';
        const globalChartOptions = (isDonut = false) => ({ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: isDonut ? 'bottom' : 'top', labels: { padding: 20 } }, tooltip: { backgroundColor: themeColors.slate800, borderColor: themeColors.slate700, borderWidth: 1, padding: 12, titleFont: { weight: 'bold' }, bodyFont: { size: 14 } } } });

        new Chart(document.getElementById('componentDonutChart').getContext('2d'), { type: 'doughnut', data: { labels: ['MCU', 'IMU', 'RF Kanalı', 'Güç Yönetimi'], datasets: [{ data: [2, 1, 8, 1], backgroundColor: [themeColors.sky500, themeColors.emerald500, themeColors.amber400, themeColors.red500], borderColor: themeColors.slate800, borderWidth: 4 }] }, options: { ...globalChartOptions(true), cutout: '70%' } });

        let costBarChartInstance = null;
        function createCostBarChart() {
            if (costBarChartInstance) return;
            costBarChartInstance = new Chart(document.getElementById('costBarChart').getContext('2d'), { type: 'bar', data: { labels: ['MCU & Saat', 'IMU', 'RF Kanalları', 'Güç Yönetimi'], datasets: [{ label: 'Tahmini Maliyet (USD)', data: [18, 20, 50, 12], backgroundColor: [themeColors.sky500, themeColors.emerald500, themeColors.amber400, themeColors.red500], borderRadius: 4 }] }, options: { ...globalChartOptions(false), indexAxis: 'y', scales: { x: { grid: { color: themeColors.slate700 } }, y: { grid: { display: false } } } } });
        }

        const qFactorCtx = document.getElementById('qFactorChart').getContext('2d');
        new Chart(qFactorCtx, {
            type: 'bar',
            data: {
                labels: ['Hesaplanan', 'Simülasyon', 'İstenen'],
                datasets: [{
                    data: [25.5, 25.8, 60],
                    backgroundColor: [themeColors.amber400, themeColors.sky400, themeColors.emerald500],
                    borderRadius: 12,
                    borderSkipped: false,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 70,
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        color: themeColors.slate100,
                        font: { weight: 'bold', size: 12 }
                    }
                }
            }
        });


        document.querySelectorAll('.detail-toggle').forEach(button => {
            button.addEventListener('click', () => {
                const target = document.getElementById(button.dataset.target);
                const isExpanded = target.classList.toggle('expanded');
                button.setAttribute('aria-expanded', isExpanded);
                button.textContent = isExpanded ? button.dataset.textExpanded : button.dataset.textDefault;
                if (button.dataset.target === 'hardware-details' && isExpanded) {
                    createCostBarChart();
                }
            });
        });

        const archBlocks = document.querySelectorAll('.arch-block');
        archBlocks.forEach(block => {
            block.addEventListener('click', () => {
                archBlocks.forEach(b => b.classList.remove('active'));
                block.classList.add('active');
                document.getElementById('arch-details').innerHTML = `<h3 class="font-bold text-lg mb-2 text-sky-500">${block.dataset.title}</h3><p>${block.dataset.desc}</p>`;
            });
        });

        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        menuBtn.addEventListener('click', () => {
            const isActive = document.body.classList.toggle('menu-active');
            menuBtn.setAttribute('aria-expanded', isActive);
        });


        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('main section');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href').substring(1) === entry.target.id));
                }
            });
        }, { rootMargin: '-50% 0px -50% 0px' });
        sections.forEach(section => sectionObserver.observe(section));

        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.animated-section').forEach(section => animationObserver.observe(section));

        // --- YOL HARİTASI (FAZLAR) BÖLÜMÜ ---
        phaseData = [
            {
                title: 'Faz 1: Donanım ve Pasif Sistem Karakterizasyonu', status: 'completed',
                details: {
                    wbs: [
                        "PCB Montajı: Lehim pastası serimi, SMD komponent dizgisi, Reflow fırınlama, THT komponent lehimlemesi.",
                        "Güç Sistemi Doğrulaması: Regülatör çıkış voltajlarının (3.3V) doğruluğunun ve kararlılığının ölçümü.",
                        "Pasif Sistem Testleri: VNA ile rezonatörlerin empedans ölçümü, rezonans frekansı ($f_0$) ve Kalite (Q) faktörünün tespiti."
                    ],
                    resources: {
                        hardware: "Vektör Network Analizörü (VNA), Osiloskop, Ayarlı Güç Kaynağı, Lehimleme İstasyonu",
                        software: "KiCad (PCB Tasarım), SPICE (Simülasyon)",
                        personnel: "PCB Tasarımcısı, Elektronik Teknisyeni"
                    },
                    deliverables: "Montajı tamamlanmış PCB (v1.0), Güç sistemi test raporu, Pasif sistem karakterizasyon raporu (VNA ölçüm sonuçları ile).",
                    risks: [
                        { id: 'R1.1', text: "Lehimleme hatalarından (kısa devre/açık devre) devre fonksiyonunu engellenmesi.", mitigation: "Montaj sonrası mikroskop altında detaylı görsel inceleme ve sürekliliik testleri.", level: "medium" },
                    ],
                    timeline: "5 adam-gün"
                }
            },
            {
                title: 'Faz 2: Aktif Devre Entegrasyonu ve Q-Faktörü Yükseltmesi', status: 'in-progress',
                details: {
                    wbs: [
                        "Q-Multiplier Devre Entegrasyonu: TLV9061 op-amp ve çevre bileşenlerinin devreye montajı.",
                        "Kalibrasyon ve Ayarlama: Devrenin kazanç ve geri besleme parametrelerinin, osilasyona girmeden maksimum Q-faktörünü sağlayacak şekilde ayarlanması.",
                        "Performans Doğrulaması: Ayarlanmış devrenin VNA ile tekrar ölçülerek hedeflenen Q-faktörüne (>65) ulaşıldığının teyit edilmesi."
                    ],
                    resources: {
                        hardware: "VNA, Osiloskop, Sinyal Jeneratörü, Spektrum Analizörü (opsiyonel)",
                        software: "SPICE (Detaylı simülasyon)",
                        personnel: "RF Devre Tasarımı yetkinliğine sahip mühendis"
                    },
                    deliverables: "Kalibre edilmiş, stabil çalışan Q-Multiplier devresi. Hedef Q-faktörüne ulaşıldığını gösteren karşılaştırmalı test raporu.",
                    risks: [
                        { id: 'R2.1', text: "Devrenin kararsız hale gelip osilasyon yapmasından sistemi kullanılamaz hale getirmesi.", mitigation: "Geri besleme döngüsünün dikkatli ayarlanması, gerekirse faz marjını artırmak için ek kompanzasyon bileşenleri eklenmesi.", level: "high" }
                    ],
                    timeline: "8 adam-gün"
                }
            },
            {
                title: 'Faz 3: Sensör Entegrasyonu ve Ham Veri Doğrulaması', status: 'planned',
                details: {
                    wbs: [
                        "ADC Entegrasyonu: MCP3204 ADC'nin SPI arayüzü üzerinden ESP32 ile haberleştirilmesi.",
                        "IMU Entegrasyonu: BNO085 IMU'nun I2C arayüzü üzerinden ESP32 ile haberleştirilmesi.",
                        "Veri Akışının Sağlanması: Tüm (4 adet) endüktif kanaldan ve IMU'dan gelen verilerin eş zamanlı ve güvenilir bir şekilde okunup seri port üzerinden loglanması.",
                        "Veri Doğrulama: Elin bilinen pozisyon ve hareketlerine karşılık gelen sensör verilerinin beklenen aralıklarda ve tutarlı olduğunun kontrolü."
                    ],
                    resources: {
                        hardware: "Lojik Analizörü",
                        software: "PlatformIO/Arduino IDE, Seri port görüntüleyici (örn: CoolTerm)",
                        personnel: "Gömülü Yazılım Mühendisi"
                    },
                    deliverables: "Tüm sensörlerden gelen ham verileri stabil bir şekilde loglayan firmware. Verilerin tutarlılığını gösteren test raporu.",
                    risks: [
                        { id: 'R3.1', text: "Veri yolu (I2C/SPI) çakışmalarından veya gürültüden veri bütünlüğünün bozulması.", mitigation: "Doğru pull-up dirençleri kullanmak, veri yolu hızlarını optimize etmek ve sinyal hatlarını kısa tutmak.", level: "medium" }
                    ],
                    timeline: "10 adam-gün"
                }
            },
            {
                title: 'Faz 4: Deterministik Firmware Altyapısı', status: 'planned',
                details: {
                    wbs: [
                        "Yazılım Mimarisi Seçimi: Zamanlayıcı kesmeleri (timer interrupts) tabanlı bir 'super-loop' mimarisi oluşturulması.",
                        "Durum Makinesi (State Machine) Tasarımı: Sistemin 'Kalibrasyon', 'Aktif Kontrol', 'Bekleme' gibi durumlarını ve aralarındaki geçişleri yöneten bir yapı kurulması.",
                        "Görev Zamanlaması: Sensör okuma (yüksek öncelikli), veri işleme ve Bluetooth iletim görevlerinin deterministik aralıklarla çalışmasının sağlanması."
                    ],
                    resources: {
                        hardware: "Osiloskop (görev sürelerini ölçmek için)",
                        software: "PlatformIO, C++, UML araçları (durum makinesi görselleştirmesi için)",
                        personnel: "Gömülü Yazılım Mimarisi konusunda deneyimli mühendis"
                    },
                    deliverables: "İyi yapılandırılmış, durum makinesi tabanlı, gerçek zamanlı firmware iskeleti. Görevlerin zamanlamasını gösteren mimari dokuman.",
                    risks: [
                        { id: 'R4.1', text: "Görevlerin zamanında bitirilmemesinden sistemin kararsız çalışması ve kontrol gecikmesi oluşması.", mitigation: "Kodun optimize edilmesi, gereksiz işlemlerden kaçınılması ve görevlerin yürütme sürelerinin osiloskop ile ölçülerek doğrulanması.", level: "high" }
                    ],
                    timeline: "12 adam-gün"
                }
            },
            {
                title: 'Faz 5: Füzyon Motoru ve Jest Kalibrasyonu', status: 'planned',
                details: {
                     wbs: [
                        "Sensör Füzyon Algoritması Geliştirme: Statik duruş (endüktif sensörler) ve dinamik hareket (IMU) verilerini birleştiren bir eşik tabanlı mantık veya basit bir filtre tasarlanması.",
                        "Jest Tanımlama: 'İleri git', 'yüksel', 'dön' gibi komutlara karşılık gelen sensör veri desenlerinin tanımlanması.",
                        "Kalibrasyon Rutini Geliştirme: Sistemin başlangıçta kullanıcının elinin temel duruşlarını (açık el, yumruk) öğrenmesini sağlayan bir kalibrasyon sihirbazı yazılması."
                    ],
                    resources: {
                        hardware: "3D Yazıcı (kalibrasyon ve test jigleri için)",
                        software: "Python/MATLAB (veri analizi ve algoritma prototipleme için), C++ (gömülü implementasyon)",
                        personnel: "Gömülü Yazılım Mühendisi, Sinyal İşleme/ML Uzmanı"
                    },
                    deliverables: "Ham sensör verilerini drone komutlarına dönüştüren C++ fonksiyon kütüphanesi. Jest tanıma doğruluğunu (>%95) belgeleyen test sonuçları.",
                    risks: [
                        { id: 'R5.1', text: "Farklı kullanıcıların el anatomileri veya hareket tarzlarından jest tanıma doğruluğunun düşük olması.", mitigation: "Kalibrasyon rutinini geliştirmek ve algoritmayı daha adaptif hale getirmek için eşik değerlerini ayarlanabilir yapmak.", level: "medium" }
                    ],
                    timeline: "15 adam-gün"
                }
            },
            {
                title: 'Faz 6: Uçtan Uca Entegrasyon ve Sistem Testleri', status: 'planned',
                details: {
                    wbs: [
                        "BLE İletişim Protokolü Tanımlama: Eldiveden gönderilecek komut paketinin (örn: [roll, pitch, yaw, throttle]) formatının belirlenmesi.",
                        "Mobil Arayüz Geliştirme: Eldiveden gelen BLE verilerini alıp DJI Mobile SDK aracılığıyla drone'a ileten basit bir Android uygulaması geliştirilen.",
                        "Sistem Performans Testleri: Uçtan uca gecikme süresinin (<200ms) ve jest tanıma doğruluğunun gerçek uçuş senaryolarında ölçülmesi.",
                        "Güvenlik Mekanizmaları: Bağlantı kopması durumunda drone'un havada sabit kalmasını (hover) sağlayan bir 'failsafe' mekanizması eklenmesi."
                    ],
                    resources: {
                        hardware: "DJI Drone, Android Telefon",
                        software: "Android Studio, DJI Mobile SDK, Wireshark (BLE paket analizi için)",
                        personnel: "Mobil Uygulama Geliştirici (Android), Test Mühendisi"
                    },
                    deliverables: "Tam fonksiyonel prototip. Uçuş testlerini, ölçülen performans metriklerini ve sonuçları içeren nihai proje raporu ve video gösterimi.",
                    risks: [
                        { id: 'R6.1', text: "BLE bağlantısının gecikmeli veya kararsız olmasından drone kontrolünün tehlikeli hale gelmesi.", mitigation: "BLE bağlantı interval'lerini optimize etmek ve veri paketi boyutunu minimumda tutmak.", level: "high" }
                    ],
                    timeline: "20 adam-gün"
                }
            }
        ];

        const phaseContainer = document.getElementById('phase-container');
        const statusConfig = {
            completed: { text: 'BAŞARIYLA TAMAMLANDI', colorClass: 'text-emerald-500', dotHTML: '' },
            'in-progress': { text: 'DEVAM EDİYOR', colorClass: 'text-sky-400', dotHTML: '' },
            planned: { text: 'PLANLANDI', colorClass: 'text-slate-500', dotHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>' }
        };

        const detailTabIcons = {
            wbs: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>',
            resources: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>',
            deliverables: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>',
            risks: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
            timeline: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
        };

        function renderPhases() {
            phaseContainer.innerHTML = '';
            phaseData.forEach((phase, index) => {
                const config = statusConfig[phase.status];
                const phaseElement = document.createElement('div');
                phaseElement.className = `phase ${phase.status}`;
                phaseElement.dataset.index = index;

                const detailsHTML = `
                    <div class="phase-details-nav">
                        <button class="phase-details-tab active" data-tab="wbs">${detailTabIcons.wbs} Görevler</button>
                        <button class="phase-details-tab" data-tab="resources">${detailTabIcons.resources} Kaynaklar</button>
                        <button class="phase-details-tab" data-tab="deliverables">${detailTabIcons.deliverables} Çıktılar</button>
                        <button class="phase-details-tab" data-tab="risks">${detailTabIcons.risks} Riskler</button>
                        <button class="phase-details-tab" data-tab="timeline">${detailTabIcons.timeline} Zamanlama</button>
                    </div>
                    <div class="space-y-4 pt-4">
                        <div id="wbs-${index}" class="phase-details-content active"><div class="detail-card"><h5>İş Döküm Ağacı (WBS)</h5><ul class="list-disc text-slate-400 space-y-2">${phase.details.wbs.map(item => `<li>${item}</li>`).join('')}</ul></div></div>
                        <div id="resources-${index}" class="phase-details-content"><div class="grid md:grid-cols-2 gap-4">${Object.entries(phase.details.resources).map(([key, value]) => `<div class="detail-card"><h5 class="capitalize">${key.replace('_', ' ')}</h5><p>${value}</p></div>`).join('')}</div></div>
                        <div id="deliverables-${index}" class="phase-details-content"><div class="detail-card"><h5>Başarı Kriterleri ve Çıktılar</h5><p>${phase.details.deliverables}</p></div></div>
                        <div id="risks-${index}" class="phase-details-content"><div class="space-y-4">${phase.details.risks.map(risk => `<div class="detail-card risk-card risk-${risk.level}"><h5>Risk: ${risk.text}</h5><p><strong>Önlem Planı:</strong> ${risk.mitigation}</p></div>`).join('')}</div></div>
                        <div id="timeline-${index}" class="phase-details-content"><div class="detail-card"><h5>Tahmini Zaman Çizelgesi</h5><p class="text-lg font-semibold">${phase.details.timeline}</p></div></div>
                    </div>`;

                phaseElement.innerHTML = `
                    <div class="flex-shrink-0 pt-1"><div class="phase-dot-container"><div class="phase-dot">${config.dotHTML}</div></div></div>
                    <div class="flex-grow relative min-w-0">
                        <div class="phase-header" role="button" aria-expanded="false" aria-controls="phase-content-${index}">
                            <h3 class="font-bold text-lg text-slate-100">${phase.title}</h3>
                            <span class="phase-status text-sm font-semibold block mt-1 ${config.colorClass}">${config.text}</span>
                        </div>
                        <div id="phase-content-${index}" class="phase-content-wrapper bg-slate-800/50 p-4 rounded-xl border border-slate-700">${detailsHTML}</div>
                        <div class="absolute top-0 right-0 pt-1">
                            <button class="p-2 rounded-full hover:bg-slate-700 transition-colors phase-settings-btn" aria-label="Faz durumunu değiştir"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-400"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></button>
                            <div class="phase-status-menu hidden absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10">
                                <button data-status="completed" class="w-full text-left px-4 py-2 text-sm hover:bg-slate-700">Tamamlandı</button>
                                <button data-status="in-progress" class="w-full text-left px-4 py-2 text-sm hover:bg-slate-700">Devam Ediyor</button>
                                <button data-status="planned" class="w-full text-left px-4 py-2 text-sm hover:bg-slate-700">Planlandı</button>
                            </div>
                        </div>
                    </div>`;
                phaseContainer.appendChild(phaseElement);
            });
            renderMathInElement(phaseContainer, { delimiters: [ {left: '$', right: '$', display: false} ], throwOnError : false });
        }

        phaseContainer.addEventListener('click', (e) => {
            const phaseElement = e.target.closest('.phase');
            if (!phaseElement) return;

            if (e.target.closest('.phase-header')) {
                const currentlyActive = document.querySelector('.phase.active');
                if (currentlyActive && currentlyActive !== phaseElement) {
                    currentlyActive.classList.remove('active');
                }
                phaseElement.classList.toggle('active');
                setTimeout(calculateConnectorHeights, 700);
            }
            if (e.target.closest('.phase-settings-btn')) {
                e.stopPropagation();
                const menu = phaseElement.querySelector('.phase-status-menu');
                if (menu) menu.classList.toggle('hidden');
            }
            if (e.target.closest('.phase-status-menu button')) {
                const newStatus = e.target.dataset.status;
                phaseData[phaseElement.dataset.index].status = newStatus;
                renderPhases();
                setTimeout(calculateConnectorHeights, 100);
                // Firebase'e yalnızca adminken yaz
                if (isAdmin) {
                    set(ref(database, 'publicContent/roadmapPhases'), phaseData).catch(() => {});
                }
            }
            if (e.target.closest('.phase-details-tab')) {
                const tabName = e.target.dataset.tab;
                phaseElement.querySelectorAll('.phase-details-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                phaseElement.querySelectorAll('.phase-details-content').forEach(c => c.classList.remove('active'));
                const content = phaseElement.querySelector(`#${tabName}-${phaseElement.dataset.index}`);
                if (content) content.classList.add('active');
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.phase-settings-btn')) {
                 document.querySelectorAll('.phase-status-menu').forEach(m => m.classList.add('hidden'));
            }
        });

        function calculateConnectorHeights() {
            const phases = document.querySelectorAll('.phase');
            phases.forEach((phase, index) => {
                if (index < phases.length - 1) {
                    const nextPhase = phases[index + 1];
                    const currentDotRect = phase.querySelector('.phase-dot-container').getBoundingClientRect();
                    const nextDotRect = nextPhase.querySelector('.phase-dot-container').getBoundingClientRect();
                    const distance = nextDotRect.top - currentDotRect.bottom;
                    phase.style.setProperty('--connector-height', `${Math.max(0, distance)}px`);
                }
            });
        }

        renderPhases();
        setTimeout(calculateConnectorHeights, 100);
        window.addEventListener('resize', calculateConnectorHeights);
    });
  
    
    
    // Firebase kütüphanelerinden gerekli fonksiyonları içe aktar
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
    import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
    import { getAuth, signInAnonymously, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

    // --- FIREBASE KURULUMU ---
    const firebaseConfig = {
        apiKey: "AIzaSyBRcjPzkljNjXVRM1jn_KGCheXhQY54fcs",
        authDomain: "akillieldiven.firebaseapp.com",
        databaseURL: "https://akillieldiven-default-rtdb.firebaseio.com",
        projectId: "akillieldiven",
        storageBucket: "akillieldiven.appspot.com",
        messagingSenderId: "887514657698",
        appId: "1:887514657698:web:fef8471170e3c2bf2db8fb"
    };

    // Firebase'i başlat ve servislere referans oluştur
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const auth = getAuth(app); // Auth servisine referans oluştur
    // Yönetici hesabınızın e-posta adresini buraya yazın
    const ADMIN_EMAILS = ["yalp@admin.com", "ezgi@admin.com", "kectny@admin.com"];

    // --- API ANAHTARLARI VE YARDIMCI FONKSİYONLAR ---
    const apiKeysEncoded = [
        'QUl6YVN5QUdRX281LXA0bTFPRWFXWVJId2pRWjMwb09wS1JyQXc4',
        'QUl6YVN5Qm1YOWhUMUhRNGlEOHU4ZnVlSG95TEZFdUJrSTVnWS1j',
        'QUl6YVN5RGpaMk1ock1WNXdzWG8tRmgtRnI3VjNzTy1SMkFBd0FN',

        'QUl6YVN5RE1JMWtGYVpPRDE1TmRhdldDQm0yT19vQkZOQ1dBUzVj',
        'QUl6YVN5RGNfYVMybjk3eUFPWFJGeEJaLVc1b0xNOVFSNWQzeWNv',
        'QUl6YVN5RHphTlFlU1ljUk1qZmlOYnhGa3AzU1Q3bFRxVEJMWEg4',
    ];

    let currentApiIndex = 0;

    function getNextApiKeyAndDecode() {
        const encodedKey = apiKeysEncoded[currentApiIndex];
        currentApiIndex = (currentApiIndex + 1) % apiKeysEncoded.length;
        return atob(encodedKey); // atob() fonksiyonu Base64 kodunu çözer
    }

    const proApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent`;
    const flashApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

    // Button cooldown sistemi
    const buttonCooldowns = new Map();
    const BUTTON_COOLDOWN_TIME = 1000;

    function isButtonOnCooldown(buttonId) {
        const lastClickTime = buttonCooldowns.get(buttonId);
        if (!lastClickTime) return false;
        return Date.now() - lastClickTime < BUTTON_COOLDOWN_TIME;
    }

    function setButtonCooldown(buttonId) {
        buttonCooldowns.set(buttonId, Date.now());
    }

    // API kuyruk sistemi
    const apiQueue = [];
    let isProcessingQueue = false;

    async function addToApiQueue(apiCall) {
        return new Promise((resolve, reject) => {
            apiQueue.push({ apiCall, resolve, reject });
            processQueue();
        });
    }

    async function processQueue() {
        if (isProcessingQueue || apiQueue.length === 0) return;
        isProcessingQueue = true;

        while (apiQueue.length > 0) {
            const { apiCall, resolve, reject } = apiQueue.shift();
            try {
                const result = await apiCall();
                resolve(result);
            } catch (error) {
                reject(error);
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        isProcessingQueue = false;
    }

    // --- DOM ELEMENTLERİ ---
    const mainTechContainer = document.getElementById('technical-guides-wrapper');
    const selectionContainer = document.getElementById('selection-container');
    const hardwareGuideContainer = document.getElementById('hardware-guide-container');
    const softwareGuideContainer = document.getElementById('software-guide-container');
    const reportGuideContainer = document.getElementById('report-guide-container');
    const detailsGuideContainer = document.getElementById('details-guide-container');
    const homeBtn = document.getElementById('home-btn');
    const backBtnHeader = document.getElementById('back-btn-header');
    const mainSubtitle = document.getElementById('main-subtitle');

    // AI Inspector elementleri
    const aiModalOverlay = document.getElementById('ai-modal-overlay');
    const aiInspectorWrapper = document.getElementById('ai-inspector-wrapper');
    const chatLog = document.getElementById('chat-log');
    const inspectorContent = document.getElementById('inspector-content');
    const followUpInput = document.getElementById('follow-up-input');
    const followUpBtn = document.getElementById('follow-up-btn');
    const clearChatBtn = document.getElementById('clear-chat-btn');

    // Komponent listesi elementleri
    const componentListEl = document.getElementById('component-list');
    const newComponentInput = document.getElementById('new-component-input');
    const addComponentBtn = document.getElementById('add-component-btn');
    const sortControls = document.querySelector('.sort-controls');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const undoDeleteBtn = document.getElementById('undo-delete-btn');

    // Detay sayfaları elementleri
    const detailsSelectionContainer = document.getElementById('details-selection-container');
    const projectReportContainer = document.getElementById('project-report-container');
    const personalInfoContainer = document.getElementById('personal-info-container');
    const creditsContainer = document.getElementById('credits-container');

    // Proje raporu elementleri
    const aiReportBtn = document.getElementById('ai-report-btn');
    const editReportBtn = document.getElementById('edit-report-btn');
    const saveReportBtn = document.getElementById('save-report-btn');
    const undoReportBtn = document.getElementById('undo-report-btn');
    const reportContent = document.getElementById('report-content');

    // Kişisel bilgiler elementleri
    const aiPersonalInfoBtn = document.getElementById('ai-personal-info-btn');
    const editPersonalInfoBtn = document.getElementById('edit-personal-info-btn');
    const savePersonalInfoBtn = document.getElementById('save-personal-info-btn');
    const undoPersonalInfoBtn = document.getElementById('undo-personal-info-btn');
    const personalInfoContent = document.getElementById('personal-info-content');

    // Emeği geçenler elementleri
    const contributorInput = document.getElementById('contributor-input');
    const addContributorBtn = document.getElementById('add-contributor-btn');
    const creditsList = document.getElementById('credits-list');
    const addComponentForm = document.querySelector('.add-component-form');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const loginModalOverlay = document.getElementById('login-modal-overlay');
    const loginModal = document.getElementById('login-modal');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginSubmitBtn = document.getElementById('login-submit-btn');
    const loginCloseBtn = document.getElementById('login-close-btn');
    const loginErrorMsg = document.getElementById('login-error-msg');
    const mainNavLinks = document.querySelector('.sticky-header nav');




    // --- GLOBAL DEĞİŞKENLER ---
    let isAdmin = false;
    let conversationHistory = [];
    let detailsAiContext = null;
    let isErrorState = false;
    let reportHistory = [];
    let personalInfoHistory = [];



function showGuide(type) {
    document.getElementById('welcome-screen-container').style.display = 'none';
    mainTechContainer.style.display = 'block';
    mainNavLinks.style.display = 'none';

    aiModalOverlay.classList.remove('visible');
    if (aiInspectorWrapper.parentElement && aiInspectorWrapper.parentElement !== document.body) {
        document.body.appendChild(aiInspectorWrapper);
        aiInspectorWrapper.style.display = 'none';
    }

    // ✅ TÜM CONTAINER'LARI GİZLE (selection-container dahil)
    [hardwareGuideContainer, softwareGuideContainer, reportGuideContainer,
     detailsGuideContainer, detailsSelectionContainer, selectionContainer].forEach(c => {
        if (c) c.style.display = 'none';
    });

    let guideContainer;
    switch(type) {
        case 'hardware':
            guideContainer = hardwareGuideContainer;
            mainSubtitle.textContent = 'Donanım Montaj Kılavuzu';
            document.getElementById('hardware-ai-column').appendChild(aiInspectorWrapper);
            aiInspectorWrapper.style.display = 'block';
            backBtnHeader.style.display = 'none';
            initializeGuide('hardware', hardwareData); // ✅ Direkt initialize
            break;
        case 'software':
            guideContainer = softwareGuideContainer;
            mainSubtitle.textContent = 'Yazılım Algoritma Kılavuzu';
            document.getElementById('software-ai-column').appendChild(aiInspectorWrapper);
            aiInspectorWrapper.style.display = 'block';
            backBtnHeader.style.display = 'none';
            initializeGuide('software', softwareData);
            break;
        case 'report':
            guideContainer = reportGuideContainer;
            mainSubtitle.textContent = 'Komponent Raporu';
            backBtnHeader.style.display = 'none';
            renderComponentList(componentList);
            break;
        case 'details':
            guideContainer = detailsGuideContainer;
            mainSubtitle.textContent = 'Proje Raporu ve Detaylar';
            showRoom(); // ✅ Direkt içeriğe
            break;
    }

    if(guideContainer) {
        guideContainer.style.display = 'block';
        window.scrollTo({ top: mainTechContainer.offsetTop - 70, behavior: 'smooth' });
    }

    homeBtn.style.display = 'block';
}



function toggleAdminMode(isAdminState) {
    isAdmin = isAdminState;
    // Admin yetkisi gerektiren tüm arayüz elemanları
    const adminElements = [
        addComponentForm, saveReportBtn, editReportBtn, undoReportBtn,
        savePersonalInfoBtn, editPersonalInfoBtn, undoPersonalInfoBtn,
        addContributorBtn, contributorInput, aiReportBtn, aiPersonalInfoBtn,
        document.querySelector('.contributor-form') // Bu formu da ekleyelim
    ];

    if (isAdmin) {
        // Admin Girişi Yapıldı
        console.log("Admin moduna geçildi.");
        document.body.style.boxShadow = 'inset 0 0 0 3px var(--amber-400)'; // Görsel olarak admin modunu belirt

        adminElements.forEach(el => {
            if (el) el.style.display = 'flex';
        });

        // Admin butonunu "Çıkış Yap" olarak güncelle
        adminLoginBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Yönetici Çıkışı</span>
        `;
        adminLoginBtn.classList.add('logout');
    } else {
        // Okuma Modu (Ziyaretçi veya Admin Çıkışı)
        console.log("Okuma moduna geçildi.");
        document.body.style.boxShadow = 'none';

        adminElements.forEach(el => {
            if (el) el.style.display = 'none';
        });

        // Admin butonunu "Giriş Yap" olarak ayarla
        adminLoginBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            <span>Proje Sahibi Girişi</span>
        `;
        adminLoginBtn.classList.remove('logout');
    }
    // Arayüzü yeni duruma göre tekrar çiz
    renderComponentList(componentList);
}


    // Komponent listesi
    const defaultComponentList = [
        { name: 'ESP32 Geliştirme Kartı', quantity: 1, status: 'Stokta' },
        { name: 'MPU-6050 9 Eksen IMU Sensörü', quantity: 1, status: 'Stokta' }
    ];

    let componentList = [];
    let userHints = {};
    let cachedSorts = { type: null, stage: null };
    let deleteHistory = [];

    // --- FIREBASE FONKSİYONLARI ---
    function loadDataFromFirebase() {
        // Proje raporu yükle
        onValue(ref(database, 'publicContent/projectReport'), snapshot => {
            reportContent.innerHTML = snapshot.val() || 'Rapor içeriği henüz oluşturulmadı...';
        });

        // Kişisel bilgiler yükle
        onValue(ref(database, 'publicContent/personalInfo'), snapshot => {
            personalInfoContent.innerHTML = snapshot.val() || 'Kişisel bilgiler henüz girilmedi...';
        });

        // Emeği geçenler yükle
        onValue(ref(database, 'publicContent/credits'), snapshot => {
            creditsList.innerHTML = snapshot.val() || '';
        });

        // Yol haritası fazları yükle
        onValue(ref(database, 'publicContent/roadmapPhases'), snapshot => {
            const data = snapshot.val();
            if (Array.isArray(data) && data.length) {
                phaseData = data;
                renderPhases();
                setTimeout(calculateConnectorHeights, 100);
            }
        });

        // Komponent listesi yükle
        onValue(ref(database, 'publicContent/components'), snapshot => {
            const data = snapshot.val();
            if (data && data.list) {
                componentList = data.list;
                userHints = data.hints || {};
            } else {
                componentList = defaultComponentList.map(c => ({...c}));
                userHints = {};
                saveComponentDataToFirebase();
            }
            renderComponentList(componentList);
        });
    }

    function saveComponentDataToFirebase() {
        if (!isAdmin) return;
        set(ref(database, 'publicContent/components'), {
            list: componentList,
            hints: userHints
        });
    }

    // --- DONANIM VERİLERİ ---
    function getHardwareData() {
        const icTemplate = (title, pins) => {
            const pinLayout = [
                { x: 50, y: 100 }, { x: 50, y: 140 }, { x: 50, y: 180 }, { x: 50, y: 220 },
                { x: 250, y: 220 }, { x: 250, y: 180 }, { x: 250, y: 140 }, { x: 250, y: 100 }
            ];

            let pinElements = '';
            for(let i = 0; i < 8; i++){
                const p = pinLayout[i];
                const pinNum = i + 1;
                const pinContent = pins[pinNum] || {};
                pinElements += `
                    <g class="net-node" data-net-id="${pinContent.net || 'nc'}" data-component="${title}" data-pin="${pinNum}">
                        <rect x="${p.x - 15}" y="${p.y - 15}" width="30" height="30" fill-opacity="0"/>
                        <circle cx="${p.x}" cy="${p.y}" r="7" class="ic-pin-pad net-pin"/>
                        <text x="${p.x}" y="${p.y + 4}" class="ic-pin-label">${pinNum}</text>
                    </g>
                `;
            }

            return `
                <svg viewBox="0 0 350 350" class="detail-schematic-svg">
                    <rect x="75" y="75" width="150" height="170" rx="10" class="ic-body" />
                    <path d="M 130 75 a 20 20 0 0 0 40 0" fill="var(--slate-800)" stroke="var(--slate-800)" stroke-width="2" />
                    <text x="150" y="165" text-anchor="middle" class="label">${title}</text>
                    ${pinElements}
                </svg>
            `;
        };

        const stages = {
            'vref': {
                shortTitleLine1: 'SANAL',
                shortTitleLine2: 'TOPRAK',
                longTitle: 'Sanal Toprak (Vref) Oluşturma'
            },
            'input_stage': {
                shortTitleLine1: 'GİRİŞ KATI',
                shortTitleLine2: '(U1)',
                longTitle: 'Giriş Katı: Buffer ve Yükselteç'
            },
            'rectifier': {
                shortTitleLine1: 'DOĞRULTUCU',
                shortTitleLine2: '(U2)',
                longTitle: 'Hassas Doğrultucu'
            },
            'filter': {
                shortTitleLine1: 'ÇIKIŞ',
                shortTitleLine2: 'FİLTRESİ',
                longTitle: 'Alçak Geçiren Filtre'
            }
        };

        const schematics = {
            'vref': `
                <svg viewBox="0 0 400 350" class="detail-schematic-svg">
                    <!-- Güç girişleri -->
                    <g class="net-node" data-net-id="vcc" data-component="Güç Girişi">
                        <line x1="50" y1="80" x2="200" y2="80" class="net-wire wire-power"/>
                        <text x="45" y="85" class="label" text-anchor="end">+9V</text>
                    </g>

                    <g class="net-node" data-net-id="gnd" data-component="Güç Girişi">
                        <line x1="50" y1="280" x2="200" y2="280" class="net-wire wire-gnd"/>
                        <text x="45" y="285" class="label" text-anchor="end">GND</text>
                    </g>

                    <!-- R1 Direnci -->
                    <g class="component-resistor" title="R1 (10k)">
                        <path d="M 200,90 L 200,95 L 190,105 L 210,115 L 190,125 L 210,135 L 200,145 L 200,150" fill="none" stroke="var(--slate-900)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M 200,90 L 200,95 L 190,105 L 210,115 L 190,125 L 210,135 L 200,145 L 200,150" fill="none" stroke="var(--slate-300)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <text x="225" y="120" class="label">R1 (10k)</text>

                    <!-- R2 Direnci -->
                    <g class="component-resistor" title="R2 (10k)">
                        <path d="M 200,190 L 200,195 L 190,205 L 210,215 L 190,225 L 210,235 L 200,245 L 200,250" fill="none" stroke="var(--slate-900)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M 200,190 L 200,195 L 190,205 L 210,215 L 190,225 L 210,235 L 200,245 L 200,250" fill="none" stroke="var(--slate-300)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <text x="225" y="220" class="label">R2 (10k)</text>

                    <!-- Vref bağlantısı -->
                    <g class="net-node" data-net-id="vref" data-component="R1/R2">
                        <line x1="200" y1="150" x2="200" y2="190" class="net-wire wire-vref"/>
                        <line x1="200" y1="170" x2="300" y2="170" class="net-wire wire-vref"/>
                        <text x="305" y="175" class="label">Vref</text>
                    </g>

                    <!-- Bağlantı telleri -->
                    <line x1="200" y1="80" x2="200" y2="90" class="wire-power net-wire" data-net-id="vcc"/>
                    <line x1="200" y1="250" x2="200" y2="280" class="wire-gnd net-wire" data-net-id="gnd"/>
                </svg>
            `,
            'input_stage': icTemplate('U1: MCP6002', {
                1: { net: 'buffer-out' },
                2: { net: 'buffer-out' },
                3: { net: 'signal-in' },
                4: { net: 'gnd' },
                5: { net: 'buffer-out' },
                6: { net: 'amp-feedback' },
                7: { net: 'amp-out' },
                8: { net: 'vcc' }
            }),
            'rectifier': icTemplate('U2: MCP6002', {
                1: { net: 'rectifier-diode' },
                2: { net: 'vref' },
                3: { net: 'amp-out' },
                4: { net: 'gnd' },
                8: { net: 'vcc' },
                5: {net: 'nc'},
                6: {net: 'nc'},
                7: {net: 'nc'}
            }),
            'filter': `
                <svg viewBox="0 0 400 350" class="detail-schematic-svg">
                    <!-- Giriş sinyali -->
                    <g class="net-node" data-net-id="rectifier-out" data-component="D1">
                        <line x1="20" y1="170" x2="100" y2="170" class="net-wire wire-signal"/>
                        <text x="15" y="175" class="label" text-anchor="end">Giriş</text>
                    </g>

                    <!-- R11 Direnci -->
                    <g class="component-resistor" title="R11 (10k)">
                        <path d="M 100,170 L 105,170 L 115,160 L 125,180 L 135,160 L 145,180 L 155,170 L 160,170" fill="none" stroke="var(--slate-900)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M 100,170 L 105,170 L 115,160 L 125,180 L 135,160 L 145,180 L 155,170 L 160,170" fill="none" stroke="var(--slate-300)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <text x="130" y="155" class="label" text-anchor="middle">R11 (10k)</text>

                    <!-- C6 Kapasitörü -->
                    <g class="component-capacitor" title="C6 (1µF)">
                        <line x1="190" y1="185" x2="190" y2="225" stroke-width="2" stroke="var(--slate-300)"/>
                        <path d="M175 225 L205 225 M175 235 L205 235" stroke-width="2" stroke="var(--slate-300)" />
                    </g>
                    <text x="220" y="235" class="label">C6 (1µF)</text>

                    <!-- Çıkış bağlantısı -->
                    <g class="net-node" data-net-id="mcu-out" data-component="R11/C6">
                        <line x1="160" y1="170" x2="190" y2="170" class="net-wire wire-signal"/>
                        <line x1="190" y1="170" x2="190" y2="185" class="net-wire wire-signal"/>
                        <line x1="190" y1="170" x2="300" y2="170" class="net-wire wire-signal"/>
                        <text x="305" y="175" class="label">ADC Çıkış</text>
                    </g>

                    <!-- Vref bağlantısı -->
                    <g class="net-node" data-net-id="vref" data-component="C6">
                        <line x1="190" y1="235" x2="190" y2="280" class="net-wire wire-vref"/>
                        <line x1="190" y1="280" x2="100" y2="280" class="net-wire wire-vref"/>
                        <text x="95" y="285" class="label" text-anchor="end">Vref</text>
                    </g>
                </svg>
            `
        };

        const details = {
            'vref': {
                'vcc': {
                    name: 'VCC (+9V)',
                    connections: ['<code>+9V</code> Güç Kaynağı', '<code>R1</code> Direnci']
                },
                'gnd': {
                    name: 'GND (Toprak)',
                    connections: ['<code>GND</code> Güç Kaynağı', '<code>R2</code> Direnci']
                },
                'vref': {
                    name: 'Vref (+4.5V)',
                    connections: ['<code>R1</code> ve <code>R2</code> Birleşimi', 'Devrenin Referans Noktası']
                }
            },
            'input_stage': {
                'signal-in': {
                    name: 'Sinyal Girişi',
                    connections: ['<code>Alıcı Bobin</code>', '<code>U1 Pin 3 (IN A+)</code>']
                },
                'buffer-out': {
                    name: 'Buffer Çıkışı / Yükselteç Girişi',
                    connections: ['<code>U1 Pin 1 (OUT A)</code>', '<code>U1 Pin 2 (IN A-)</code>', '<code>U1 Pin 5 (IN B+)</code>']
                },
                'amp-feedback': {
                    name: 'Yükselteç Geri Besleme',
                    connections: ['<code>U1 Pin 6 (IN B-)</code>', '<code>R5 (10k)</code> Direnci', '<code>R6 (220k)</code> Direnci']
                },
                'amp-out': {
                    name: 'Yükseltilmiş Sinyal Çıkışı',
                    connections: ['<code>U1 Pin 7 (OUT B)</code>', '<code>R6 (220k)</code> Direnci', 'Doğrultucu Girişi']
                },
                'vcc': {
                    name: 'VCC (+9V)',
                    connections: ['<code>+9V</code> Güç Kaynağı', '<code>U1 Pin 8</code>']
                },
                'gnd': {
                    name: 'GND (Toprak)',
                    connections: ['<code>GND</code> Güç Kaynağı', '<code>U1 Pin 4</code>']
                }
            },
            'rectifier': {
                'amp-out': {
                    name: 'Doğrultucu Girişi',
                    connections: ['Yükselteç Çıkışı (<code>U1 Pin 7</code>)', '<code>U2 Pin 3 (IN A+)</code>']
                },
                'vref': {
                    name: 'Vref Referansı',
                    connections: ['<code>Vref</code> Hattı', '<code>U2 Pin 2 (IN A-)</code>']
                },
                'rectifier-diode': {
                    name: 'Doğrultucu Ara Çıkış',
                    connections: ['<code>U2 Pin 1 (OUT A)</code>', '<code>D1</code> Diyodu Anodu']
                },
                'vcc': {
                    name: 'VCC (+9V)',
                    connections: ['<code>+9V</code> Güç Kaynağı', '<code>U2 Pin 8</code>']
                },
                'gnd': {
                    name: 'GND (Toprak)',
                    connections: ['<code>GND</code> Güç Kaynağı', '<code>U2 Pin 4</code>']
                },
                'nc': {
                    name: 'Boşta (N.C.)',
                    connections: ['Bu bacaklar (<code>Pin 5, 6, 7</code>) bu devrede kullanılmıyor.']
                }
            },
            'filter':{
                'rectifier-out': {
                    name: 'Filtre Girişi',
                    connections: ['Doğrultucu Çıkışı (<code>D1</code> Katodu)', '<code>R11</code> Direnci']
                },
                'mcu-out': {
                    name: 'ADC Çıkışı',
                    connections: ['<code>R11</code> ve <code>C6</code> Birleşimi', 'Mikroişlemci <code>ADC</code> Pini']
                },
                'vref': {
                    name: 'Vref Referansı',
                    connections: ['<code>Vref</code> Hattı', '<code>C6</code> Kapasitörü']
                }
            }
        };

        return { stages, schematics, details };
    }

    // --- YAZILIM VERİLERİ ---
    function getSoftwareData() {
        const stages = {
            'setup': {
                shortTitleLine1: 'CODECELL',
                shortTitleLine2: 'KURULUM',
                longTitle: 'Codecell Firmware: Kurulum (Setup)'
            },
            'loop': {
                shortTitleLine1: 'CODECELL',
                shortTitleLine2: 'ANA DÖNGÜ',
                longTitle: 'Codecell Firmware: Ana Döngü (Loop)'
            },
            'android_init': {
                shortTitleLine1: 'ANDROID',
                shortTitleLine2: 'BAŞLATMA',
                longTitle: 'Android Uygulaması: Başlatma ve Bağlantı'
            },
            'android_process': {
                shortTitleLine1: 'ANDROID',
                shortTitleLine2: 'KOMUT İŞLEME',
                longTitle: 'Android Uygulaması: Komut İşleme'
            }
        };

        const schematics = {
            'setup': `
                <div class="detail-schematic-svg" style="padding: 2rem; color: var(--slate-300);">
                    <p style="margin-bottom: 1rem;">Codecell'in enerji verildiğinde sadece bir kez çalıştırdığı başlangıç rutinidir.</p>
                    <ul style="list-style-position: inside; cursor: pointer;">
                        <li class="net-node" data-net-id="serial" data-component="Kurulum">Seri Haberleşmeyi Başlat</li>
                        <li class="net-node" data-net-id="imu" data-component="Kurulum">IMU Sensörünü Başlat ve Kalibre Et</li>
                        <li class="net-node" data-net-id="pins" data-component="Kurulum">Parmak Sensör Pinlerini Ayarla</li>
                        <li class="net-node" data-net-id="bt" data-component="Kurulum">Bluetooth'u "EldivenKontrol" adıyla başlat</li>
                    </ul>
                </div>
            `,
            'loop': `
                <svg viewBox="0 0 400 350" class="detail-schematic-svg">
                    <defs>
                        <marker id="arrow-flow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="white"/>
                        </marker>
                    </defs>

                    <!-- 1. Sensörleri Oku -->
                    <g class="net-node" data-net-id="read_sensors" data-component="Ana Döngü">
                        <rect x="100" y="30" width="200" height="50" rx="10" class="flowchart-box"/>
                        <text x="200" y="55" class="flowchart-text">1. Sensörleri Oku</text>
                    </g>
                    <path d="M 200 80 V 110" fill="none" stroke="white" stroke-width="2" marker-end="url(#arrow-flow)"/>

                    <!-- 2. Yönelimi Hesapla -->
                    <g class="net-node" data-net-id="calc_orientation" data-component="Ana Döngü">
                        <rect x="100" y="110" width="200" height="50" rx="10" class="flowchart-box"/>
                        <text x="200" y="135" class="flowchart-text">2. Yönelimi Hesapla</text>
                    </g>
                    <path d="M 200 160 V 190" fill="none" stroke="white" stroke-width="2" marker-end="url(#arrow-flow)"/>

                    <!-- 3. Hareketi Tanı -->
                    <g class="net-node" data-net-id="recog_gesture" data-component="Ana Döngü">
                        <rect x="100" y="190" width="200" height="50" rx="10" class="flowchart-box"/>
                        <text x="200" y="215" class="flowchart-text">3. Hareketi Tanı</text>
                    </g>
                    <path d="M 200 240 V 270" fill="none" stroke="white" stroke-width="2" marker-end="url(#arrow-flow)"/>

                    <!-- 4. Komut Gönder -->
                    <g class="net-node" data-net-id="send_command" data-component="Ana Döngü">
                        <rect x="100" y="270" width="200" height="50" rx="10" class="flowchart-box"/>
                        <text x="200" y="295" class="flowchart-text">4. Komut Gönder</text>
                    </g>
                </svg>
            `,
            'android_init': `
                <div class="detail-schematic-svg" style="padding: 2rem; color: var(--slate-300);">
                    <p style="margin-bottom: 1rem;">Mobil uygulama açıldığında gerçekleşen işlemlerdir.</p>
                    <ul style="list-style-position: inside; cursor: pointer;">
                        <li class="net-node" data-net-id="permissions" data-component="Android Başlatma">Gerekli İzinleri (Bluetooth, Konum) İste</li>
                        <li class="net-node" data-net-id="dji_sdk" data-component="Android Başlatma">DJI SDK'sını Başlat</li>
                        <li class="net-node" data-net-id="ui_elements" data-component="Android Başlatma">Arayüz Elemanlarını (Buton, Log) Oluştur</li>
                        <li class="net-node" data-net-id="bt_scan" data-component="Android Başlatma">"Bağlan" Butonu ile Eldiveni Aramayı Tetikle</li>
                    </ul>
                </div>
            `,
            'android_process': `
                <div class="detail-schematic-svg" style="padding: 1rem;">
                    <pre class="net-node" data-net-id="switch_case" data-component="Komut İşleme" style="cursor: pointer;"><code>// Bluetooth'tan 'gelen_karakter' okundu...

switch (gelen_karakter) {
    case 'T': // Take Off
        DJI_SDK.FlightController.startTakeoff();
        break;

    case 'L': // Land
        DJI_SDK.FlightController.startLanding();
        break;

    case 'S': // Stop / Hover
        DJI_SDK.VirtualStick.setPitch(0);
        DJI_SDK.VirtualStick.setRoll(0);
        break;

    case 'F': // Move Forward
        DJI_SDK.VirtualStick.setPitch(2.0f);
        break;

    // Diğer komutlar...
}
                    </code></pre>
                </div>
            `
        };

        const details = {
            'setup': {
                'serial': {
                    name: 'Seri Haberleşme',
                    connections: ['Hata ayıklama mesajlarını bilgisayara göndermek için kullanılır.']
                },
                'imu': {
                    name: 'IMU Başlatma ve Kalibrasyon',
                    connections: ['Eldivenin yönünü doğru algılamak için jiroskop ve ivmeölçer başlatılır ve başlangıç sapmaları hesaplanır.']
                },
                'pins': {
                    name: 'Pin Modları',
                    connections: ['Parmakların bükülmesini ölçen sensörlerin bağlı olduğu pinler `Giriş (INPUT)` olarak ayarlanır.']
                },
                'bt': {
                    name: 'Bluetooth Başlatma',
                    connections: ['Telefonun eldiveni bulabilmesi için Bluetooth modülü bir isimle (EldivenKontrol) aktif edilir.']
                }
            },
            'loop': {
                'read_sensors': {
                    name: 'Sensörleri Oku',
                    connections: ['Her döngüde IMU ve parmak sensörlerinden anlık ham veriler okunur.']
                },
                'calc_orientation': {
                    name: 'Yönelimi Hesapla',
                    connections: ['Ham IMU verileri, "Tamamlayıcı Filtre" gibi bir algoritma kullanılarak elin eğim (pitch) ve yatış (roll) açılarına dönüştürülür.']
                },
                'recog_gesture': {
                    name: 'Hareketi Tanı',
                    connections: ['Hesaplanan yönelim ve parmak verileri, `if-else` blokları ile karşılaştırılarak "İleri Git", "İniş Yap" gibi komutlara çevrilir.']
                },
                'send_command': {
                    name: 'Komut Gönder',
                    connections: ['Tespit edilen komut, telefona gönderilmek üzere Bluetooth üzerinden yayınlanır. (Örn: \'F\', \'L\')']
                }
            },
            'android_init': {
                'permissions': {
                    name: 'İzinler',
                    connections: ['Android sisteminin Bluetooth ve konum servislerini kullanabilmesi için kullanıcıdan izin istenir.']
                },
                'dji_sdk': {
                    name: 'DJI SDK Başlatma',
                    connections: ['Uygulamanın drone ile haberleşebilmesi için DJI kütüphaneleri başlatılır ve drone bağlantısı beklenir.']
                },
                'ui_elements': {
                    name: 'Arayüz',
                    connections: ['Kullanıcının eldivene bağlanmasını sağlayacak buton ve işlem durumunu gösteren bir metin alanı oluşturulur.']
                },
                'bt_scan': {
                    name: 'Bluetooth Tarama',
                    connections: ['Butona basıldığında, yakındaki Bluetooth cihazları taranır ve ismi "EldivenKontrol" olan cihaz aranır.']
                }
            },
            'android_process': {
                'switch_case': {
                    name: 'Komut İşleme',
                    connections: ['Eldivenden gelen karakter (örn: \'T\'), bir `switch-case` yapısı içinde ilgili DJI SDK fonksiyonunu (örn: `startTakeoff()`) tetikler. Drone\'u hareket ettiren komutlar "Virtual Stick" modunu kullanır.']
                }
            }
        };

        return { stages, schematics, details };
    }

    // --- VERI HAZIRLIĞI ---
    const hardwareData = getHardwareData();
    const softwareData = getSoftwareData();

    // --- OLAY DİNLEYİCİLERİ ---
    // YENİ EKLENECEK BLOK:
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.view) {
            const view = event.state.view;
            const [mainView, subView] = view.split('-');

            if (mainView === 'main') {
                // Ana menüye dönmek için homeBtn'nin orijinal tıklama mantığını kullanıyoruz.
                selectionContainer.style.display = 'flex';
                [hardwareGuideContainer, softwareGuideContainer, reportGuideContainer, detailsGuideContainer].forEach(c => c.style.display = 'none');
                homeBtn.style.display = 'none';
                backBtnHeader.style.display = 'none';
                mainSubtitle.textContent = 'Lütfen bir kılavuz seçin';
                aiModalOverlay.classList.remove('visible');
            } else if (mainView === 'details' && !subView) {
                // Detaylar ana menüsüne dön
                showGuide('details');
                showRoom();
            } else if (mainView === 'details' && subView) {
                // Detaylar alt menüsüne dön
                showGuide('details');
                showRoom(subView);
            } else {
                // Diğer ana kılavuzlara dön
                showGuide(mainView);
            }
        }
    });


    document.getElementById('mobile-menu').addEventListener('click', (e) => {
        const menuItem = e.target.closest('.menu-item');
        if (!menuItem) return;

        const guideType = menuItem.dataset.guide;
        if (guideType) {
            window.history.pushState({view: guideType}, '', `#${guideType}`);
            showGuide(guideType);

            // Menüyü kapat
            document.body.classList.remove('menu-active');
            document.getElementById('menu-btn').setAttribute('aria-expanded', 'false');
        }
    });


    homeBtn.addEventListener('click', () => {
        document.getElementById('technical-guides-wrapper').style.display = 'none';
        document.getElementById('welcome-screen-container').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const headerTitlePre = document.querySelector('.header-title');
    if (headerTitlePre) headerTitlePre.addEventListener('click', (event) => {
        event.preventDefault();

        // Şimdi, homeBtn ile tamamen aynı olan işlemleri kopyalıyoruz.
        document.getElementById('technical-guides-wrapper').style.display = 'none';
        document.getElementById('welcome-screen-container').style.display = 'block';
        mainNavLinks.style.display = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    backBtnHeader.addEventListener('click', () => {
        window.history.back(); // Bu buton artık sadece tarayıcının geri fonksiyonunu tetikleyecek
    });




    // --- DETAY SAYFALARI ---
    // Detay seçim kartları
    document.getElementById('select-project-report').addEventListener('click', () => {
        window.history.pushState({view: 'details-report'}, '', '#details-report');
        showRoom('report');
    });
    document.getElementById('select-personal-info').addEventListener('click', () => {
        window.history.pushState({view: 'details-personal-info'}, '', '#details-personal-info');
        showRoom('personal-info');
    });
    document.getElementById('select-credits').addEventListener('click', () => {
        window.history.pushState({view: 'details-credits'}, '', '#details-credits');
        showRoom('credits');
    });

    function showRoom(roomType) {
        const allRooms = [projectReportContainer, personalInfoContainer, creditsContainer];
        detailsSelectionContainer.style.display = 'none';
        allRooms.forEach(room => room.style.display = 'none');

        if (!roomType) {
            detailsSelectionContainer.style.display = 'flex';
            backBtnHeader.style.display = 'none';
        } else {
            backBtnHeader.style.display = 'block';
            switch(roomType) {
                case 'report':
                    projectReportContainer.style.display = 'block';
                    reportContent.contentEditable = false;
                    reportHistory = [reportContent.innerHTML];
                    undoReportBtn.disabled = true;
                    break;
                case 'personal-info':
                    personalInfoContainer.style.display = 'block';
                    personalInfoContent.contentEditable = false;
                    personalInfoHistory = [personalInfoContent.innerHTML];
                    undoPersonalInfoBtn.disabled = true;
                    break;
                case 'credits':
                    creditsContainer.style.display = 'block';
                    break;
            }
        }
        isErrorState = false;
    }

    // --- İÇERİK DÜZENLEME FONKSİYONLARI ---
    const handleContentInput = (historyArray, contentElement, undoButton) => {
        historyArray.push(contentElement.innerHTML);
        undoButton.disabled = false;
    };

    // Rapor düzenleme
    editReportBtn.addEventListener('click', () => {
        reportContent.contentEditable = true;
        reportContent.focus();
        reportContent.addEventListener('input', () => handleContentInput(reportHistory, reportContent, undoReportBtn));
        showToast('Rapor düzenleme modu aktif.');
    });

    // Kişisel bilgiler düzenleme
    editPersonalInfoBtn.addEventListener('click', () => {
        personalInfoContent.contentEditable = true;
        personalInfoContent.focus();
        personalInfoContent.addEventListener('input', () => handleContentInput(personalInfoHistory, personalInfoContent, undoPersonalInfoBtn));
        showToast('Kişisel bilgiler düzenleme modu aktif.');
    });

    // Kaydetme işlemleri
    saveReportBtn.addEventListener('click', () => {
        if (!isAdmin) return;
        if (isErrorState) {
            showToast("Hata durumu kaydedilemez.");
            return;
        }
        set(ref(database, 'publicContent/projectReport'), reportContent.innerHTML)
            .then(() => {
                reportContent.contentEditable = false;
                reportContent.removeEventListener('input', () => handleContentInput(reportHistory, reportContent, undoReportBtn));
                reportHistory = [];
                undoReportBtn.disabled = true;
                showToast('Rapor Firebase\'e kaydedildi.');
            })
            .catch(error => showToast(`Hata: ${error.message}`));
    });

    savePersonalInfoBtn.addEventListener('click', () => {
        if (!isAdmin) return;
        if (isErrorState) {
            showToast("Hata durumu kaydedilemez.");
            return;
        }
        set(ref(database, 'publicContent/personalInfo'), personalInfoContent.innerHTML)
            .then(() => {
                personalInfoContent.contentEditable = false;
                personalInfoContent.removeEventListener('input', () => handleContentInput(personalInfoHistory, personalInfoContent, undoPersonalInfoBtn));
                personalInfoHistory = [];
                undoPersonalInfoBtn.disabled = true;
                showToast('Kişisel bilgiler Firebase\'e kaydedildi.');
            })
            .catch(error => showToast(`Hata: ${error.message}`));
    });

    // Geri alma işlemleri
    undoReportBtn.addEventListener('click', () => {
        if (reportHistory.length > 1) {
            reportHistory.pop();
            reportContent.innerHTML = reportHistory[reportHistory.length - 1];
        }
        undoReportBtn.disabled = reportHistory.length <= 1;
    });

    undoPersonalInfoBtn.addEventListener('click', () => {
        if (personalInfoHistory.length > 1) {
            personalInfoHistory.pop();
            personalInfoContent.innerHTML = personalInfoHistory[personalInfoHistory.length - 1];
        }
        undoPersonalInfoBtn.disabled = personalInfoHistory.length <= 1;
    });

    // Katkıda bulunan ekleme
    addContributorBtn.addEventListener('click', async () => {
        if (!isAdmin) return;
        if (isButtonOnCooldown('add-contributor-btn')) {
            return;
        }
        setButtonCooldown('add-contributor-btn');

        const input = contributorInput.value.trim();
        if (!input) return;

        const originalBtnText = addContributorBtn.textContent;
        addContributorBtn.textContent = "Ekleniyor...";
        addContributorBtn.disabled = true;

        const systemPrompt = "Sen bir proje için 'Emeği Geçenler' listesi hazırlayan bir asistansın. Sana verilecek olan 'İsim, Rol' formatındaki metni, o kişinin projeye olan katkısını açıklayan resmi ve profesyonel bir cümleye dönüştür. Cevabın SADECE bu cümleyi içeren bir HTML liste elemanı (`<li>...</li>`) olmalı. Başka hiçbir açıklama veya metin ekleme. Örnek: Girdi: 'Ahmet Yılmaz, Kodlama' -> Çıktı: '<li>Ahmet Yılmaz - Projenin yazılım geliştirme ve kodlama süreçlerine katkıda bulunmuştur.</li>'";

        try {
            const result = await addToApiQueue(() => callGemini([{role: 'user', parts: [{text: input}]}], {parts: [{text: systemPrompt}]}, flashApiUrl));
            const updatedCredits = creditsList.innerHTML + result;
            await set(ref(database, 'publicContent/credits'), updatedCredits);
            creditsList.innerHTML = updatedCredits;
            contributorInput.value = '';
        } catch (e) {
            showToast('Katkıda bulunan eklenirken hata oluştu.');
        } finally {
            addContributorBtn.textContent = originalBtnText;
            addContributorBtn.disabled = false;
        }
    });

    // --- KOMPONENT LİSTESİ FONKSİYONLARI ---
    function renderComponentList(list, isGrouped, sortBy) {
        isGrouped = isGrouped || false;
        componentListEl.innerHTML = '';
        let mainColorIndex = 0;
        const mainColors = ['--sky-400', '--amber-400', '--emerald-500', '--red-500'];

        function renderGroup(groupData, level) {
            const subColors = ['--amber-400', '--emerald-500'];
            for (const groupName in groupData) {
                const groupItems = groupData[groupName];
                const isSubCategory = level > 0;

                if (Array.isArray(groupItems)) {
                    const heading = document.createElement(isSubCategory ? 'h4' : 'h3');
                    heading.className = isSubCategory ? 'component-list-subheading' : 'component-list-heading';

                    if(isSubCategory) {
                        heading.style.marginLeft = (level * 20) + 'px';
                        heading.style.color = `var(${subColors[level - 1] || '--slate-300'})`;
                    } else {
                        if (sortBy === 'stage') {
                            heading.style.color = `var(${mainColors[mainColorIndex % mainColors.length]})`;
                            mainColorIndex++;
                        } else {
                            heading.style.color = 'var(--sky-400)';
                        }
                    }

                    heading.textContent = groupName;
                    componentListEl.appendChild(heading);

                    groupItems.forEach(function(componentName){
                        const componentObj = componentList.find(c => c.name === componentName);
                        if(componentObj) {
                            const index = componentList.indexOf(componentObj);
                            componentListEl.appendChild(createListItem(componentName, level + 1, index));
                        }
                    });
                } else if(typeof groupItems === 'object' && groupItems !== null) {
                    const heading = document.createElement('h3');
                    heading.className = 'component-list-heading';

                    if (sortBy === 'stage' && level === 0) {
                        heading.style.color = `var(${mainColors[mainColorIndex % mainColors.length]})`;
                        mainColorIndex++;
                    } else {
                        heading.style.color = 'var(--sky-400)';
                    }

                    heading.textContent = groupName;
                    componentListEl.appendChild(heading);
                    renderGroup(groupItems, level + 1);
                }
            }
        }

        if (isGrouped) {
            renderGroup(list, 0);
        } else {
            list.forEach(function(componentObj, index) {
                componentListEl.appendChild(createListItem(componentObj.name, 0, index));
            });
        }
    }


    function createListItem(componentName, level, index) {
        const li = document.createElement('li');
        const component = componentList.find(c => c.name === componentName);
        if (!component) return document.createDocumentFragment();

        // Önceki adımda eklenen isGuest, helpButtonTitle gibi değişkenleri sildiğinizden emin olun.

        const adminControlsHTML = `
            <select class="status-select" data-index="${index}">
                <option value="Temin Edilecek" ${component.status === 'Temin Edilecek' ? 'selected' : ''}>Temin Edilecek</option>
                <option value="Stokta" ${component.status === 'Stokta' ? 'selected' : ''}>Stokta</option>
                <option value="Monte Edildi" ${component.status === 'Monte Edildi' ? 'selected' : ''}>Monte Edildi</option>
            </select>
            <div class="quantity-controls">
                <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
                <span>${component.quantity} adet</span>
                <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
            </div>
        `;

        const guestViewHTML = `
            <span style="background-color: var(--slate-700); padding: 0.25rem 0.75rem; border-radius: 0.5rem;">${component.quantity} adet</span>
            <span style="background-color: var(--slate-700); padding: 0.25rem 0.75rem; border-radius: 0.5rem;">${component.status}</span>
        `;

        li.dataset.index = index;
        li.innerHTML = `
            <div class="delete-swipe-bar">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </div>
            <div class="component-wrapper">
                <div class="component-row">
                    <div class="component-main">
                        ${/* YENİ KOŞULLU YAPI BURADA */ ''}
                        ${isAdmin ? `
                        <button class="ai-help-btn" data-name="${component.name}" title="Yapay zekaya bu komponent hakkında ipucu ver">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
                            </svg>
                        </button>
                        ` : ''}
                        <span>${component.name}</span>
                    </div>
                    <div class="component-controls">
                        ${isAdmin ? adminControlsHTML : guestViewHTML}
                    </div>
                </div>
                <div class="ai-hint-panel" style="${isAdmin ? '' : 'display:none;'}">
                    <p><strong>"${component.name}"</strong> için ipucu:</p>
                    <div class="ai-hint-input-group">
                        <input type="text" class="ai-hint-input" placeholder="Kullanıldığı aşama (örn: Giriş Katı)" value="${userHints[component.name] || ''}">
                        <button class="ai-hint-submit">Bildir</button>
                    </div>
                </div>
            </div>
        `;
        return li;
    }

    // Komponent ekleme
    function addComponent() {
        if (!isAdmin) return;
        const newComponent = newComponentInput.value.trim();
        if (newComponent && !componentList.find(c => c.name.toLowerCase() === newComponent.toLowerCase())) {
            componentList.push({
                name: newComponent,
                quantity: 1,
                status: 'Temin Edilecek'
            });
            newComponentInput.value = '';
            cachedSorts = { type: null, stage: null };
            deleteHistory = [];
            undoDeleteBtn.style.display = 'none';
            saveComponentDataToFirebase();
            renderComponentList(componentList);
        }
    }

    // Komponent silme
    function deleteComponent(index) {
        if (!isAdmin) return;
        const originalIndex = parseInt(index, 10);
        if (originalIndex >= 0 && originalIndex < componentList.length) {
            const [deletedItem] = componentList.splice(originalIndex, 1);
            deleteHistory.push({
                component: deletedItem,
                index: originalIndex
            });
            cachedSorts = { type: null, stage: null };
            saveComponentDataToFirebase();
            renderComponentList(componentList);
            undoDeleteBtn.style.display = 'inline-block';
        }
    }

    // Gruplandırılmış listeyi düzleştirme
    function flattenGroupedList(groupedList) {
        let flatList = [];
        for (const key in groupedList) {
            if (Array.isArray(groupedList[key])) {
                flatList = flatList.concat(groupedList[key]);
            } else if(typeof groupedList[key] === 'object' && groupedList[key] !== null) {
                flatList = flatList.concat(flattenGroupedList(groupedList[key]));
            }
        }
        return flatList;
    }

    // Komponent sıralama
    async function sortComponents(sortBy) {
        if (isButtonOnCooldown(`sort-${sortBy}`)) {
            return;
        }
        setButtonCooldown(`sort-${sortBy}`);

        document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
        const activeButton = document.querySelector(`.sort-btn[data-sort-by="${sortBy}"]`);
        if(activeButton) activeButton.classList.add('active');

        deleteHistory = [];
        undoDeleteBtn.style.display = 'none';

        if (sortBy === 'name') {
            componentList.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
            saveComponentDataToFirebase();
            renderComponentList(componentList, false, sortBy);
            return;
        }

        if (cachedSorts[sortBy]) {
            renderComponentList(cachedSorts[sortBy], true, sortBy);
            return;
        }

        componentListEl.innerHTML = '<li><div class="loader"></div></li>';

        let prompt;
        const systemInstruction = {parts: [{text: "You are an expert electronics engineer assistant. Your task is to categorize a list of electronic components into a nested structure. You MUST return ONLY a valid JSON object. Top-level keys are the main categories. If a category can be further subdivided, the value for that key should be another JSON object. Otherwise, the value should be an array of component names. Do not add any introductory text, markdown, or explanations."}]};

        const hints = Object.keys(userHints).length > 0 ? ` User-provided hints for context: ${JSON.stringify(userHints)}.` : '';
        const componentNames = componentList.map(c => c.name);

        if (sortBy === 'type') {
            prompt = `Categorize the following electronic components by TYPE into a nested JSON structure. Create subgroups where logical (e.g., 'Resistors' under 'Passive Components'). Use Turkish category names like 'Mikrodenetleyiciler', 'Sensörler', 'Aktif Bileşenler', 'Pasif Bileşenler', and 'Diğer'.${hints} Here is the list: ${JSON.stringify(componentNames)}. Return the result as a single, valid JSON object.`;
        } else if (sortBy === 'stage') {
            prompt = `Analyze the following component list for a 'Smart Glove for Drone Control' project. Categorize each component based on its role in the project's signal and data flow, using Turkish category names. The flow is: 1. **Hareket Algılama** (Sensing movement - for components like MPU-6050, Flex Sensors), 2. **Sinyal İşleme ve Yükseltme** (Processing and amplifying analog signals - for components like Op-Amps), 3. **Veri İşleme ve Kontrol** (Data processing and main control - for the central microcontroller like ESP32), and 4. **Yardımcı Devre Elemanları** (for general passive components like resistors, capacitors that support other stages). Group components strictly according to this functional flow, not their electronic type.${hints} Here is the list: ${JSON.stringify(componentNames)}. Return a single, valid JSON object.`;
        }

        const history = [{ role: 'user', parts: [{ text: prompt }] }];
        const modelUrl = sortBy === 'stage' ? proApiUrl : proApiUrl;

        try {
            const result = await addToApiQueue(() => callGemini(history, systemInstruction, modelUrl));
            const jsonMatch = result.match(/(\{[\s\S]*\})/);

            if (!jsonMatch) {
                throw new Error("API'den geçerli bir JSON nesnesi bulunamadı.");
            }

            const jsonString = jsonMatch[0];
            const groupedList = JSON.parse(jsonString);

            if (typeof groupedList === 'object' && groupedList !== null && !Array.isArray(groupedList)) {
                renderComponentList(groupedList, true, sortBy);
                cachedSorts[sortBy] = groupedList;

                const newOrderedListNames = flattenGroupedList(groupedList);
                const nameSet = new Set(componentList.map(c => c.name));

                if (newOrderedListNames.length === componentList.length && newOrderedListNames.every(name => nameSet.has(name))) {
                    componentList = newOrderedListNames.map(name => componentList.find(c => c.name === name));
                } else {
                    console.warn("AI sorting resulted in a different number of components. List not updated to prevent data loss.");
                }

                saveComponentDataToFirebase();
            } else {
                throw new Error("API geçerli bir grup nesnesi döndürmedi.");
            }
        } catch (e) {
            console.error("Sıralama verisi işlenemedi veya API hatası:", e);
            componentListEl.innerHTML = `<li class="error-message">Sıralama sırasında bir hata oluştu: ${e.message}.</li>`;
            setTimeout(() => renderComponentList(componentList), 3000);
        }
    }

    // --- KOMPONENT LİSTESİ OLAY DİNLEYİCİLERİ ---
    addComponentBtn.addEventListener('click', addComponent);
    newComponentInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addComponent();
    });

    // Komponent liste etkileşimleri
    componentListEl.addEventListener('click', (e) => {
        if (!isAdmin) return;
        const target = e.target;
        const li = target.closest('li');
        if(!li) return;

        const index = li.dataset.index;
        const helpBtn = target.closest('.ai-help-btn');
        const submitBtn = target.closest('.ai-hint-submit');
        const quantityBtn = target.closest('.quantity-btn');
        const statusSelect = target.closest('.status-select');

        if (helpBtn) {
            const wrapper = helpBtn.closest('.component-wrapper');
            const panel = wrapper.querySelector('.ai-hint-panel');
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        } else if (submitBtn) {
            const wrapper = submitBtn.closest('.component-wrapper');
            const componentName = wrapper.querySelector('.ai-help-btn').dataset.name;
            const hintInput = wrapper.querySelector('.ai-hint-input');
            const hint = hintInput.value.trim();

            if (hint) {
                userHints[componentName] = hint;
            } else {
                delete userHints[componentName];
            }

            cachedSorts = { type: null, stage: null };
            saveComponentDataToFirebase();
            hintInput.value = hint;
            wrapper.querySelector('.ai-hint-panel').style.display = 'none';
        } else if (quantityBtn) {
        const action = quantityBtn.dataset.action;
        if (action === 'increase') {
            componentList[index].quantity++;
        } else if (action === 'decrease' && componentList[index].quantity > 1) {
            componentList[index].quantity--;
        }
        saveComponentDataToFirebase();
        renderComponentList(componentList);
    } else if (statusSelect) {
            componentList[index].status = statusSelect.value;
            saveComponentDataToFirebase();
        }
    });

    // --- KAYDIRMA İLE SİLME FONKSİYONLARI ---
    let isSwiping = false, swipeStartX = 0, activeSwipeLi = null;

    const startSwipe = (e) => {
        if (!isAdmin) return;
        activeSwipeLi = e.target.closest('li');
        // Kaydırma işlemi başlamadan önce listenin boş olup olmadığını kontrol et
        if (!activeSwipeLi || !activeSwipeLi.querySelector('.component-wrapper')) {
            activeSwipeLi = null;
            return;
        }
        if (e.target.closest('button, select, input')) return;

        swipeStartX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        isSwiping = true;
        const wrapper = activeSwipeLi.querySelector('.component-wrapper');
        wrapper.classList.add('swiping');

        document.addEventListener('mousemove', swipeMove);
        document.addEventListener('touchmove', swipeMove, { passive: true });
        document.addEventListener('mouseup', endSwipe);
        document.addEventListener('touchend', endSwipe);
    };

    const swipeMove = (e) => {
        if (!isSwiping || !activeSwipeLi) return;

        const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        let deltaX = currentX - swipeStartX;
        deltaX = Math.min(0, deltaX);

        const wrapper = activeSwipeLi.querySelector('.component-wrapper');
        if (wrapper) {
            wrapper.style.transform = `translateX(${deltaX}px)`;
        }
    };

    const endSwipe = (e) => {
        if (!isSwiping || !activeSwipeLi) return;
        isSwiping = false;

        const wrapper = activeSwipeLi.querySelector('.component-wrapper');
        const deleteThreshold = -80;
        const currentTransform = new WebKitCSSMatrix(window.getComputedStyle(wrapper).transform).m41;

        if (currentTransform < deleteThreshold) {
            const index = activeSwipeLi.dataset.index;
            activeSwipeLi.classList.add('deleting');
            setTimeout(() => {
                deleteComponent(index);
            }, 300);
        } else {
            wrapper.style.transition = 'transform 0.3s ease';
            wrapper.style.transform = 'translateX(0px)';
            setTimeout(() => {
                if (wrapper) wrapper.style.transition = '';
            }, 300);
        }

        wrapper.classList.remove('swiping');
        document.removeEventListener('mousemove', swipeMove);
        document.removeEventListener('touchmove', swipeMove);
        document.removeEventListener('mouseup', endSwipe);
        document.removeEventListener('touchend', endSwipe);
        activeSwipeLi = null;
    };

    componentListEl.addEventListener('mousedown', startSwipe);
    componentListEl.addEventListener('touchstart', startSwipe, { passive: true });

    // Sıralama ve dışa aktarma
    sortControls.addEventListener('click', (e) => {
        if(e.target.classList.contains('sort-btn')) {
            sortComponents(e.target.dataset.sortBy);
        }
    });

    exportCsvBtn.addEventListener('click', () => {
        let csvContent = "data:text/csv;charset=utf-8,Komponent Adı,Adet,Durum\n";
        componentList.forEach(c => {
            csvContent += `"${c.name}",${c.quantity},${c.status}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "komponent_raporu.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    undoDeleteBtn.addEventListener('click', () => {
        if (!isAdmin) return;
        if (deleteHistory.length > 0) {
            const lastDeletedItem = deleteHistory.pop();
            componentList.splice(lastDeletedItem.index, 0, lastDeletedItem.component);
            cachedSorts = { type: null, stage: null };
            saveComponentDataToFirebase();
            renderComponentList(componentList);
            if (deleteHistory.length === 0) {
                undoDeleteBtn.style.display = 'none';
            }
        }
    });

    // --- KILAVUZ BAŞLATMA FONKSİYONU ---
    function initializeGuide(type, data) {
        const { stages, schematics, details } = data;
        const guideContainer = document.getElementById(`${type}-guide-container`);
        const mapSvg = guideContainer.querySelector('.interactive-map-svg');
        const schematicContainer = guideContainer.querySelector(`#${type}-schematic-container`);
        const connectionListContainer = guideContainer.querySelector(`#${type}-connection-list-container`);
        const connectionList = connectionListContainer.querySelector('.connection-list');
        const analyzeBtn = connectionListContainer.querySelector('.analyze-connection-btn');

        let currentStageId = Object.keys(stages)[0];
        let currentNodeInfo = {};

        let analysisClickCount = 0; // ✅ YENİ: Basit bir sayaç tanımlıyoruz.

        aiModalOverlay.classList.remove('visible');
        clearChat();
        addMessageToChat("Devre şemasından bir bağlantıya veya akış şemasından bir adıma tıklayarak anlık analiz başlatabilirsiniz.", 'ai');

        function renderMap() {
            const stageKeys = Object.keys(stages);
            const totalWidth = 840;
            const padding = 20;
            const blockWidth = 175;
            const blockHeight = 125;
            const blockY = 0;
            const centerY = blockY + blockHeight / 2;
            const numStages = stageKeys.length;
            const totalBlockWidth = numStages * blockWidth;
            const totalGapWidth = totalWidth - (2 * padding) - totalBlockWidth;
            const gap = numStages > 1 ? totalGapWidth / (numStages - 1) : 0;

            mapSvg.setAttribute('viewBox', `0 0 840 150`);

            let currentX = padding;
            let mapHTML = '';

            stageKeys.forEach(function(key, index) {
                const stage = stages[key];
                const textX = currentX + blockWidth / 2;
                const textY = centerY - 8;
                let tspanContent = `<tspan x="${textX}" dy="1.4em">${stage.shortTitleLine2}</tspan>`;

                mapHTML += `
                    <g class="block" id="block-${type}-${key}" data-stage="${key}">
                        <rect x="${currentX}" y="${blockY}" width="${blockWidth}" height="${blockHeight}" rx="10"/>
                        <text x="${textX}" y="${textY}" text-anchor="middle" fill="white" style="pointer-events:none;">
                            ${stage.shortTitleLine1}${tspanContent}
                        </text>
                    </g>
                `;

                if (index < stageKeys.length - 1) {
                    mapHTML += `
                        <path d="M ${currentX + blockWidth} ${centerY} L ${currentX + blockWidth + gap} ${centerY}"
                              fill="none" stroke="white" stroke-width="2" marker-end="url(#arrow-${type})"/>
                    `;
                }

                currentX += blockWidth + gap;
            });

            mapHTML += `
                <defs>
                    <marker id="arrow-${type}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="white"/>
                    </marker>
                </defs>
            `;

            mapSvg.innerHTML = mapHTML;
        }

        function selectStage(stageId) {
            currentStageId = stageId;

            mapSvg.querySelectorAll('.block').forEach(b => b.classList.remove('highlight'));
            const stageBlock = document.getElementById(`block-${type}-${stageId}`);
            if (stageBlock) stageBlock.classList.add('highlight');

            schematicContainer.innerHTML = schematics[stageId];

            if (connectionListContainer) connectionListContainer.style.display = 'none';

            clearChat(false);
            addMessageToChat("Yeni bir aşama seçildi. Analiz için bir bağlantıya veya adıma tıklayın.", 'ai');

            schematicContainer.querySelectorAll('.net-node').forEach(node => {
                node.addEventListener('click', handleNodeClick);
            });
        }

         function handleNodeClick(event) {
                analysisClickCount = 0; // ✅ YENİ: Yeni bir eleman seçildiğinde sayacı sıfırla.

                const node = event.currentTarget;
                const netId = node.dataset.netId;

                if (!netId || !details[currentStageId] || !details[currentStageId][netId]) return;

                schematicContainer.querySelectorAll('.net-node').forEach(n => n.classList.remove('highlight'));
                schematicContainer.querySelectorAll(`[data-net-id="${netId}"]`).forEach(n => n.classList.add('highlight'));

                const detailInfo = details[currentStageId][netId];
                currentNodeInfo = {
                    type,
                    stage: stages[currentStageId],
                    component: node.dataset.component,
                    pin: node.dataset.pin,
                    net: detailInfo
                };

                if (connectionList) {
                    connectionList.innerHTML = detailInfo.connections.map(conn => `<li>${conn}</li>`).join('');
                }

                if (connectionListContainer) connectionListContainer.style.display = 'block';

                triggerAiInspector(currentNodeInfo);
            }

            mapSvg.addEventListener('click', (e) => {
                const stageId = e.target.closest('.block')?.dataset.stage;
                if (stageId) selectStage(stageId);
            });

            // ✅ "Analiz Et" butonu olay dinleyicisini basitleştiriyoruz
            analyzeBtn.addEventListener('click', () => {
                if (isButtonOnCooldown('analyze-btn')) {
                    return;
                }
                setButtonCooldown('analyze-btn');

                if (currentNodeInfo.net) {
                    analysisClickCount++; // Sayacı bir artır
                    handleAnalyzeConnection(currentNodeInfo, analysisClickCount); // ve fonksiyona gönder

                    const aiInspector = document.getElementById('ai-inspector-wrapper');
                    if (aiInspector) {
                        setTimeout(() => {
                            aiInspector.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                    }
                }
            });

            renderMap();
            selectStage(currentStageId);
        }


    // --- YARDIMCI FONKSİYONLAR ---
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
            background-color: var(--emerald-500); color: white; padding: 1rem 2rem;
            border-radius: 0.5rem; z-index: 2000; opacity: 0;
            transition: opacity 0.3s ease, bottom 0.3s ease;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.bottom = '3rem';
        }, 10);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.bottom = '2rem';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // --- GEMINI API ÇAĞRISI FONKSİYONU ---
    async function callGemini(history, systemInstruction, modelUrl) {
        let lastError = null;

        for (let attempt = 0; attempt < apiKeysEncoded.length; attempt++) {
            try {
                const apiKey = getNextApiKeyAndDecode();
                const payload = {
                    contents: history,
                    systemInstruction
                };
                const finalUrl = `${modelUrl}?key=${apiKey}`;

                const response = await fetch(finalUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorBody = await response.json();
                    const errorMessage = errorBody?.error?.message || 'Bilinmeyen bir API hatası oluştu.';

                    if (errorMessage.includes('quota') || errorMessage.includes('limit') || response.status === 429) {
                        console.log(`API ${attempt + 1} limit aşıldı, diğer API'ye geçiliyor...`);
                        lastError = new Error(`API limit aşıldı: ${errorMessage}`);
                        continue;
                    }
                    throw new Error(`API Hatası: ${errorMessage}`);
                }

                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

                if (text) {
                    return text;
                } else {
                    throw new Error("Yapay zekadan bir yanıt alınamadı.");
                }
            } catch (error) {
                lastError = error;
                if (attempt === apiKeys.length - 1) {
                    break;
                }
            }
        }

        throw lastError || new Error("Tüm API anahtarları kullanılamaz durumda.");
    }

    // --- AI CHAT FONKSİYONLARI ---
    function addMessageToChat(message, type = 'ai') {
        const messageDiv = document.createElement('div');
        const className = type === 'error' ? 'error-message' : `${type}-message`;
        messageDiv.className = `chat-message ${className}`;
        messageDiv.innerHTML = message;
        chatLog.appendChild(messageDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
        return messageDiv;
    }

    async function triggerAiInspector(nodeContext) {
        detailsAiContext = null;
        clearChat(false);

        const loaderMessage = addMessageToChat('<div class="loader"></div>', 'loader');

        try {
            let systemInstruction, prompt;

            if (nodeContext.type === 'hardware') {
                systemInstruction = {parts: [{text: "Sen, bir elektronik mühendisliği asistanısın. Görevin, sana verilen spesifik bağlamı analiz ederek sorulan sorulara doğrudan, teknik ve net cevaplar vermektir. Cevapların KESİNLİKLE Türkçe ve aşırı derecede öz olmalıdır. Sadece 1-2 cümlelik, teknik olarak doğru ve net bir analiz yap. Laf kalabalığı, giriş cümlesi, maddelendirme veya detaylı açıklamalar KULLANMA. Sadece en temel prensibi ve görevi belirt."}]};
                prompt = `Bağlam: "${nodeContext.stage.longTitle}" aşamasındayız. İncelenen Komponent: "${nodeContext.component}", Pin: "${nodeContext.pin}". Bu pin, "${nodeContext.net.name}" adlı bağlantıya aittir ve fiziksel olarak şunları birbirine bağlar: ${nodeContext.net.connections.join(', ')}. Bu bağlantının TEKNİK AMACINI ve GÖREVİNİ, bu spesifik bağlamı dikkate alarak, giriş cümlesi kullanmadan, 1-2 cümle ile açıkla.`;
            } else {
                systemInstruction = {parts: [{text: "Sen, bir gömülü sistemler ve mobil uygulama mimarisi uzmanısın. Görevin, sana verilen yazılım algoritması bağlamını analiz ederek sorulan sorulara doğrudan ve net cevaplar vermektir. Cevapların KESİNLİKLE Türkçe ve aşırı derecede öz olmalıdır. Sadece 1-2 cümlelik, teknik olarak doğru ve net bir analiz yap. Laf kalabalığı veya gereksiz detay KULLANMA. Sadece algoritmanın o adımdaki temel amacını belirt."}]};
                prompt = `Bağlam: "${nodeContext.stage.longTitle}" mimari katmanındayız. İncelenen Algoritma Adımı: "${nodeContext.net.name}". Bu adımın sistemdeki temel GÖREVİ ve AMACI nedir? Giriş cümlesi kullanmadan, 1-2 cümle ile açıkla.`;
            }

            conversationHistory = [{ role: 'user', parts: [{ text: prompt }] }];
            const result = await addToApiQueue(() => callGemini(conversationHistory, systemInstruction, flashApiUrl));

            loaderMessage.remove();
            addMessageToChat(result, 'ai');
            conversationHistory.push({ role: 'model', parts: [{ text: result }] });
        } catch (error) {
            loaderMessage.remove();
            addMessageToChat(`Yapay zeka ile iletişim kurulamadı. Hata: ${error.message}`, 'error');
        }
    }

    async function handleFollowUpQuestion() {
        if (isButtonOnCooldown('follow-up-btn')) {
            return;
        }
        setButtonCooldown('follow-up-btn');

        const question = followUpInput.value.trim();
        if (!question) return;

        addMessageToChat(question, 'user');
        followUpInput.value = '';

        const loaderMessage = addMessageToChat('<div class="loader"></div>', 'loader');

        let systemPrompt, userPrompt, targetElement, historyArray, undoButton;
        let modelUrl;

        if (detailsAiContext === 'edit-report') {
            systemPrompt = "Sen, bir mühendislik öğrencisinin bitirme projesi raporunu düzenleyen bir asistansın. Sana verilen mevcut raporu ve kullanıcının isteğini dikkate alarak raporu geliştir. Cevabın sadece güncellenmiş rapor metni olmalı, giriş veya sonuç cümleleri eklememelisin.";
            const currentContent = reportContent.innerText;
            userPrompt = `Mevcut rapor şu şekilde: "${currentContent}". Lütfen bu raporu kullanıcının şu isteği doğrultusunda geliştir ve yeniden yaz: "${question}"`;
            targetElement = reportContent;
            historyArray = reportHistory;
            undoButton = undoReportBtn;
            modelUrl = proApiUrl;
        } else if (detailsAiContext === 'edit-personal-info') {
            systemPrompt = "Sana verilen mevcut kişisel bilgileri ve kullanıcının isteğini dikkate alarak HTML formatında güncelle. Sadece güncellenmiş HTML kodunu döndür, başka bir metin ekleme.";
            const currentContent = personalInfoContent.innerText;
            userPrompt = `Mevcut bilgiler: "${currentContent}". Bu bilgileri şu isteğe göre güncelle: "${question}"`;
            targetElement = personalInfoContent;
            historyArray = personalInfoHistory;
            undoButton = undoPersonalInfoBtn;
            modelUrl = proApiUrl;
        } else {
            systemPrompt = "Sen, bir önceki cevabına devam eden yardımcı bir asistansın. Teknik, kısa ve net cevaplar ver.";
            conversationHistory.push({ role: 'user', parts: [{text: question}] });

            try {
                const result = await addToApiQueue(() => callGemini(conversationHistory, {parts: [{text: systemPrompt}]}, flashApiUrl));
                addMessageToChat(result, 'ai');
                conversationHistory.push({ role: 'model', parts: [{text: result}] });
            } catch(error) {
                addMessageToChat(`Yanıt alınamadı: ${error.message}`, 'error');
            } finally {
                loaderMessage.remove();
            }
            return;
        }

        try {
            isErrorState = false;
            const result = await addToApiQueue(() => callGemini([{role: 'user', parts: [{text: userPrompt}]}], {parts: [{text: systemPrompt}]}, proApiUrl));

            targetElement.innerHTML = result;
            historyArray.push(result);
            undoButton.disabled = false;
            addMessageToChat('İçerik güncellendi. Pencereyi kapatıp kontrol edebilirsiniz.', 'ai');
        } catch(error) {
            isErrorState = true;
            addMessageToChat(`Güncelleme başarısız oldu: ${error.message}`, 'error');
        } finally {
            loaderMessage.remove();
        }
    }

    async function handleAnalyzeConnection(nodeContext, level) {
        if (!nodeContext || !nodeContext.net) return;

        const userMessage = level === 1 ?
            `Bu ${nodeContext.type === 'hardware' ? 'bağlantıyı' : 'adımı'} analiz et` :
            `Daha detaylı analiz et`;
        addMessageToChat(userMessage, 'user');

        const loaderMessage = addMessageToChat('<div class="loader"></div>', 'loader');

        let systemInstruction;
        let userPrompt;
        const nodeName = `"${nodeContext.net.name}"`;

        // Seviyeye göre daha zengin ve detaylı komutlar
        if (level === 1) { // 1. Tıklama: "Ne?" - Temel Görev
            systemInstruction = { parts: [{ text: "Sen, bir elektronik mühendisliği asistanısın. Görevin, bir devre parçasının temel amacını ve görevini net, teknik ve 2-3 cümleyle açıklamaktır." }] };
            userPrompt = `Analiz Edilecek Bağlantı: ${nodeName}. Bu bağlantının devredeki temel amacı ve birincil görevi nedir? Teknik olarak ne işe yaradığını özetle.`;
        } else if (level === 2) { // 2. Tıklama: "Nasıl ve Neden?" - Detaylı ve Analojili Açıklama
            systemInstruction = { parts: [{ text: "Sen, karmaşık teknik konuları basit analojilerle açıklayan bir mühendislik öğretmenisin. Cevabın en az 4-5 cümle uzunluğunda, açıklayıcı ve başlangıç seviyesindekiler için uygun olmalı." }] };
            userPrompt = `${nodeName} adlı bağlantıyı bir acemiye anlatır gibi detaylandır. İlk olarak, bu bağlantının nasıl çalıştığını gündelik hayattan bir analoji (benzetme) kullanarak anlat. Sonrasında, bu parçanın devrenin genel çalışması için neden kritik olduğunu ve bu parça olmasaydı tam olarak ne gibi sorunlar yaşanacağını teknik ama anlaşılır bir dille izah et.`;
        } else { // 3. ve Sonraki Tıklamalar: "Riskler ve Optimizasyonlar?" - Uzman Analizi
            systemInstruction = { parts: [{ text: "Sen, bir kıdemli donanım mühendisisin. Derinlemesine teknik analizler yapıyorsun. Cevapların detaylı, profesyonel ve ileri seviye bilgiler içermeli. Maddeler halinde veya uzun paragraflarla açıklayabilirsin." }] };
            userPrompt = `${nodeName} adlı bağlantı için ileri seviye bir mühendislik analizi yap. Bu tür bir bağlantı veya devre aşaması tasarlanırken karşılaşılabilecek yaygın zorluklar veya tasarım hataları nelerdir? Gürültü (noise), sinyal bütünlüğü (signal integrity) veya güç verimliliği gibi konularda ne gibi potansiyel sorunlar ortaya çıkabilir? Devrenin performansını iyileştirmek için bu noktada ne gibi optimizasyonlar veya alternatif yaklaşımlar önerirsin?`;
        }

        try {
            const tempHistory = [...conversationHistory];
            if (tempHistory.length > 4) {
                tempHistory.splice(0, tempHistory.length - 4);
            }
            tempHistory.push({ role: 'user', parts: [{ text: userPrompt }] });

            const result = await addToApiQueue(() => callGemini(tempHistory, systemInstruction, flashApiUrl));

            loaderMessage.remove();
            addMessageToChat(result, 'ai');
            conversationHistory.push(
                { role: 'user', parts: [{ text: userPrompt }] },
                { role: 'model', parts: [{ text: result }] }
            );
        } catch(error) {
            loaderMessage.remove();
            addMessageToChat(`Analiz başarısız oldu. Hata: ${error.message}`, 'error');
        }
    }

    function clearChat(resetToDefault) {
        chatLog.innerHTML = '';
        conversationHistory = [];

        if (resetToDefault) {
            inspectorContent.style.display = 'none';
        } else {
            inspectorContent.style.display = 'flex';
        }
    }

    // --- AI ETKİLEŞİM KURULUMU ---
    const setupAiInteraction = (button, context) => {
        button.addEventListener('click', () => {
            const buttonId = button.id;
            if (isButtonOnCooldown(buttonId)) {
                return;
            }
            setButtonCooldown(buttonId);

            aiModalOverlay.appendChild(aiInspectorWrapper);
            aiInspectorWrapper.style.display = 'block';
            aiModalOverlay.classList.add('visible');

            detailsAiContext = context;
            clearChat();

            const promptMessage = context === 'edit-report'
                ? 'Mevcut raporu nasıl geliştirebilirim? (örn: "raporu daha akademik bir dille yaz" veya "sonuç bölümünü ekle").'
                : 'Mevcut kişisel bilgileri nasıl güncelleyebilirim? (örn: "okul adını X olarak değiştir").';

            addMessageToChat(promptMessage, 'ai');

                    setTimeout(() => {
            const chatLog = document.getElementById('chat-log');
            const followUpSection = document.getElementById('follow-up-section');

            if (chatLog) chatLog.style.display = 'flex';
            if (followUpSection) followUpSection.style.display = 'block';

            // Inspector content'i zorla göster
            const inspectorContent = document.getElementById('inspector-content');
            if (inspectorContent) {
                inspectorContent.style.display = 'flex';
                inspectorContent.style.visibility = 'visible';
            }
        }, 100);
        });
    };

    setupAiInteraction(aiReportBtn, 'edit-report');
    setupAiInteraction(aiPersonalInfoBtn, 'edit-personal-info');

    // --- MODAL VE CHAT ETKİLEŞİMLERİ ---
    aiModalOverlay.addEventListener('click', function(e) {
        if (e.target === aiModalOverlay) {
            aiModalOverlay.classList.remove('visible');
        }
    });

    followUpBtn.addEventListener('click', handleFollowUpQuestion);
        followUpInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                followUpBtn.click();
            }

        followUpInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });

    });

    clearChatBtn.addEventListener('click', () => clearChat());

    // AI Inspector'ı body'e yerleştir ve gizle
    document.body.appendChild(aiInspectorWrapper);
    aiInspectorWrapper.style.display = 'none';

    // --- BAŞLANGIÇ VERİ YÜKLEME ---
    loadDataFromFirebase();

    // --- YENİ BÖLÜM: KİMLİK DOĞRULAMA YÖNETİMİ ---

// 1. Admin Giriş Butonu Olay Dinleyicisi
// Admin butonu iki aşamalı: ilk tık aktive eder (opaklaştırır), ikinci tık eylem gerçekleştirir
let adminButtonArmed = false;
let adminButtonTimer = null;
if (adminLoginBtn) adminLoginBtn.addEventListener('click', () => {
    if (!adminButtonArmed) {
        // İlk tık: 3 saniyelik aktif pencere
        adminButtonArmed = true;
        adminLoginBtn.style.opacity = '1';
        clearTimeout(adminButtonTimer);
        adminButtonTimer = setTimeout(() => {
            adminButtonArmed = false;
            adminLoginBtn.style.opacity = '0.1';
        }, 3000);
        return;
    }
    // Silahlanmış durumda: gerçek eylem
    if (isAdmin) {
        signOut(auth).catch(error => console.error("Çıkış hatası:", error));
    } else {
        loginErrorMsg.textContent = '';
        loginModalOverlay.classList.add('visible');
        loginEmailInput.focus();
    }
});

// 2. Modal Kapatma Olay Dinleyicileri
if (loginCloseBtn) loginCloseBtn.addEventListener('click', () => loginModalOverlay && loginModalOverlay.classList.remove('visible'));
if (loginModalOverlay) loginModalOverlay.addEventListener('click', (e) => {
    if (e.target === loginModalOverlay) {
        loginModalOverlay.classList.remove('visible');
    }
});

// 3. Giriş Formu Gönderme Olay Dinleyicisi


if (loginSubmitBtn) loginSubmitBtn.addEventListener('click', () => {
    const userInput = loginEmailInput.value.trim(); // Kullanıcının girdiği metni al ve boşlukları temizle
    const password = loginPasswordInput.value;

    if (!userInput || !password) {
        loginErrorMsg.textContent = "Kullanıcı adı ve şifre alanları zorunludur.";
        return;
    }

    // E-postayı oluşturma mantığı
    let finalEmail;
    if (userInput.includes('@')) {
        // Eğer kullanıcı zaten tam bir e-posta adresi yazdıysa, onu kullan.
        finalEmail = userInput;
    } else {
        // Eğer sadece kullanıcı adı yazdıysa, sonuna "@admin.com" ekle.
        finalEmail = userInput + '@admin.com';
    }

    loginErrorMsg.textContent = ''; // Hata mesajını temizle

    // Firebase'e oluşturulan son e-posta ile giriş yapmayı dene
    signInWithEmailAndPassword(auth, finalEmail, password)
        .then(() => {
            loginModalOverlay.classList.remove('visible');
            loginPasswordInput.value = '';
            showToast("Yönetici girişi başarılı!");
        })
        .catch((error) => {
            console.error("Giriş Hatası:", error.code);
            loginErrorMsg.textContent = "Giriş başarısız. Bilgilerinizi kontrol edin.";
        });
});

// E-posta ve Şifre alanlarında Enter tuşuna basıldığında girişi tetikle
if (loginEmailInput) loginEmailInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Varsayılan Enter davranışını engelle
        loginSubmitBtn.click(); // Giriş yap butonunun click olayını tetikle
    }
});

if (loginPasswordInput) loginPasswordInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Varsayılan Enter davranışını engelle
        loginSubmitBtn.click(); // Giriş yap butonunun click olayını tetikle
    }
});

// 4. Kimlik Durumu Dinleyicisi (Uygulamanın Kalbi)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Bir kullanıcı giriş yapmış (Admin veya Anonim)
        if (user.isAnonymous) {
            console.log('Anonim kullanıcı oturumu aktif.');
            toggleAdminMode(false); // Ziyaretçi moduna geç
        } else if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
            console.log('Yönetici oturumu aktif.');
            toggleAdminMode(true); // Yönetici moduna geç
        } else {
            // Tanımsız bir kullanıcı ise güvenlik gereği anonim moda dön
            console.log('Tanımsız kullanıcı, anonim moda geçiliyor.');
            toggleAdminMode(false);
        }
    } else {
        // HİÇBİR KULLANICI GİRİŞ YAPMAMIŞ (Yönetici çıkış yaptı)
        // Tekrar anonim olarak giriş yaparak okuma moduna dön.
        console.log('Oturum kapatıldı, anonim oturum başlatılıyor.');
        signInAnonymously(auth).catch(error => {
            console.error("Anonim giriş hatası:", error);
        });
    }
});

// --- BAŞLANGIÇ AYARLARI ---
toggleAdminMode(false);
window.history.replaceState({view: 'main'}, '', '#main');


// =================================================================
// ===          NİHAİ NAVİGASYON YÖNETİM MERKEZİ                 ===
// =================================================================

// "AEK Projesi" başlığı (.header-title) için merkezi tıklama yöneticisi.
// Bu kod, ev butonunun tüm davranışlarını birebir taklit eder.
const headerTitle = document.querySelector('.header-title');
if (headerTitle) headerTitle.addEventListener('click', (e) => {
    // 1. Bağlantının varsayılan davranışını (URL'yi değiştirme) her zaman engelle.
    e.preventDefault();

    // 2. İlgili ana ekran konteynerlerini bul.
    const welcomeContainer = document.getElementById('welcome-screen-container');
    const techGuidesContainer = document.getElementById('technical-guides-wrapper');

    // 3. Her zaman teknik kılavuzlar ekranını gizle.
    if (techGuidesContainer) {
        techGuidesContainer.style.display = 'none';
    }

    // 4. Her zaman ana panel (dashboard) ekranını göster.
    if (welcomeContainer) {
        welcomeContainer.style.display = 'block';
    }

    // 5. Her zaman sayfanın en üstüne, akıcı bir şekilde kaydır.
    window.scrollTo({ top: 0, behavior: 'smooth' });
});