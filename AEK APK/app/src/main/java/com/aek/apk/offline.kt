package com.aek.apk

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalContext
import com.google.firebase.database.ktx.database
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase

fun enableOffline() {
    // Firestore offline (etkin)
    Firebase.firestore // Firestore KTX yüklendiğinde offline varsayılan açık
    // RTDB offline persistence
    Firebase.database.setPersistenceEnabled(true)
}

fun isOnline(context: Context): Boolean {
    val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    val network = cm.activeNetwork ?: return false
    val caps = cm.getNetworkCapabilities(network) ?: return false
    return caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
}

@Composable
fun OfflineBanner() {
    val context = LocalContext.current
    val snackbarHostState = remember { SnackbarHostState() }
    LaunchedEffect(Unit) {
        if (!isOnline(context)) snackbarHostState.showSnackbar("Çevrimdışı modda çalışıyorsunuz")
    }
    SnackbarHost(hostState = snackbarHostState) { data -> Text(data.visuals.message) }
}
