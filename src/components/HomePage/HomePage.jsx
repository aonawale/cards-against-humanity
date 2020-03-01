import React from 'react';
import Card, { cardTypes } from 'components/Card/Card';

const HomePage = () => (
  <>
    <Card text="How are you?" />
    <Card text="How are you is the quqeyebs sjhgs?" type={cardTypes.black} />
  </>
);

export default HomePage;
