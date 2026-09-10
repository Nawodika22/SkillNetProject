package com.skillnet.matching_service.controller;

import com.skillnet.matching_service.entity.Notification;
import com.skillnet.matching_service.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        Notification saved = notificationService.createNotification(notification);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PostMapping("/hire")
    public ResponseEntity<Notification> requestHire(@RequestBody Map<String, Object> payload) {
        Long workerId = null;
        if (payload.get("recipientWorkerId") != null) {
            workerId = Long.valueOf(payload.get("recipientWorkerId").toString());
        } else if (payload.get("workerId") != null) {
            workerId = Long.valueOf(payload.get("workerId").toString());
        }

        String workerName = payload.get("workerName") != null ? payload.get("workerName").toString() : "Worker";
        String vacancyTitle = payload.get("vacancyTitle") != null ? payload.get("vacancyTitle").toString() : 
                              (payload.get("jobTitle") != null ? payload.get("jobTitle").toString() : "Specialist Position");
        String employerName = payload.get("employerName") != null ? payload.get("employerName").toString() : "Employer";
        String customMessage = payload.get("message") != null ? payload.get("message").toString() : "";

        Notification saved = notificationService.sendHireRequest(workerId, workerName, vacancyTitle, employerName, customMessage);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<Notification>> getNotificationsForWorker(@PathVariable Long workerId) {
        return ResponseEntity.ok(notificationService.getNotificationsForWorker(workerId));
    }
}
