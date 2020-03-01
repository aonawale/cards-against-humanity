import React, { useRef, useEffect } from 'react';
import { firebaseUI } from 'lib/firebase';
import * as firebase from 'firebase/app';

const Login = () => {
  const ref = useRef();

  useEffect(() => {
    const config = {
      signInFlow: 'popup',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      ],
    };

    firebaseUI.start(ref.current, config);
  }, []);

  return (
    <div ref={ref} className="login" />
  );
};

export default Login;
