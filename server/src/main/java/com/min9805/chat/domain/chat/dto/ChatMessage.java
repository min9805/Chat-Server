package com.min9805.chat.domain.chat.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChatMessage {
    String message;
    String sender;
    String url;
}
