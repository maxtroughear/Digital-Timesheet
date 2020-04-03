/** @jsx jsx */
/** @jsxFrag React.Fragment */
import { jsx } from '@emotion/core';
import { PureComponent } from 'react';

class AuthPage extends PureComponent {
  render() {
    return (
      <div>
        <h1 css={{ color: 'red' }}>The Auth Page</h1>
        <p>New Line Stuff</p>
      </div>
    );
  }
}

export default AuthPage;
