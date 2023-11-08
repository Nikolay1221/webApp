package com.example.web;

import org.apache.commons.text.similarity.LevenshteinDistance;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;



@Service
public class AdService {

    private final AdRepository adRepository;

    public AdService(AdRepository adRepository) {
        this.adRepository = adRepository;
    }

    public List<Ad> searchAdsBySimilarTitle(String searchText, double similarityThreshold, boolean useTitleAsOuterLoop) {
        List<Ad> allAds = adRepository.findAll();
        LevenshteinDistance distance = new LevenshteinDistance();

        Map<Ad, Integer> adScores = new HashMap<>();

        int maxScore = -1;

        for (Ad ad : allAds) {
            int score = calculateScore(ad, searchText, similarityThreshold, distance, useTitleAsOuterLoop);
            adScores.put(ad, score);
            maxScore = Math.max(maxScore, score);
        }

        final int finalMaxScore = maxScore;

        return allAds
                .stream()
                .filter(ad -> adScores.get(ad) == finalMaxScore).collect(Collectors.toList());
    }

    private int calculateScore(Ad ad, String searchText, double similarityThreshold, LevenshteinDistance distance, boolean useTitleAsOuterLoop) {
        String[] searchWords = prepareSearchText(searchText);
        String[] titleWords = prepareSearchText(ad.getTitle());

        int totalScore = 0;

        for (String outerWord : useTitleAsOuterLoop ? titleWords : searchWords) {
            boolean wordMatched = false;

            for (String innerWord : useTitleAsOuterLoop ? searchWords : titleWords) {
                double wordSimilarity = distance.apply(outerWord, innerWord);

                if (wordSimilarity <= similarityThreshold) {
                    wordMatched = true;
                    totalScore++; // Начисляем балл за сходство
                    break;
                }
            }

            if (!wordMatched) {
                totalScore--; // Вычитаем балл за различие
            }
        }

        return totalScore;
    }

    private String[] prepareSearchText(String text) {
        return text.replaceAll("[\\p{P}\\p{S}ГБ]", "").toLowerCase().split("\\s+");
    }
}