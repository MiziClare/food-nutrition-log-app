package com.example.foodlogapp.config;

import com.fasterxml.jackson.core.StreamReadConstraints;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

@Configuration
public class JacksonConfig {

    static {
        // 在类加载时立即设置系统默认约束
        System.setProperty("com.fasterxml.jackson.core.StreamReadConstraints.maxStringLength", "100000000");
    }

    @Bean
    @Primary
    public Jackson2ObjectMapperBuilder jackson2ObjectMapperBuilder() {
        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();

        // 创建自定义的 StreamReadConstraints
        StreamReadConstraints constraints = StreamReadConstraints.builder()
                .maxStringLength(100_000_000)
                .maxNumberLength(10000)
                .maxNestingDepth(2000)
                .build();

        builder.postConfigurer(objectMapper -> {
            objectMapper.getFactory().setStreamReadConstraints(constraints);
        });

        return builder;
    }

    @Bean
    @Primary
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        return builder.build();
    }
}
