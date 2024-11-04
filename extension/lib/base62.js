class Base62Encoder {
    constructor() {
        this.ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        this.BASE = BigInt(62);
    }

    encode(input) {
        // 문자열을 UTF-8 바이트 배열로 변환
        const encoder = new TextEncoder();
        const bytes = encoder.encode(input);

        // 바이트 배열을 BigInt로 변환
        let number = BigInt(0);
        for (let i = 0; i < bytes.length; i++) {
            number = number * BigInt(256) + BigInt(bytes[i]);
        }

        // BigInt를 Base62로 변환
        let encoded = '';
        while (number > 0) {
            const remainder = number % this.BASE;
            encoded = this.ALPHABET[Number(remainder)] + encoded;
            number = number / this.BASE;
        }

        return encoded || '0';
    }

    sanitizeUrl(url) {
        try {
            const urlObj = new URL(url);
            return this.encode(urlObj.hostname + urlObj.pathname);
        } catch (e) {
            throw new Error('Invalid URL: ' + url);
        }
    }
}