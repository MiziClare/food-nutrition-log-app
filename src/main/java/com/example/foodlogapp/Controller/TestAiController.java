package com.example.foodlogapp.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RequiredArgsConstructor
@RestController
@RequestMapping("/ai")
public class TestAiController {

    private final ChatClient chatClient;

    // Test url: http://localhost:8080/ai/chat?prompt=Who?%20are%20you&chatId=123
    @RequestMapping(value = "/chat", produces = "text/html;charset=UTF-8")
    public Flux<String> chat(String prompt, String chatId) {

        // Construct the request model and send the request
        return chatClient.prompt()
                .user(prompt)
                .stream()
                .content();
    }
}
