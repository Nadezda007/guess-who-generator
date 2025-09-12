import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.BASE_URL;

const useContentData = () => {
    const [cards, setCards] = useState(new Map());
    const [categories, setCategories] = useState([]);
    const [sets, setSets] = useState([]);
    const [backgrounds, setBackgrounds] = useState(new Map());

    const fetchJsonOrEmpty = async (url) => {
        try {
            const res = await fetch(url);
            if (!res.ok) return [];
            const json = await res.json();
            return json;
        } catch (err) {
            return [];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cardsRes, categoriesRes, setsRes, backgroundsRes] = await Promise.all([
                    fetchJsonOrEmpty(BASE_URL + 'cards/cardConfig.json'),
                    fetchJsonOrEmpty(BASE_URL + 'categories/categoryList.json'),
                    fetchJsonOrEmpty(BASE_URL + 'sets/setConfig.json'),
                    fetchJsonOrEmpty(BASE_URL + 'backgrounds/backgroundConfig.json')
                ]);

                // Optimizing search: converting an array into a Map
                const cardsMap = new Map((cardsRes?.cards || []).map(card => [card.id, card]));
                const backgroundsMap = new Map((backgroundsRes?.backgrounds || []).map(bg => [bg.id, bg]));

                setCards(cardsMap);
                setCategories(categoriesRes?.categories || []);
                setSets(setsRes?.sets || []);
                setBackgrounds(backgroundsMap);

            } catch (error) {
                console.error("Data loading error:", error);
            }
        };

        fetchData();
    }, []);

    return { cards, categories, sets, backgrounds };
};

export default useContentData;
