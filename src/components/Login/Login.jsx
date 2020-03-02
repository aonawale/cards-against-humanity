import React, { useRef, useEffect } from 'react';
import { firebaseUI } from 'lib/firebase';
import firebase from 'firebase/app';
import { useDispatch } from 'react-redux';
import { signinSuccess, signinFailure } from 'store/auth/auth.actions';

const Login = () => {
  const ref = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const config = {
      signInFlow: 'popup',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult(authResult) {
          dispatch(signinSuccess(authResult));
          return false;
        },
        signInFailure(error) {
          dispatch(signinFailure(error));
        },
      },
    };

    firebaseUI.start(ref.current, config);
  }, [dispatch]);

  return (
    <div ref={ref} />
  );
};

export default Login;
