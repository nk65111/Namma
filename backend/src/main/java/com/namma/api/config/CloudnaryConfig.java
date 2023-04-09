package com.namma.api.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;

@Configuration
public class CloudnaryConfig {
	
	@Value("${cloudnary.name}")
	private String CLOUD_NAME;
	
	@Value("${cloudnary.api.key}")
    private String API_KEY;
	
	@Value("${cloudnary.api.secret}")
    private String API_SECRET;
    
    @Bean
    public Cloudinary cloudinary(){
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name",CLOUD_NAME);
        config.put("api_key",API_KEY);
        config.put("api_secret",API_SECRET);
        return new Cloudinary(config);
    }
}
