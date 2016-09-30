import React from 'react';
import { render } from 'react-dom';
import TextEditor from './TextEditor.jsx';
import AppVideo from './Video.jsx';
import Chat from './Chat.jsx';

class App extends React.Component {
  render() {
    return (
      <div>
        <div className="Video">
          <AppVideo />
          <Chat />
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
