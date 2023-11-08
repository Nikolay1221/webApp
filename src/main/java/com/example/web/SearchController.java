package com.example.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class SearchController {
    private final AdService adService;

    public SearchController(AdService adService) {
        this.adService = adService;
    }

    @GetMapping("/")
    public String showSearchForm() {
        return "search-results";
    }

    @PostMapping("/search")
    public @ResponseBody List<Ad> searchAds(@RequestBody String searchText) {
        return adService.searchAdsBySimilarTitle(searchText, 0, true);
    }
}

