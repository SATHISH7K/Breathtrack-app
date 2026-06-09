import SwiftUI
import UserNotifications

struct ActiveInhalerReminder: Identifiable {
    let id = UUID()
    let patientId: String
    let title: String
    let body: String
}

@MainActor
class LocalNotificationManager: NSObject, ObservableObject, UNUserNotificationCenterDelegate {
    static let shared = LocalNotificationManager()
    
    @Published var isAuthorized = false
    @Published var activeInhalerReminder: ActiveInhalerReminder? = nil

    private var notificationSound: UNNotificationSound {
        return .default
    }
    
    override init() {
        super.init()
        UNUserNotificationCenter.current().delegate = self
        
        let takenAction = UNNotificationAction(identifier: "ACTION_TAKEN", title: "Taken", options: [])
        let snoozeAction = UNNotificationAction(identifier: "ACTION_SNOOZE", title: "Remind Me Later", options: [])
        let category = UNNotificationCategory(identifier: "INHALER_REMINDER", actions: [takenAction, snoozeAction], intentIdentifiers: [], options: [])
        UNUserNotificationCenter.current().setNotificationCategories([category])
        
        Task {
            await checkAuthorization()
        }
    }
    
    // Allow showing notifications while the app is actively running/open
    nonisolated func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        if notification.request.content.categoryIdentifier == "INHALER_REMINDER" {
            let userInfo = notification.request.content.userInfo
            let patientId = userInfo["patientId"] as? String ?? "unknown"
            
            Task { @MainActor in
                LocalNotificationManager.shared.activeInhalerReminder = ActiveInhalerReminder(
                    patientId: patientId,
                    title: notification.request.content.title,
                    body: notification.request.content.body
                )
            }
            completionHandler([.sound])
            return
        }
        completionHandler([.banner, .sound])
    }
    
    nonisolated func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        let userInfo = response.notification.request.content.userInfo
        let patientId = userInfo["patientId"] as? String ?? "unknown"
        
        if response.actionIdentifier == "ACTION_TAKEN" {
            let dateString = DateFormatter.localizedString(from: Date(), dateStyle: .short, timeStyle: .none)
            UserDefaults.standard.set(true, forKey: "inhaler_taken_\(patientId)_\(dateString)")
            UserDefaults.standard.synchronize()
        } else if response.actionIdentifier == "ACTION_SNOOZE" {
            Task { @MainActor in
                LocalNotificationManager.shared.scheduleSnoozeAlarm(patientId: patientId)
            }
        }
        completionHandler()
    }
    
    func scheduleSnoozeAlarm(patientId: String) {
        let content = UNMutableNotificationContent()
        content.title = "Time for your Inhaler 🌬️"
        content.body = "You asked to be reminded later. Please take your prescribed dose now."
        content.sound = notificationSound
        content.categoryIdentifier = "INHALER_REMINDER"
        content.userInfo = ["patientId": patientId]
        
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 5 * 60, repeats: false)
        let request = UNNotificationRequest(identifier: "\(patientId)_inhaler_snooze", content: content, trigger: trigger)
        UNUserNotificationCenter.current().add(request)
    }
    
    // MARK: - Permissions
    func requestAuthorization() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
            Task { @MainActor in
                self.isAuthorized = granted
                if let error = error {
                    print("Notification authorization error: \(error.localizedDescription)")
                }
            }
        }
    }

    func ensureAuthorization(completion: @escaping (Bool) -> Void) {
        UNUserNotificationCenter.current().getNotificationSettings { settings in
            switch settings.authorizationStatus {
            case .authorized, .provisional, .ephemeral:
                Task { @MainActor in
                    self.isAuthorized = true
                }
                completion(true)
            case .notDetermined:
                UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
                    Task { @MainActor in
                        self.isAuthorized = granted
                        if let error = error {
                            print("Notification authorization error: \(error.localizedDescription)")
                        }
                    }
                    completion(granted)
                }
            default:
                Task { @MainActor in
                    self.isAuthorized = false
                }
                completion(false)
            }
        }
    }
    
    private func checkAuthorization() async {
        let settings = await UNUserNotificationCenter.current().notificationSettings()
        self.isAuthorized = settings.authorizationStatus == .authorized
    }
    
    // MARK: - 1. Daily Inhaler Alarm
    /// Schedules a repeating daily alarm at a specific time
    func scheduleDailyInhalerAlarm(time: Date, title: String, body: String, identifier: String = "inhaler_daily_alarm", patientId: String, completion: ((Bool) -> Void)? = nil) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = notificationSound
        content.categoryIdentifier = "INHALER_REMINDER"
        content.userInfo = ["patientId": patientId]
        
        let calendar = Calendar.current
        var dateComponents = DateComponents()
        dateComponents.hour = calendar.component(.hour, from: time)
        dateComponents.minute = calendar.component(.minute, from: time)
        
        let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: true)
        let request = UNNotificationRequest(identifier: "\(patientId)_\(identifier)", content: content, trigger: trigger)
        
        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("Error scheduling daily inhaler alarm: \(error)")
                completion?(false)
            } else {
                print("Daily inhaler alarm scheduled successfully for \(dateComponents.hour!):\(dateComponents.minute!)")
                completion?(true)
            }
        }
    }
    
    // MARK: - 2. Inhaler Completed / Empty Reminder
    /// Triggers a reminder to refill the inhaler at a specific DATE and TIME chosen by the user
    func scheduleInhalerCompletedReminder(time: Date, title: String, body: String, identifier: String = "inhaler_completed", patientId: String, completion: ((Bool) -> Void)? = nil) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = notificationSound
        
        let calendar = Calendar.current
        let components = calendar.dateComponents([.year, .month, .day, .hour, .minute], from: time)
        
        let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
        let request = UNNotificationRequest(identifier: "\(patientId)_\(identifier)", content: content, trigger: trigger)
        
        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("Error scheduling inhaler completed reminder: \(error)")
                completion?(false)
            } else {
                print("Inhaler refill reminder scheduled for \(time)")
                completion?(true)
            }
        }
    }
    
    // MARK: - 3. Vaccine Reminder (Future Date)
    /// Schedules a reminder for a specific future date using the exact date + user-chosen time
    func scheduleVaccineReminder(for targetDate: Date, title: String, body: String, identifier: String, patientId: String, completion: ((Bool) -> Void)? = nil) {
        let content = UNMutableNotificationContent()
        content.title = title
        content.body = body
        content.sound = notificationSound
        
        let calendar = Calendar.current
        let components = calendar.dateComponents([.year, .month, .day, .hour, .minute], from: targetDate)
        
        let trigger = UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
        let request = UNNotificationRequest(identifier: "\(patientId)_\(identifier)", content: content, trigger: trigger)
        
        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("Error scheduling vaccine reminder: \(error)")
                completion?(false)
            } else {
                print("Vaccine reminder scheduled for \(targetDate)")
                completion?(true)
            }
        }
    }
    
    // MARK: - Cancel Notifications
    func cancelNotification(identifier: String, patientId: String) {
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: ["\(patientId)_\(identifier)"])
    }

    func cancelAllNotifications(for patientId: String) {
        UNUserNotificationCenter.current().getPendingNotificationRequests { requests in
            let identifiersToCancel = requests.map { $0.identifier }.filter { $0.hasPrefix("\(patientId)_") }
            UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: identifiersToCancel)
        }
    }
}
