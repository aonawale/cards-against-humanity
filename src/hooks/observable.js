import { useState, useEffect } from 'react';

const useObservable = (observable, defaultValue) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const subscription = observable.subscribe(setValue);
    return () => subscription.unsubscribe();
  }, [observable]);

  return value;
};

export default useObservable;
