package com.example.foodlogapp.config;

import com.example.foodlogapp.tools.FoodTools;
import com.example.foodlogapp.constants.SystemConstants;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CommonConfiguration {

    // 1. Configure client for general chat/test
    @Bean
    public ChatClient chatClient(OpenAiChatModel model) {
        return ChatClient
                .builder(model) // Create ChatClient factory instance
                .defaultSystem("你是一个食物营养日志小助手，致力于帮助用户解答各种问题。")
                //.defaultSystem(SystemConstants.CUSTOMER_SERVICE_PROMPT)
                .defaultAdvisors(
                        new SimpleLoggerAdvisor()
                ) // Configure log Advisor
                .build(); // Build ChatClient instance
    }

    // 2. Agent + Function Calling
    @Bean
    public ChatClient serviceChatClient(OpenAiChatModel model, FoodTools foodTools) {
        return ChatClient
                .builder(model) // Create ChatClient factory instance
                .defaultSystem(SystemConstants.CUSTOMER_SERVICE_PROMPT) // Set system prompt
                .defaultAdvisors(
                        new SimpleLoggerAdvisor()
                ) // Configure log Advisor
                .defaultTools(foodTools) // Register tool class
                .build(); // Build ChatClient instance
    }
}
