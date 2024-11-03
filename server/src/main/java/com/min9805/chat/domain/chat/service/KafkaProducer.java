package com.min9805.chat.domain.chat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.min9805.chat.domain.chat.dto.ChatMessage;
import com.min9805.chat.global.utils.UrlUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final UrlUtils urlUtils;

    public ChatMessage sendMessage(ChatMessage message) {

        String urlTopic = urlUtils.sanitizeUrl(message.getUrl());
        kafkaTemplate.send(urlTopic, message);

        return message;
    }
}
