import React, { useState, useEffect, useCallback } from 'react';
import './style.css';

const debounce = (fn, d) => {
  let timer;
  return (...args) => {
    // console.log('timer', timer);
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args);
    }, d);
  };
};

export default function App() {
  const [inputval, setInputVal] = useState('');
  const [items, setItems] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputVal(value);
  };

  const resetInputVal = () => {
    console.log('reset');
    setInputVal('');
    setItems([]);
  };

  const getData = async (name) => {
    console.log('name', name);
    if (!name) return;
    const res = await fetch(
      `https://autocomplete.clearbit.com/v1/companies/suggest?query=${name}`
    );

    const data = await res.json();
    setItems(data);
    // console.log(data);
  };

  const debouncedGetData = useCallback(debounce(getData, 1000), []);

  useEffect(() => {
    // console.log('calling api');
    // getData(inputval);
    debouncedGetData(inputval);
  }, [inputval]);

  return (
    <div>
      <div className="search">
        <input
          type="text"
          onChange={handleInputChange}
          value={inputval}
          placeholder="Search..."
        />
        <button onClick={resetInputVal}>Reset</button>
      </div>

      {(items || []).map((item) => (
        <div className="item">
          <span>{item.name}</span>
          <img src={item.logo} />
        </div>
      ))}
    </div>
  );
}
