package com.aek.apk

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.ktx.auth
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.ktx.database
import com.google.firebase.ktx.Firebase
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

// Web'deki RTDB yollarını birebir koruyoruz: publicContent/*

data class PhaseDetails(
    val wbs: List<String> = emptyList(),
    val resources: Map<String, String> = emptyMap(),
    val deliverables: String = "",
    val risks: List<Map<String, String>> = emptyList(),
    val timeline: String = ""
)

data class Phase(
    val title: String = "",
    val status: String = "planned",
    val details: PhaseDetails = PhaseDetails()
)

class PhaseViewModel : ViewModel() {
    private val _phaseState = MutableStateFlow<List<Phase>>(emptyList())
    val phaseState: StateFlow<List<Phase>> = _phaseState

    private val db: DatabaseReference = Firebase.database.reference

    init {
        // Anonim giriş (web ile uyumlu akış)
        FirebaseApp.getApps(null)
        Firebase.auth.signInAnonymously()
        observePhases()
    }

    private fun observePhases() {
        db.child("publicContent").child("roadmapPhases").get().addOnSuccessListener { snap ->
            val result = mutableListOf<Phase>()
            snap.children.forEach { child ->
                val title = child.child("title").getValue(String::class.java) ?: ""
                val status = child.child("status").getValue(String::class.java) ?: "planned"
                val detailsNode = child.child("details")
                val wbs = detailsNode.child("wbs").children.mapNotNull { it.getValue(String::class.java) }
                val resources = detailsNode.child("resources").children.associate { it.key!! to (it.getValue(String::class.java) ?: "") }
                val deliverables = detailsNode.child("deliverables").getValue(String::class.java) ?: ""
                val risks = detailsNode.child("risks").children.map { riskChild ->
                    riskChild.children.associate { it.key!! to (it.getValue(String::class.java) ?: "") }
                }
                val timeline = detailsNode.child("timeline").getValue(String::class.java) ?: ""
                result.add(Phase(title, status, PhaseDetails(wbs, resources, deliverables, risks, timeline)))
            }
            if (result.isNotEmpty()) _phaseState.value = result
        }
    }

    fun updatePhases(phases: List<Phase>) {
        viewModelScope.launch {
            val payload = phases.map { phase ->
                mapOf(
                    "title" to phase.title,
                    "status" to phase.status,
                    "details" to mapOf(
                        "wbs" to phase.details.wbs,
                        "resources" to phase.details.resources,
                        "deliverables" to phase.details.deliverables,
                        "risks" to phase.details.risks,
                        "timeline" to phase.details.timeline
                    )
                )
            }
            db.child("publicContent").child("roadmapPhases").setValue(payload)
        }
    }
}
