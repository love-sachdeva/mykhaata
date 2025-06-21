package com.gurukripa.apnakhata.Service;

import com.gurukripa.apnakhata.DTO.ActivityDTO;
import com.gurukripa.apnakhata.Entity.Activity;
import com.gurukripa.apnakhata.Repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityService {

    @Autowired
    ActivityRepository activityRepository;

    public void logActivity(String type, String title, String subtitle) {
        Activity activity = Activity.builder()
                .type(type)
                .title(title)
                .subtitle(subtitle)
                .createdAt(LocalDateTime.now())
                .build();
        activityRepository.save(activity);
    }

    public List<ActivityDTO> getRecentActivities() {
        List<Activity> activities = activityRepository.findTop20ByOrderByCreatedAtDesc();
        return activities.stream()
                .map(a -> new ActivityDTO(
                        a.getId(),
                        a.getType(),
                        a.getTitle(),
                        a.getSubtitle(),
                        timeAgo(a.getCreatedAt())
                ))
                .collect(Collectors.toList());
    }

    private String timeAgo(LocalDateTime createdAt) {
        Duration duration = Duration.between(createdAt, LocalDateTime.now());
        if (duration.toMinutes() < 60) {
            return duration.toMinutes() + "m ago";
        } else if (duration.toHours() < 24) {
            return duration.toHours() + "h ago";
        } else {
            return duration.toDays() + "d ago";
        }
    }
}
