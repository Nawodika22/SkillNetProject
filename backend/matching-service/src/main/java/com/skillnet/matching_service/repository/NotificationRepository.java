package com.skillnet.matching_service.repository;

import com.skillnet.matching_service.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientWorkerIdOrderByCreatedAtDesc(Long workerId);
}