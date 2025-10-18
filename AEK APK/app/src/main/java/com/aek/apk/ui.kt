package com.aek.apk

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController

@Composable
fun TopBar(nav: NavController) {
    SmallTopAppBar(title = { Text("AEK Projesi") })
}

@Composable
fun DashboardScreen(nav: NavController) {
    Scaffold(topBar = { TopBar(nav) }) { padding ->
        Column(Modifier.padding(padding).padding(16.dp).fillMaxSize(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Text("Proje Gösterge Paneli", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Card(modifier = Modifier.weight(1f)) {
                    Column(Modifier.padding(16.dp)) {
                        Text("Mimari Analizi", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                        Spacer(Modifier.height(8.dp))
                        Text("Sinyal bütünlüğünü artıran Dijital Sinyal Yolu mimarisi.")
                        Spacer(Modifier.height(8.dp))
                        Button(onClick = { nav.navigate(Routes.Architecture) }) { Text("Mimarileri Karşılaştır") }
                    }
                }
                Card(modifier = Modifier.weight(1f)) {
                    Column(Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Donanım Analizi", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                        Spacer(Modifier.height(8.dp))
                        Text("RF kanalları maliyetin çoğunu oluşturur.")
                        Spacer(Modifier.height(8.dp))
                        DonutChart(values = listOf(2f, 1f, 8f, 1f), colors = listOf(Color(0xFF0EA5E9), Color(0xFF10B981), Color(0xFFF59E0B), Color(0xFFEF4444)))
                    }
                }
            }
            Button(onClick = { nav.navigate(Routes.Roadmap) }) { Text("Yol Haritası") }
        }
    }
}

@Composable
fun DonutChart(values: List<Float>, colors: List<Color>) {
    val total = values.sum().coerceAtLeast(1f)
    val proportions = values.map { it / total * 360f }
    Canvas(modifier = Modifier.size(160.dp)) {
        var start = -90f
        proportions.zip(colors).forEach { (angle, color) ->
            drawArc(color = color, startAngle = start, sweepAngle = angle, useCenter = false, style = Stroke(width = 24f))
            start += angle
        }
    }
}

@Composable fun OverviewScreen(nav: NavController) { SimplePlaceholder("Genel Bakış") }
@Composable fun ArchitectureScreen(nav: NavController) { SimplePlaceholder("Sistem Mimarisi") }
@Composable fun DataScreen(nav: NavController) { SimplePlaceholder("Kritik Teknik Veriler") }

@Composable
fun RoadmapScreen(nav: NavController) {
    val viewModel = remember { PhaseViewModel() }
    val phases by viewModel.phaseState.collectAsState()
    Scaffold(topBar = { TopBar(nav) }) { padding ->
        LazyColumn(contentPadding = padding, modifier = Modifier.fillMaxSize()) {
            items(phases) { phase ->
                Card(Modifier.padding(16.dp)) {
                    Column(Modifier.padding(16.dp)) {
                        Text(phase.title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                        Text(phase.status)
                        Spacer(Modifier.height(8.dp))
                        Text("Görevler:")
                        phase.details.wbs.forEach { Text("• $it") }
                    }
                }
            }
        }
    }
}

@Composable fun ReportScreen(nav: NavController) { SimplePlaceholder("Proje Raporu") }
@Composable fun PersonalInfoScreen(nav: NavController) { SimplePlaceholder("Kişisel Bilgiler") }
@Composable fun CreditsScreen(nav: NavController) { SimplePlaceholder("Emeği Geçenler") }
@Composable fun LoginScreen(nav: NavController) { SimplePlaceholder("Yönetici Girişi") }

@Composable
fun SimplePlaceholder(title: String) {
    Scaffold(topBar = { SmallTopAppBar(title = { Text(title) }) }) { padding ->
        Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
            Text("Yakında")
        }
    }
}
