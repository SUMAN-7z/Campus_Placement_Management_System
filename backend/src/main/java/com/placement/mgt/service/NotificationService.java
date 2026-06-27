package com.placement.mgt.service;

import com.placement.mgt.entity.Notification;
import com.placement.mgt.entity.User;
import com.placement.mgt.exception.ResourceNotFoundException;
import com.placement.mgt.repository.NotificationRepository;
import com.placement.mgt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public Notification createNotification(Long userId, String title, String message, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();

        // Print mock email notification to system console
        sendMockEmail(user.getEmail(), title, message);

        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void broadcastNotification(String title, String message, String type) {
        // Broadcasts to all active users
        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            Notification notification = Notification.builder()
                    .user(user)
                    .title(title)
                    .message(message)
                    .type(type)
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
        }
        System.out.println("Broadcasting: [" + title + "] - Sent to all users.");
    }

    private void sendMockEmail(String toEmail, String subject, String body) {
        System.out.println("==========================================================================");
        System.out.println("DISPATCHING EMAIL (MOCK SERVICE):");
        System.out.println("To: " + toEmail);
        System.out.println("Subject: " + subject);
        System.out.println("Body: " + body);
        System.out.println("==========================================================================");
    }
}
