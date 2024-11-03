package com.min9805.chat.global.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class UrlUtils {
    private final Base62Encoder base62Encoder;

    public String sanitizeUrl(String url) {
        try {
            // URL 유효성 검증 및 정규화
            URL validUrl = new URL(url);
            return base62Encoder.encode(validUrl.getHost() + validUrl.getPath());
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("Invalid URL: " + url);
        }
    }

    public String getTopicDestination(String url) {
        try {
            // URL을 topic 이름으로 변환 (특수문자 처리)
            return URLEncoder.encode(url, StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("Error encoding URL: " + url);
        }
    }
}