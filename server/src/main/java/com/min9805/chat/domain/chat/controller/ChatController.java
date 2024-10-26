package com.min9805.chat.domain.chat.controller;

import com.min9805.chat.domain.chat.service.ChatProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ChatController {
    private final ChatProducer chatProducer;

    @PostMapping("/send")
    public String sendMessage(@RequestParam String message) {
        chatProducer.sendMessage(message);
        return "Message sent: " + message;
    }
}