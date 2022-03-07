import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import styles from '../styles/sign_in.module.css';
import { authContext } from '../context/auth';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isHideError, setIsHideError] = useState(true);

  const auth = useContext(authContext);
  const isAuth = auth.isAuth;
  const router = useRouter();
  const { back_to } = router.query;

  function goBack() {
    let target: string | undefined;
    if (typeof back_to === 'object') {
      target = back_to[0];
    } else {
      target = back_to;
    }
    router.push(target ? `/${target}` : '/');
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsHideError(true);
    e.preventDefault();

    const result = await auth.service.signIn(username, password, isChecked);
    setPassword('');

    if (result === 'success') {
      goBack();
    } else if (result) {
      setErrorMsg(result);
      setIsHideError(false);
    } else {
      setErrorMsg('Something Wrong!');
      setIsHideError(false);
    }
  };

  useEffect(() => {
    if (isAuth === 'yes') {
      goBack();
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.window}>
        <img src="/img/logo.png" />
        <form onSubmit={handleSubmit}>
          <input
            type="username"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="Username"
            className={styles.input_box}
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
            className={styles.input_box}
          />
          <div className={styles.condition}>
            <span className={styles.check_stay}>
              <input
                type="checkbox"
                name="stay"
                checked={isChecked}
                onChange={(e) => {
                  setIsChecked(e.target.checked);
                }}
                className={styles.input_check}
              />
              Stay Signed In
            </span>
            <a>Forgot Password?</a>
          </div>
          {!isHideError && <div className={styles.error}>{errorMsg}</div>}
          <input type="submit" value="Sign In" className={`${styles.button} ${styles.input_box}`} />
        </form>
        <div className={styles.footer}>
          Don't have an account? <a>Sign Up</a>
        </div>
      </div>
    </div>
  );
}
