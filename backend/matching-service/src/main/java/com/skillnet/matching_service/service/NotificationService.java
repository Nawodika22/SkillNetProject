package com.skillnet.matching_service.service;

import com.skillnet.matching_service.entity.Notification;
import com.skillnet.matching_service.repository.NotificationRepository;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void sendMatchNotification(Long workerId, String workerName, String jobTitle, double score) {
        String messageText = String.format("Hi %s, you have a new job match for '%s' with a match score of %.1f%%!",
                workerName, jobTitle, score);

        Notification notification = Notification.builder()
                .recipientWorkerId(workerId)
                .workerName(workerName)
                .message(messageText)
                .status("SENT")
                .build();

        notificationRepository.save(notification);

        // System Log / Console Simulation
        System.out.println("\n================ [NOTIFICATION SENT] ================");
        System.out.println("To Worker ID: " + workerId + " (" + workerName + ")");
        System.out.println("Message: " + messageText);
        System.out.println("=====================================================\n");
    }

    public Notification createNotification(Notification notification) {
        if (notification.getStatus() == null || notification.getStatus().isBlank()) {
            notification.setStatus("SENT");
        }
        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(java.time.LocalDateTime.now());
        }
        Notification saved = notificationRepository.save(notification);

        System.out.println("\n================ [NOTIFICATION SAVED] ================");
        System.out.println("To Worker ID: " + saved.getRecipientWorkerId() + " (" + saved.getWorkerName() + ")");
        System.out.println("Message: " + saved.getMessage());
        System.out.println("Status: " + saved.getStatus());
        System.out.println("======================================================\n");
        return saved;
    }

    public Notification sendHireRequest(Long workerId, String workerName, String vacancyTitle, String employerName, String customMessage) {
        String details = (customMessage != null && !customMessage.isBlank()) ? customMessage.trim() : "We would like to hire you for this position!";
        String sender = (employerName != null && !employerName.isBlank()) ? employerName : "An employer";
        String messageText = String.format("Hire Request from %s for '%s': %s",
                sender, (vacancyTitle != null ? vacancyTitle : "Job Match"), details);

        Notification notification = Notification.builder()
                .recipientWorkerId(workerId)
                .workerName(workerName)
                .message(messageText)
                .status("SENT")
                .createdAt(java.time.LocalDateTime.now())
                .build();

        return createNotification(notification);
    }

    public java.util.List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public java.util.List<Notification> getNotificationsForWorker(Long workerId) {
        return notificationRepository.findByRecipientWorkerIdOrderByCreatedAtDesc(workerId);
    }
}