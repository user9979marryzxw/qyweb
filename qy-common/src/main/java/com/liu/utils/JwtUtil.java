package com.liu.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;
import java.util.Map;

import static io.jsonwebtoken.Jwts.claims;

public class JwtUtil {
    // 生成安全密钥（HS256需要至少256位）
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final long EXPIRATION_TIME = 864000000; // 240小时

    public static String generateToken(String username, Map<String, Object> claims) {

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .addClaims(claims) // 添加自定义声明
                .signWith(SECRET_KEY)
                .compact();
    }
    public static Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 使用示例
//    public void TestJwt() {
//        String token = generateToken("user1");
//        System.out.println("Generated Token: " + token);
//
//        Claims claims = parseToken(token);
//        System.out.println("Subject: " + claims.getSubject());
//        System.out.println("Expiration: " + claims.getExpiration());
//        System.out.println("Role: " + claims.get("role"));
//    }

}
