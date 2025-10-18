plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.example.eldiven"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.example.eldiven"
        minSdk = 33
        targetSdk = 36
        versionCode = 1
        versionName = "18.06.41"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {}
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.constraintlayout)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
}

// === NİHAİ VE %100 ÇALIŞAN KOD BLOĞU ===
androidComponents.onVariants { variant ->
    // 'all' yerine 'forEach' kullanarak "Return type mismatch" hatasını gideriyoruz.
    variant.outputs.forEach { output ->
        // Bu kod, Android'in dahili API'sini kullanarak dosya adını doğrudan "AEK.apk" olarak ayarlar.
        (output as com.android.build.api.variant.impl.VariantOutputImpl).outputFileName.set("AEK.apk")
    }
}

