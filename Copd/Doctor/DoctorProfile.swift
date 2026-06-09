import SwiftUI

struct DoctorProfile: View {
    @Environment(\.dismiss) private var dismiss
    @State private var goToLogin = false
    @State private var contentVisible = false
    
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
                        
                        // ── Doctor Information ──────────────────────────────
                        VStack(spacing: Spacing.md) {
                            DoctorProfileDetailRow(icon: "person.text.rectangle", title: "Name", value: "Dr. Madhu", delay: 0.1)
                            DoctorProfileDetailRow(icon: "calendar", title: "Age", value: "34", delay: 0.15)
                            DoctorProfileDetailRow(icon: "envelope.fill", title: "Email", value: "m@gmail.com", delay: 0.2)
                            DoctorProfileDetailRow(icon: "phone.fill", title: "Phone", value: "+91 9885426287", delay: 0.25)
                            DoctorProfileDetailRow(icon: "cross.case.fill", title: "Specialization", value: "Pulmonologist", delay: 0.3)
                        }
                        .padding(.horizontal, Spacing.lg)
                        
                        // ── Actions ─────────────────────────────────────────
                        // (Sign Out removed per request)
                    }
                    .opacity(contentVisible ? 1 : 0)
                    .offset(y: contentVisible ? 0 : 20)
                }
            }
        }
        .navigationBarHidden(true)
        .navigationDestination(isPresented: $goToLogin) {
            AboutScreen2().navigationBarBackButtonHidden(true)
        }
        .onAppear {
            withAnimation(.spring(response: 0.7, dampingFraction: 0.8)) {
                contentVisible = true
            }
        }
    }
}

private struct DoctorProfileDetailRow: View {
    let icon: String
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
                Text(value)
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
    DoctorProfile()
}
