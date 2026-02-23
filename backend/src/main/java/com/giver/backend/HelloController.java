package com.giver.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 動作確認用の最小エンドポイント
 * - コンテナ起動確認
 * - Cloud Run疎通確認
 */
@RestController
public class HelloController {

    @GetMapping("/api/hello")
    public String hello() {
        return "hello";
    }
}