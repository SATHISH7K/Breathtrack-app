import SwiftUI

struct UploadVideos: View {
    @Environment(\.dismiss) private var dismiss
    @State private var navigateToVideosUploading = false
    @State private var appeared = false
    
    var body: some View {
        ZStack {
            Color.btBackground.ignoresSafeArea()
            
            VStack(spacing: 0) {
                // MARK: - Top Bar
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
                    
                    Text("Manage Videos")
                        .font(.btHeadline)
                        .foregroundColor(.btTextPrimary)
                    
                    Spacer()
                    
                    Color.clear.frame(width: 44, height: 44)
                }
                .padding(.horizontal, Spacing.lg)
                .padding(.top, Spacing.md)
                .padding(.bottom, Spacing.sm)
                .background(Color.btBackground)
                
                Spacer()
                
                // MARK: - Image Illustration
                ZStack {
                    Circle()
                        .fill(Color.btDoctorPrimary.opacity(0.08))
                        .frame(width: 280, height: 280)
                        .scaleEffect(appeared ? 1 : 0.8)
                    
                    Image("uploadvideo") // existing image asset
                        .resizable()
                        .scaledToFit()
                        .frame(height: 220)
                        .scaleEffect(appeared ? 1.0 : 0.9)
                        .opacity(appeared ? 1 : 0)
                }
                
                Spacer()
                
                VStack(spacing: Spacing.sm) {
                    Text("Enrich Patient Education")
                        .font(.btTitle2)
                        .foregroundColor(.btTextPrimary)
                    
                    Text("Upload targeted rehabilitation material\nand respiratory videos directly.")
                        .font(.btBody)
                        .foregroundColor(.btTextSecond)
                        .multilineTextAlignment(.center)
                        .lineSpacing(4)
                }
                .opacity(appeared ? 1 : 0)
                .offset(y: appeared ? 0 : 20)
                
                Spacer()
                
                // MARK: - Upload Button
                Button(action: {
                    navigateToVideosUploading = true
                }) {
                    HStack(spacing: Spacing.sm) {
                        Image(systemName: "plus.circle.fill")
                            .font(.system(size: 20, weight: .semibold))
                        Text("Upload New Video")
                            .font(.btLabel)
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 56)
                    .background(LinearGradient.btDoctorGradient)
                    .clipShape(RoundedRectangle(cornerRadius: 18))
                    .btDeepShadow(color: Color.btDoctorPrimary)
                }
                .buttonStyle(.plain)
                .padding(.horizontal, Spacing.xl)
                .padding(.bottom, 50)
                .opacity(appeared ? 1 : 0)
                .offset(y: appeared ? 0 : 20)
            }
        }
        .navigationBarHidden(true)
        .fullScreenCover(isPresented: $navigateToVideosUploading) {
            VideosUploading()
        }
        .onAppear {
            withAnimation(.spring(response: 0.7, dampingFraction: 0.8)) {
                appeared = true
            }
        }
    }
}

#Preview {
    UploadVideos()
}
