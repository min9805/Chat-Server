package com.min9805.chat.global.utils;

import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;

@Component
public class Base62Encoder {
    private static final String ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final BigInteger BASE = BigInteger.valueOf(62);

    public String encode(String input) {
        // 입력 문자열을 바이트 배열로 변환 후 BigInteger로 변환
        BigInteger number = new BigInteger(1, input.getBytes(StandardCharsets.UTF_8));
        StringBuilder encoded = new StringBuilder();

        // BigInteger를 Base62로 변환
        while (number.compareTo(BigInteger.ZERO) > 0) {
            BigInteger[] divmod = number.divideAndRemainder(BASE);
            encoded.insert(0, ALPHABET.charAt(divmod[1].intValue()));
            number = divmod[0];
        }

        return encoded.toString();
    }
}