package com.example.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class SearchSuggestions {
    private final AdService adService;

    public SearchSuggestions(AdService adService) {
        this.adService = adService;
    }

    @PostMapping("/searchSuggestions")
    public @ResponseBody List<Ad> searchSuggestions(@RequestBody String searchText) {
        return adService.searchAdsBySimilarTitle(searchText, 0, false);
    }
}
