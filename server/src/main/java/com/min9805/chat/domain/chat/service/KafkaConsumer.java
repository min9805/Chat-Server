package com.min9805.chat.domain.chat.service;

import com.min9805.chat.domain.chat.dto.ChatMessage;
import com.min9805.chat.global.utils.UrlUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaConsumer {
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatMessage sendMessage(String topic, ChatMessage message) {
        messagingTemplate.convertAndSend("/sub/" + topic, message);

        return message;
    }
}
