package com.aek.dashboard;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        
        // WebView ayarları - JavaScript ve modern web özelliklerini etkinleştir
        WebSettings webSettings = webView.getSettings();
        
        // ✅ JavaScript'i etkinleştir (ZORUNLU - Chart.js, Firebase için)
        webSettings.setJavaScriptEnabled(true);
        
        // ✅ DOM Storage'ı etkinleştir (Firebase için)
        webSettings.setDomStorageEnabled(true);
        
        // ✅ Database'i etkinleştir
        webSettings.setDatabaseEnabled(true);
        
        // ✅ Modern web özellikleri
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);
        
        // ✅ Cache ayarları
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        webSettings.setAppCacheEnabled(true);
        
        // ✅ Zoom ve görünüm ayarları
        webSettings.setBuiltInZoomControls(false);
        webSettings.setDisplayZoomControls(false);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        
        // ✅ Mixed content'e izin ver (HTTPS içinde HTTP için)
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        
        // WebViewClient - Linkler WebView içinde açılsın
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });
        
        // 🎯 HTML dosyasını yükle
        webView.loadUrl("file:///android_asset/site.html");
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
