import { useState, useEffect } from "react";
import {
    getCardsFromDB,
    addCardToDB,
    addCardsToDB,
    updateCardInDB,
    deleteCardFromDB,
    clearCardsFromDB
} from "../db/localCardsDB";

const useLocalCards = () => {
    const [localCards, setLocalCards] = useState(new Map());

    const fetchCards = async () => {
        const storedCards = await getCardsFromDB();
        const cardsMap = new Map(storedCards.map(card => [card.id, card]));
        setLocalCards(cardsMap);
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const addLocalCard = async (card) => {
        await addCardToDB(card);
        fetchCards();
    };

    const addMultipleLocalCards = async (cards, replace = false) => {
        await addCardsToDB(cards, { replace });
        fetchCards();
    };

    const updateLocalCard = async (id, updatedCard) => {
        await updateCardInDB(id, updatedCard);
        fetchCards();
    };

    const deleteLocalCard = async (id) => {
        await deleteCardFromDB(id);
        fetchCards();
    };

    const clearLocalCards = async () => {
        await clearCardsFromDB();
        fetchCards();
    };

    return {
        localCards,
        addLocalCard,
        addMultipleLocalCards,
        updateLocalCard,
        deleteLocalCard,
        clearLocalCards
    };
};


export default useLocalCards;