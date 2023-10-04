import Search, { findKeyTerms } from "./api/search.js";

(async () => {
    const query = "How to add on click event to reactjs div element?";
    const helpfulness = 0.2;
    const questions = await Search(query, findKeyTerms(query));
    if (questions.length > 0) {
        const randomQuestion = questions[Math.floor(Math.random() * Math.min(Math.floor(questions.length * (1 - helpfulness)), questions.length))];
        console.log(randomQuestion);
    } else {

    }
})();