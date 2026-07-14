import SwiftUI

struct DoctorProfile: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var session: PatientSession

    @State private var name        = ""
    @State private var age         = ""
    @State private var email       = ""
    @State private var phone       = ""
    @State private var contentVisible = false
    @State private var isFetching  = true

    var body: some View {
        ZStack {
            Color.btBackground.ignoresSafeArea()

            VStack(spacing: 0) {
                // ── Header ──────────────────────────────────────────────
                HStack {
                    Button(action: { dismiss() }) {
                        Image(systemName: "chevron.left")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.btTextPrimary)
                            .frame(width: 44, height: 44)
                            .background(Color.btSurface)
                            .clipShape(Circle())
                            .btCardShadow()
                    }
                    Spacer()
                    Text("My Profile")
                        .font(.btHeadline)
                        .foregroundColor(.btTextPrimary)
                    Spacer()
                    Color.clear.frame(width: 44, height: 44)
                }
                .padding(.horizontal, Spacing.lg)
                .padding(.vertical, Spacing.md)
                .background(Color.btBackground)

                if isFetching {
                    Spacer()
                    ProgressView().scaleEffect(1.4).tint(.btDoctorPrimary)
                    Spacer()
                } else {
                    ScrollView(showsIndicators: false) {
                        VStack(spacing: Spacing.lg) {

                            // ── Doctor Avatar ──────────────────────────────────
                            VStack(spacing: Spacing.sm) {
                                ZStack {
                                    Circle()
                                        .fill(Color.btDoctorPrimary.opacity(0.1))
                                        .frame(width: 90, height: 90)
                                    Image(systemName: "person.crop.circle.fill")
                                        .resizable()
                                        .frame(width: 80, height: 80)
                                        .foregroundColor(.btDoctorPrimary)
                                }
                                Text("Primary Consultant")
                                    .font(.btLabel)
                                    .foregroundColor(.btTextSecond)
                            }
                            .padding(.top, Spacing.md)

                            // ── Info Rows ──────────────────────────────────────
                            VStack(spacing: Spacing.md) {
                                DoctorProfileDetailRow(icon: "person.text.rectangle", title: "Name",   value: name,  delay: 0.10)
                                DoctorProfileDetailRow(icon: "calendar",              title: "Age",    value: age,   delay: 0.15)
                                DoctorProfileDetailRow(icon: "envelope.fill",         title: "Email",  value: email, delay: 0.20)
                                DoctorProfileDetailRow(icon: "phone.fill",            title: "Phone",  value: phone, delay: 0.25)
                                DoctorProfileDetailRow(icon: "cross.case.fill",       title: "Specialization", value: "Pulmonologist", delay: 0.30)
                            }
                            .padding(.horizontal, Spacing.lg)
                        }
                        .opacity(contentVisible ? 1 : 0)
                        .offset(y: contentVisible ? 0 : 20)
                    }
                }
            }
        }
        .navigationBarHidden(true)
        .onAppear {
            loadProfile()
            withAnimation(.spring(response: 0.7, dampingFraction: 0.8)) {
                contentVisible = true
            }
        }
    }

    // MARK: - Fetch doctor details from backend
    private func loadProfile() {
        isFetching = true
        let storedId = UserDefaults.standard.string(forKey: "loggedInDoctorId") ?? ""
        guard !storedId.isEmpty,
              let url = APIConfig.getURL(for: "get_doctor_profile.php") else {
            isFetching = false
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONSerialization.data(withJSONObject: ["doctor_id": storedId])

        URLSession.shared.dataTask(with: request) { data, _, _ in
            DispatchQueue.main.async {
                isFetching = false
                guard let data = data,
                      let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                      let doc  = json["data"] as? [String: Any] else { return }

                name  = doc["name"]  as? String ?? ""
                email = doc["email"] as? String ?? ""
                phone = doc["phone"] as? String ?? ""
                age   = doc["age"] != nil ? "\(doc["age"]!)" : ""
            }
        }.resume()
    }
}

// MARK: - Read-only row
private struct DoctorProfileDetailRow: View {
    let icon:  String
    let title: String
    let value: String
    let delay: Double

    @State private var appeared = false

    var body: some View {
        HStack(spacing: Spacing.md) {
            ZStack {
                Circle()
                    .fill(Color.btDoctorPrimary.opacity(0.12))
                    .frame(width: 44, height: 44)
                Image(systemName: icon)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.btDoctorPrimary)
            }
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.btCaption2)
                    .foregroundColor(.btTextSecond)
                Text(value.isEmpty ? "—" : value)
                    .font(.btHeadline)
                    .foregroundColor(.btTextPrimary)
            }
            Spacer()
        }
        .padding(Spacing.md)
        .background(Color.btSurface)
        .clipShape(RoundedRectangle(cornerRadius: 18))
        .btCardShadow()
        .opacity(appeared ? 1 : 0)
        .offset(x: appeared ? 0 : -20)
        .onAppear {
            withAnimation(.spring(response: 0.6, dampingFraction: 0.8).delay(delay)) {
                appeared = true
            }
        }
    }
}

#Preview {
    NavigationStack {
        DoctorProfile().environmentObject(PatientSession())
    }
}
