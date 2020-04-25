import { useState, useEffect } from 'react';

const useObservable = (observable) => {
  const [value, setValue] = useState();

  useEffect(() => {
    const subscription = observable.subscribe(setValue);
    return () => subscription.unsubscribe();
  }, [observable]);

  return value;
};

export default useObservable;
