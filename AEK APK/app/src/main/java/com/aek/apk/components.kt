package com.aek.apk

import androidx.lifecycle.ViewModel
import com.google.firebase.database.ktx.database
import com.google.firebase.ktx.Firebase
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

// Web'deki component listesi ile hizalı sade model

data class ComponentItem(
    val name: String,
    val quantity: Int = 1,
    val status: String = "pending"
)

class ComponentsViewModel : ViewModel() {
    private val _components = MutableStateFlow<List<ComponentItem>>(emptyList())
    val components: StateFlow<List<ComponentItem>> = _components

    init {
        Firebase.database.reference.child("publicContent").child("components").child("list")
            .get().addOnSuccessListener { snap ->
                val list = mutableListOf<ComponentItem>()
                snap.children.forEach { c ->
                    val name = c.child("name").getValue(String::class.java) ?: return@forEach
                    val qty = c.child("quantity").getValue(Int::class.java) ?: 1
                    val st = c.child("status").getValue(String::class.java) ?: "pending"
                    list.add(ComponentItem(name, qty, st))
                }
                if (list.isNotEmpty()) _components.value = list
            }
    }
}
