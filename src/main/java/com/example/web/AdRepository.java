package com.example.web;

import org.springframework.data.mongodb.repository.MongoRepository;


public interface AdRepository extends MongoRepository<Ad, String> {
}
