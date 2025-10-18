package com.aek.apk

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

@Composable
fun AEKNavHost() {
    val nav: NavHostController = rememberNavController()
    NavHost(navController = nav, startDestination = Routes.Dashboard) {
        composable(Routes.Dashboard) { DashboardScreen(nav) }
        composable(Routes.Overview) { OverviewScreen(nav) }
        composable(Routes.Architecture) { ArchitectureScreen(nav) }
        composable(Routes.Data) { DataScreen(nav) }
        composable(Routes.Roadmap) { RoadmapScreen(nav) }
        composable(Routes.Report) { ReportScreen(nav) }
        composable(Routes.PersonalInfo) { PersonalInfoScreen(nav) }
        composable(Routes.Credits) { CreditsScreen(nav) }
        composable(Routes.Login) { LoginScreen(nav) }
    }
}

object Routes {
    const val Dashboard = "dashboard"
    const val Overview = "overview"
    const val Architecture = "architecture"
    const val Data = "data"
    const val Roadmap = "roadmap"
    const val Report = "report"
    const val PersonalInfo = "personal_info"
    const val Credits = "credits"
    const val Login = "login"
}
