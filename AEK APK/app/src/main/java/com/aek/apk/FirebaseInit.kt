package com.aek.apk

import android.app.Application
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions

class AEKApp : Application() {
    override fun onCreate() {
        super.onCreate()
        if (FirebaseApp.getApps(this).isEmpty()) {
            val options = FirebaseOptions.Builder()
                .setApiKey("AIzaSyBRcjPzkljNjXVRM1jn_KGCheXhQY54fcs")
                .setApplicationId("1:887514657698:web:fef8471170e3c2bf2db8fb")
                .setDatabaseUrl("https://akillieldiven-default-rtdb.firebaseio.com")
                .setProjectId("akillieldiven")
                .setStorageBucket("akillieldiven.appspot.com")
                .build()
            FirebaseApp.initializeApp(this, options)
        }
        enableOffline()
    }
}
