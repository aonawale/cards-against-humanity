import React from 'react';
// import './App.css';
import { cardTypes } from 'components/Card/Card';
import Card from 'components/Card/Card';

function App() {
  return (
    <>
    <Card text='How are you?'/>
    <Card text='How are you is the quqeyebs sjhgs?' type={cardTypes.black}/>
    </>
  );
}

export default App;
