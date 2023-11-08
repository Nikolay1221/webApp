package com.example.web;

import java.util.logging.Level;
import java.util.logging.Logger;

public class CustomLogger {
    private final Logger logger;

    public CustomLogger(Class<?> clazz) {
        logger = Logger.getLogger(clazz.getName());
    }

    public void logInfo(String message) {
        logger.log(Level.INFO, message);
    }

    public void logError(String message, Throwable throwable) {
        logger.log(Level.SEVERE, message, throwable);
    }

    // Другие методы логирования, если необходимо

    // Например:
    // public void logWarning(String message) {
    //     logger.log(Level.WARNING, message);
    // }
}
