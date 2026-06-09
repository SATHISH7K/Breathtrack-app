import SwiftUI

struct PatientSignUp: View {

    @State private var patientId: String = "pat_XXX (System Assigned)"
    @State private var patientName: String = ""
    @State private var age: String = ""
    @State private var gender: String = "Select Gender"
    @State private var height: String = ""
    @State private var weight: String = ""
    @State private var diagnosis: String = ""
    @State private var occupation: String = ""
    @State private var phoneNumber: String = ""
    @State private var password: String = ""
    @State private var confirmPassword: String = ""
    
    @State private var showAlert: Bool = false
    @State private var alertMessage: String = ""
    @State private var isRegistered: Bool = false
    @State private var isUploading: Bool = false
    @Environment(\.dismiss) private var dismiss

    private let genderOptions = ["Male", "Female", "Other"]
    
    @State private var appeared = false
    
    var body: some View {
        ZStack {
            Color.btBackground.ignoresSafeArea()
            
            VStack(spacing: 0) {
                // MARK: - Header
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
                    Text("Patient Sign Up")
                        .font(.btHeadline)
                        .foregroundColor(.btTextPrimary)
                    Spacer()
                    Color.clear.frame(width: 44, height: 44)
                }
                .padding(.horizontal, Spacing.lg)
                .padding(.top, Spacing.md)
                .padding(.bottom, Spacing.sm)
                
                ScrollView(showsIndicators: false) {
                    VStack(spacing: Spacing.xl) {
                        
                        // MARK: - Illustration
                        VStack(spacing: Spacing.xs) {
                            ZStack {
                                Circle()
                                    .fill(LinearGradient.btPrimaryGradient)
                                    .frame(width: 72, height: 72)
                                    .btDeepShadow(color: Color.btPrimary)
                                
                                Image(systemName: "person.badge.plus")
                                    .font(.system(size: 30, weight: .semibold))
                                    .foregroundColor(.white)
                            }
                            .padding(.bottom, Spacing.sm)
                            
                            Text("Create Account")
                                .font(.btTitle2)
                                .foregroundColor(.btTextPrimary)
                            
                            Text("Please fill in your details to get started")
                                .font(.btCaption)
                                .foregroundColor(.btTextSecond)
                        }
                        .padding(.top, Spacing.md)
                        .opacity(appeared ? 1 : 0)
                        
                        // MARK: - Form
                        VStack(spacing: Spacing.lg) {
                            
                            formSection(title: "Personal Information") {
                                VStack(spacing: Spacing.md) {
                                    BTInputField(placeholder: "Patient ID", icon: "number.square", text: $patientId)
                                        .disabled(true)
                                        .opacity(0.6)
                                    
                                    VStack(alignment: .leading, spacing: 4) {
                                        BTInputField(placeholder: "Full Name", icon: "person.fill", text: $patientName)
                                            .textInputAutocapitalization(.words)
                                        if !patientName.isEmpty && patientName.rangeOfCharacter(from: CharacterSet.decimalDigits) != nil {
                                            Text("Please enter a valid name without numbers")
                                                .font(.btCaption2).foregroundColor(.btAccentOrange).padding(.leading, Spacing.md)
                                        }
                                    }
                                    
                                    HStack(spacing: Spacing.md) {
                                        VStack(alignment: .leading, spacing: 4) {
                                            BTInputField(placeholder: "Age", icon: "calendar", text: $age)
                                                .keyboardType(.numberPad)
                                            if !age.isEmpty && Int(age.trimmingCharacters(in: .whitespaces)) == nil {
                                                Text("Numbers only").font(.btCaption2).foregroundColor(.btAccentOrange).padding(.leading, 8)
                                            }
                                        }
                                        
                                        genderPicker
                                    }
                                    
                                    VStack(alignment: .leading, spacing: 4) {
                                        BTInputField(placeholder: "Occupation", icon: "briefcase.fill", text: $occupation)
                                            .textInputAutocapitalization(.words)
                                        if !occupation.isEmpty && occupation.rangeOfCharacter(from: CharacterSet.decimalDigits) != nil {
                                            Text("Please enter a valid occupation").font(.btCaption2).foregroundColor(.btAccentOrange).padding(.leading, Spacing.md)
                                        }
                                    }
                                    
                                    VStack(alignment: .leading, spacing: 4) {
                                        BTInputField(placeholder: "Phone Number", icon: "phone.fill", text: $phoneNumber)
                                            .keyboardType(.phonePad)
                                        if !phoneNumber.isEmpty && (phoneNumber.count < 10 || Int(phoneNumber) == nil) {
                                            Text("Enter a valid phone number").font(.btCaption2).foregroundColor(.btAccentOrange).padding(.leading, Spacing.md)
                                        }
                                    }
                                }
                            }
                            
                            formSection(title: "Medical Details") {
                                VStack(spacing: Spacing.md) {
                                    HStack(spacing: Spacing.md) {
                                        VStack(alignment: .leading, spacing: 4) {
                                            BTInputField(placeholder: "Height (cm)", icon: "arrow.up.and.down", text: $height)
                                                .keyboardType(.decimalPad)
                                            if !height.isEmpty && Double(height.trimmingCharacters(in: .whitespaces)) == nil {
                                                Text("Numbers only").font(.btCaption2).foregroundColor(.btAccentOrange).padding(.leading, 8)
                                            }
                                        }
                                        
                                        VStack(alignment: .leading, spacing: 4) {
                                            BTInputField(placeholder: "Weight (kg)", icon: "scalemass.fill", text: $weight)
                                                .keyboardType(.decimalPad)
                                            if !weight.isEmpty && Double(weight.trimmingCharacters(in: .whitespaces)) == nil {
                                                Text("Numbers only").font(.btCaption2).foregroundColor(.btAccentOrange).padding(.leading, 8)
                                            }
                                        }
                                    }
                                    
                                    VStack(alignment: .leading, spacing: 4) {
                                        BTInputField(placeholder: "Initial Diagnosis", icon: "stethoscope", text: $diagnosis)
                                            .textInputAutocapitalization(.sentences)
                                        if !diagnosis.isEmpty && diagnosis.trimmingCharacters(in: .whitespaces).count < 3 {
                                            Text("Min 3 characters").font(.btCaption2).foregroundColor(.btAccentOrange).padding(.leading, Spacing.md)
                                        }
                                    }
                                }
                            }
                            
                            formSection(title: "Security") {
                                VStack(spacing: Spacing.md) {
                                    VStack(alignment: .leading, spacing: 4) {
                                        BTInputField(placeholder: "Password", icon: "lock.fill", text: $password, isSecure: true)
                                        if !password.isEmpty && password.count < 6 {
                                            Text("Min 6 characters").font(.btCaption2).foregroundColor(.btAccentOrange).padding(.leading, Spacing.md)
                                        }
                                    }
                                    
                                    VStack(alignment: .leading, spacing: 4) {
                                        BTInputField(placeholder: "Confirm Password", icon: "lock.shield.fill", text: $confirmPassword, isSecure: true)
                                        if !confirmPassword.isEmpty && confirmPassword != password {
                                            Text("Passwords do not match").font(.btCaption2).foregroundColor(.btAccentOrange).padding(.leading, Spacing.md)
                                        }
                                    }
                                }
                            }
                        }
                        .padding(.horizontal, Spacing.lg)
                        .opacity(appeared ? 1 : 0)
                        .offset(y: appeared ? 0 : 20)
                        
                        // MARK: - Actions
                        VStack(spacing: Spacing.md) {
                            if isRegistered {
                                Button(action: { dismiss() }) {
                                    HStack {
                                        Text("Continue to Login")
                                            .font(.btLabel)
                                        Image(systemName: "checkmark.circle.fill")
                                    }
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .frame(height: 56)
                                    .background(Color.btAccentGreen)
                                    .clipShape(RoundedRectangle(cornerRadius: 16))
                                    .btDeepShadow(color: Color.btAccentGreen)
                                }
                            } else {
                                BTPrimaryButton(title: "Sign Up", isLoading: isUploading) {
                                    signUp()
                                }
                            }
                            
                            HStack {
                                Text("Already have an account?")
                                    .font(.btCaption)
                                    .foregroundColor(.btTextSecond)
                                Button("Sign In") {
                                    dismiss()
                                }
                                .font(.btCaption)
                                .foregroundColor(.btPrimary)
                            }
                            .padding(.bottom, 40)
                        }
                        .padding(.horizontal, Spacing.lg)
                        .opacity(appeared ? 1 : 0)
                        .offset(y: appeared ? 0 : 20)
                    }
                }
            }
        }
        .navigationBarHidden(true)
        .alert(isPresented: $showAlert) {
            Alert(
                title: Text(isRegistered ? "Success" : "Registration"),
                message: Text(alertMessage),
                dismissButton: .default(Text("OK"))
            )
        }
        .onAppear {
            withAnimation(.spring(response: 0.6, dampingFraction: 0.8)) {
                appeared = true
            }
        }
    }
    
    // MARK: - Components
    
    private func formSection<Content: View>(title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: Spacing.sm) {
            Text(title)
                .font(.btCaption2)
                .foregroundColor(.btTextSecond)
                .textCase(.uppercase)
                .padding(.leading, 4)
            
            content()
        }
    }
    
    private var genderPicker: some View {
        Menu {
            ForEach(genderOptions, id: \.self) { option in
                Button(option) { gender = option }
            }
        } label: {
            HStack {
                Image(systemName: "person.and.arrow.left.and.arrow.right")
                    .font(.system(size: 17, weight: .medium))
                    .foregroundColor(gender == "Select Gender" ? .btTextTertiary : .btPrimary)
                    .frame(width: 22)
                
                Text(gender == "Select Gender" ? "Gender" : gender)
                    .font(.btBodyMedium)
                    .foregroundColor(gender == "Select Gender" ? .btTextTertiary : .btTextPrimary)
                
                Spacer()
                
                Image(systemName: "chevron.down")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(.btTextTertiary)
            }
            .padding(.horizontal, Spacing.md)
            .frame(height: 54)
            .background(Color.btSurface)
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .stroke(Color.btBorder, lineWidth: 1.5)
            )
            .btCardShadow()
        }
        .buttonStyle(.plain)
    }
    
    // MARK: - API Logic
    private func signUp() {
        if patientName.trimmingCharacters(in: .whitespaces).isEmpty ||
            age.trimmingCharacters(in: .whitespaces).isEmpty ||
            gender == "Select Gender" ||
            height.trimmingCharacters(in: .whitespaces).isEmpty ||
            weight.trimmingCharacters(in: .whitespaces).isEmpty ||
            diagnosis.trimmingCharacters(in: .whitespaces).isEmpty ||
            occupation.trimmingCharacters(in: .whitespaces).isEmpty ||
            phoneNumber.trimmingCharacters(in: .whitespaces).isEmpty ||
            password.isEmpty ||
            confirmPassword.isEmpty {

            alertMessage = "Please fill in all fields."
            showAlert = true
            return
        }
        
        let cleanedAge = age.trimmingCharacters(in: .whitespaces)
        guard let parsedAge = Int(cleanedAge), parsedAge > 0 && parsedAge < 130 else { return }
        
        guard Double(height.trimmingCharacters(in: .whitespaces)) != nil else { return }
        guard Double(weight.trimmingCharacters(in: .whitespaces)) != nil else { return }

        if password != confirmPassword || password.count < 6 { return }
        if patientName.rangeOfCharacter(from: CharacterSet.decimalDigits) != nil { return }
        if occupation.rangeOfCharacter(from: CharacterSet.decimalDigits) != nil { return }
        if phoneNumber.count < 10 || Int(phoneNumber) == nil { return }
        if diagnosis.trimmingCharacters(in: .whitespaces).count < 3 { return }

        guard let url = APIConfig.getURL(for: "patient_signup.php") else {
            alertMessage = "Invalid URL configuration"
            showAlert = true
            return
        }
        
        withAnimation { isUploading = true }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body: [String: Any] = [
            "name": patientName,
            "age": age,
            "gender": gender,
            "height": height,
            "weight": weight,
            "diagnosis": diagnosis,
            "occupation": occupation,
            "phone_number": phoneNumber,
            "password": password
        ]
        
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                withAnimation { isUploading = false }
                
                if let error = error {
                    self.alertMessage = "Error: \(error.localizedDescription)"
                    self.showAlert = true
                    return
                }
                
                guard let data = data else {
                    self.alertMessage = "No data received."
                    self.showAlert = true
                    return
                }
                
                do {
                    if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
                        if let status = json["status"] as? String, status == "success" {
                            let generatedId = json["patient_id"] as? String ?? "Unknown"
                            self.patientId = generatedId
                            self.isRegistered = true
                            
                            UserDefaults.standard.set(generatedId, forKey: "lastCreatedPatientId")
                            
                            self.alertMessage = "Patient registered successfully!\n\nYour Patient ID is \(generatedId)."
                            self.showAlert = true
                        } else {
                            self.alertMessage = json["message"] as? String ?? "Signup failed."
                            self.showAlert = true
                        }
                    } else {
                        self.alertMessage = "Invalid response from server"
                        self.showAlert = true
                    }
                } catch {
                    self.alertMessage = "Server error."
                    self.showAlert = true
                }
            }
        }.resume()
    }
}

#Preview {
    PatientSignUp()
}
