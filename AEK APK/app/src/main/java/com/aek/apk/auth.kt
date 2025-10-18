package com.aek.apk

import androidx.lifecycle.ViewModel
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

class AuthViewModel : ViewModel() {
    private val _user = MutableStateFlow<FirebaseUser?>(Firebase.auth.currentUser)
    val user: StateFlow<FirebaseUser?> = _user

    init {
        if (Firebase.auth.currentUser == null) {
            Firebase.auth.signInAnonymously().addOnCompleteListener {
                _user.value = Firebase.auth.currentUser
            }
        }
        Firebase.auth.addAuthStateListener { _user.value = it.currentUser }
    }

    fun signIn(email: String, password: String, onError: (String) -> Unit) {
        Firebase.auth.signInWithEmailAndPassword(email, password).addOnFailureListener {
            onError(it.message ?: "Giriş başarısız")
        }
    }

    fun signOut() { Firebase.auth.signOut() }
}
