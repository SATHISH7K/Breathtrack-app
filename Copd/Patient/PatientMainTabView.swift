import SwiftUI

struct PatientMainTabView: View {
    @EnvironmentObject var session: PatientSession

    var body: some View {
        TabView(selection: $session.selectedTab) {

            // ── Home ─────────────────────────────────────────────
            NavigationStack {
                PatientDashboardView()
            }
            .tabItem {
                Label("Home", systemImage: session.selectedTab == 0 ? "house.fill" : "house")
            }
            .tag(0)

            // ── Appointments ─────────────────────────────────────
            NavigationStack {
                Appointments(isPresented: .constant(true))
            }
            .tabItem {
                Label("Appointments", systemImage: session.selectedTab == 1 ? "calendar.badge.clock" : "calendar")
            }
            .tag(1)

            // ── Reminders ────────────────────────────────────────
            NavigationStack {
                RemindersView()
            }
            .tabItem {
                Label("Reminders", systemImage: session.selectedTab == 2 ? "bell.fill" : "bell")
            }
            .tag(2)

            // ── Profile ──────────────────────────────────────────
            NavigationStack {
                PatientProfileView()
            }
            .tabItem {
                Label("Profile", systemImage: session.selectedTab == 3 ? "person.fill" : "person")
            }
            .tag(3)
        }
        .tint(Color.btPrimary)
        // Custom tab bar background
        .onAppear {
            let appearance = UITabBarAppearance()
            appearance.configureWithOpaqueBackground()
            appearance.backgroundColor = UIColor(Color.btSurface)

            // Active item
            appearance.stackedLayoutAppearance.selected.iconColor   = UIColor(Color.btPrimary)
            appearance.stackedLayoutAppearance.selected.titleTextAttributes = [
                .foregroundColor: UIColor(Color.btPrimary),
                .font: UIFont.systemFont(ofSize: 10, weight: .semibold)
            ]

            // Inactive item
            appearance.stackedLayoutAppearance.normal.iconColor   = UIColor(Color.btTextTertiary)
            appearance.stackedLayoutAppearance.normal.titleTextAttributes = [
                .foregroundColor: UIColor(Color.btTextTertiary),
                .font: UIFont.systemFont(ofSize: 10, weight: .medium)
            ]

            // Top border separator
            appearance.shadowImage = UIImage()
            appearance.shadowColor = UIColor(Color.btBorder)

            UITabBar.appearance().standardAppearance   = appearance
            UITabBar.appearance().scrollEdgeAppearance = appearance
        }
    }
}

#Preview {
    PatientMainTabView()
        .environmentObject(PatientSession(current: PatientProfile(
            patient_id: "P001", name: "Arjun", age: 52, gender: "Male", occupation: "Engineer"
        )))
}
