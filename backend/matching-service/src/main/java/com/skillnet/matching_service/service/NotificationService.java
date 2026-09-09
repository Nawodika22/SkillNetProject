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
}