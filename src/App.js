import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import FlashcardList from './components/FlashcardList';
import './App.css';

function App() {
  const [flashcards, setFlashCards] = useState([]);
  const [categories, setCategories] = useState([]);

  const categoryElement = useRef();
  const amountElement = useRef();

  useEffect(() => {
    axios
      .get('https://opentdb.com/api_category.php')
      .then(res => {
        setCategories(res.data.trivia_categories);
      })
  });

  // convert html encoded str to normal str
  function decodeString(str) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .get('https://opentdb.com/api.php', {
        // custom params
        params: {
          amount: amountElement.current.value,
          category: categoryElement.current.value
        }
      })
      .then(res => {
        setFlashCards(res.data.results.map((questionItem, index) => {
          const answer = questionItem.correct_answer;
          const options = [
            ...questionItem.incorrect_answers.map(a => decodeString(a)), 
            answer
          ];

          return {
            id: `${index}-${Date.now()}`,
            question: decodeString(questionItem.question),
            answer: decodeString(questionItem.correct_answer),
            options: options.sort(() => Math.random() - 0.5) 
          }
        }))
      })
  }

  return (
    <>
      <form className="header" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category </label>
          <select id="category" ref={categoryElement}>
            {categories.map(category => {
              return <option value={category.id} key={category.id}>{category.name}</option>
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Number of Questions </label>
          <input type="number" id="amount" min="1" step="1" defaultValue={10} ref={amountElement}/>
        </div>
        <div className="form-group">
          <button className="btn">Generate</button>
        </div>
      </form>
      <div className="container">
        <FlashcardList flashcards={flashcards} />
      </div>
    </>
  );
}

export default App;
