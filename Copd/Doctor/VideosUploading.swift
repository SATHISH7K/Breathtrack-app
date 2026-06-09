import SwiftUI
import PhotosUI

struct VideosUploading: View {
    @Environment(\.dismiss) private var dismiss
    
    @State private var youtubeURL: String = ""
    @State private var selectedVideo: PhotosPickerItem?
    @State private var isUploading = false
    @State private var showAlert = false
    @State private var alertMessage = ""
    @State private var appeared = false
    
    var body: some View {
        ZStack {
            Color.btBackground.ignoresSafeArea()
            
            VStack(spacing: 0) {
                // MARK: - Header
                HStack {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.btTextPrimary)
                            .frame(width: 44, height: 44)
                            .background(Color.btSurface)
                            .clipShape(Circle())
                            .btCardShadow()
                    }
                    Spacer()
                    Text("Upload Video")
                        .font(.btHeadline)
                        .foregroundColor(.btTextPrimary)
                    Spacer()
                    Color.clear.frame(width: 44, height: 44)
                }
                .padding(.horizontal, Spacing.lg)
                .padding(.top, Spacing.md)
                .padding(.bottom, Spacing.md)
                .background(Color.btBackground)
                
                ScrollView(showsIndicators: false) {
                    VStack(spacing: Spacing.xl) {
                        
                        // MARK: - Illustration
                        Image("uploadvideo")
                            .resizable()
                            .scaledToFit()
                            .frame(height: 180)
                            .padding(.top, Spacing.md)
                            .opacity(appeared ? 1 : 0)
                            .offset(y: appeared ? 0 : -20)
                        
                        // MARK: - YouTube Upload Card
                        VStack(alignment: .leading, spacing: Spacing.sm) {
                            HStack(spacing: Spacing.sm) {
                                ZStack {
                                    Circle().fill(Color.red.opacity(0.1)).frame(width: 32, height: 32)
                                    Image(systemName: "play.rectangle.fill")
                                        .foregroundColor(.red)
                                }
                                Text("Link via YouTube")
                                    .font(.btHeadline)
                                    .foregroundColor(.btTextPrimary)
                            }
                            
                            HStack {
                                Image(systemName: "link")
                                    .foregroundColor(.btTextTertiary)
                                TextField("https://youtube.com/watch?v=...", text: $youtubeURL)
                                    .font(.btBodyMedium)
                                    .foregroundColor(.btTextPrimary)
                                    .autocapitalization(.none)
                                    .disableAutocorrection(true)
                            }
                            .padding(.horizontal, Spacing.md)
                            .frame(height: 52)
                            .background(Color.btBackground)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                            .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.btBorder, lineWidth: 1))
                            
                            if !youtubeURL.isEmpty {
                                Button(action: uploadYoutubeURL) {
                                    HStack {
                                        Text("Add Link")
                                            .font(.btLabel)
                                        Image(systemName: "arrow.up.circle.fill")
                                    }
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .frame(height: 50)
                                    .background(Color.red)
                                    .clipShape(RoundedRectangle(cornerRadius: 14))
                                    .padding(.top, Spacing.sm)
                                }
                            }
                        }
                        .padding(Spacing.md)
                        .background(Color.btSurface)
                        .clipShape(RoundedRectangle(cornerRadius: 20))
                        .btCardShadow()
                        .padding(.horizontal, Spacing.lg)
                        .opacity(appeared ? 1 : 0)
                        .offset(x: appeared ? 0 : -20)
                        
                        // MARK: - Local Video Upload Card
                        VStack(alignment: .leading, spacing: Spacing.sm) {
                            HStack(spacing: Spacing.sm) {
                                ZStack {
                                    Circle().fill(Color.btDoctorPrimary.opacity(0.1)).frame(width: 32, height: 32)
                                    Image(systemName: "photo.on.rectangle.angled")
                                        .foregroundColor(.btDoctorPrimary)
                                }
                                Text("Local Video File")
                                    .font(.btHeadline)
                                    .foregroundColor(.btTextPrimary)
                            }
                            
                            PhotosPicker(selection: $selectedVideo, matching: .videos) {
                                HStack(spacing: Spacing.sm) {
                                    Image(systemName: selectedVideo != nil ? "checkmark.circle.fill" : "folder.fill")
                                        .font(.system(size: 18))
                                    Text(selectedVideo != nil ? "Video Prepared" : "Select from Photos")
                                        .font(.btLabel)
                                }
                                .foregroundColor(selectedVideo != nil ? .btAccentGreen : .btDoctorPrimary)
                                .frame(maxWidth: .infinity)
                                .frame(height: 56)
                                .background(Color.btSurface)
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 14)
                                        .strokeBorder(
                                            style: StrokeStyle(lineWidth: 1.5, dash: selectedVideo != nil ? [] : [6])
                                        )
                                        .foregroundColor(selectedVideo != nil ? Color.btAccentGreen : Color.btDoctorPrimary.opacity(0.5))
                                )
                            }
                            
                            if selectedVideo != nil {
                                Button(action: uploadLocalVideo) {
                                    HStack {
                                        Text("Upload File")
                                            .font(.btLabel)
                                        Image(systemName: "icloud.and.arrow.up.fill")
                                    }
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .frame(height: 50)
                                    .background(Color.btDoctorPrimary)
                                    .clipShape(RoundedRectangle(cornerRadius: 14))
                                    .padding(.top, Spacing.sm)
                                }
                            }
                        }
                        .padding(Spacing.md)
                        .background(Color.btSurface)
                        .clipShape(RoundedRectangle(cornerRadius: 20))
                        .btCardShadow()
                        .padding(.horizontal, Spacing.lg)
                        .opacity(appeared ? 1 : 0)
                        .offset(x: appeared ? 0 : 20)
                        
                    }
                    .padding(.bottom, 60)
                }
            }
            
            if isUploading {
                ZStack {
                    Color.black.opacity(0.4).ignoresSafeArea()
                    VStack(spacing: Spacing.md) {
                        ProgressView()
                            .scaleEffect(1.5)
                            .tint(.btDoctorPrimary)
                        Text("Uploading Data...")
                            .font(.btHeadline)
                            .foregroundColor(.btTextPrimary)
                    }
                    .frame(width: 180, height: 160)
                    .background(Color.btSurface)
                    .clipShape(RoundedRectangle(cornerRadius: 24))
                    .btDeepShadow()
                }
            }
        }
        .navigationBarHidden(true)
        .alert(isPresented: $showAlert) {
            Alert(title: Text("Upload Status"), message: Text(alertMessage), dismissButton: .default(Text("OK")))
        }
        .onAppear {
            withAnimation(.spring(response: 0.6, dampingFraction: 0.8)) {
                appeared = true
            }
        }
    }

    func uploadYoutubeURL() {
        guard let url = APIConfig.getURL(for: "upload_video.php") else { return }
        withAnimation { isUploading = true }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        let body = "action=add_url&video_url=\(youtubeURL)&title=YouTube Video"
        request.httpBody = body.data(using: .utf8)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                withAnimation { isUploading = false }
                if let error = error {
                    alertMessage = error.localizedDescription
                } else {
                    alertMessage = "YouTube Link added successfully!"
                    youtubeURL = ""
                }
                showAlert = true
            }
        }.resume()
    }

    func uploadLocalVideo() {
        guard let selectedVideo = selectedVideo else { return }
        withAnimation { isUploading = true }
        
        selectedVideo.loadTransferable(type: Data.self) { result in
            switch result {
            case .success(let data):
                if let videoData = data {
                    performMultipartUpload(videoData: videoData)
                } else {
                    DispatchQueue.main.async {
                        withAnimation { isUploading = false }
                        alertMessage = "Failed to read selected video."
                        showAlert = true
                    }
                }
            case .failure(let error):
                DispatchQueue.main.async {
                    withAnimation { isUploading = false }
                    alertMessage = error.localizedDescription
                    showAlert = true
                }
            }
        }
    }

    func performMultipartUpload(videoData: Data) {
        guard let url = APIConfig.getURL(for: "upload_video.php") else { return }
        
        let boundary = "Boundary-\(UUID().uuidString)"
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        
        var body = Data()
        
        // Action parameter
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"action\"\r\n\r\n".data(using: .utf8)!)
        body.append("upload\r\n".data(using: .utf8)!)
        
        // Title parameter
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"title\"\r\n\r\n".data(using: .utf8)!)
        body.append("Local Video\r\n".data(using: .utf8)!)
        
        // Video file
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"video\"; filename=\"video.mp4\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: video/mp4\r\n\r\n".data(using: .utf8)!)
        body.append(videoData)
        body.append("\r\n".data(using: .utf8)!)
        
        body.append("--\(boundary)--\r\n".data(using: .utf8)!)
        
        request.httpBody = body
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                withAnimation { isUploading = false }
                if let error = error {
                    alertMessage = error.localizedDescription
                } else {
                    alertMessage = "Local Video uploaded successfully!"
                    self.selectedVideo = nil
                }
                showAlert = true
            }
        }.resume()
    }
}

#Preview {
    VideosUploading()
}
