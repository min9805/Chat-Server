package com.min9805.chat.domain.chat.controller;

import com.min9805.chat.domain.chat.dto.ChatMessage;
import com.min9805.chat.domain.chat.service.KafkaConsumer;
import com.min9805.chat.domain.chat.service.KafkaProducer;
import com.min9805.chat.global.utils.UrlUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    private final KafkaProducer kafkaProducer;
    private final KafkaConsumer kafkaConsumer;


    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessage message) {
        kafkaProducer.sendMessage(message);
    }

    @KafkaListener(topicPattern = ".*", groupId = "chat-group")
    public void listenAll(ChatMessage message,
                          @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        kafkaConsumer.sendMessage(topic, message);
    }
}