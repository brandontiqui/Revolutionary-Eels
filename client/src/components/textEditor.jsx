import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';

class TextEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quill: null,
      saveInterval: null
    };

  };

  componentDidMount () {
    var Delta = Quill.import('delta');
    var urldocId = window.location.search.split('').splice(11).join('');
    var user = 'user_' + Date.now(); // temp unique user identifier; swap out later with username
    console.log(user + ' logged on.');

    // var docId = 'doc' + Date.now(); 
    var sharelinkId = urldocId.length === 0 ? 'hr46' : urldocId; // default to public doc if there is no doc id in url

    var quill = new Quill('#editor', {
      theme: 'snow'
    });

    // setSate is async
    this.setState({ quill: quill }, () => { 
      console.log('async quill', this.state.quill)
      var socket = io();

      var change = new Delta();
      quill.on('text-change', function(delta, olddelta, source) {
        if (source === 'user') {
          change = change.compose(delta); // for saving partial changes
          socket.emit('change', {'sharelinkId': sharelinkId, 'who': user, 'delta': JSON.stringify(delta)});
        }
      });

      socket.on('change', function(msg){
        if(msg.who !== user && sharelinkId === msg.sharelinkId) { // prevent infinite loop; user who emitted msg should not receive it
          var del = JSON.parse(msg.delta);
          quill.updateContents( del );
        }
      });
      
      console.log('sharelinkid:', sharelinkId);
      axios.get('/document?sharelink=' + sharelinkId)
        .then(function(res) {
        quill.setContents( JSON.parse(res.data.textS3) );
        })
        .catch(function(err) {
          console.log('Error:' + err);
        });

      var saveInterval = setInterval(function() {
        if (change.length() > 0) {
          console.log('Saving changes', sharelinkId);

          // should commet out to limit AWS RDS db hits
          axios.put('/document', {
          	sharelink: sharelinkId,
          	textS3: JSON.stringify(quill.getContents())
          })
            .then(function(result) {
              console.log('data saved');

              change = new Delta();

            });
        } 
      }, 5000);

      this.setState({ saveInterval: saveInterval });
    });

    

  }

  makeDoc (quill) {
    // console.log('quill:', this.state.quill)
    var Delta = Quill.import('delta');
    var change = new Delta();

  	// sharelinkId = docId;
    var sharelinkId = 'doc' + Date.now(); 

    // need to stop interval and restart
    clearInterval(this.state.saveInterval);

    var saveInterval = setInterval(function() {
      if (change.length() > 0) {
        console.log('Saving changes', sharelinkId);

        // should comment out to limit AWS RDS db hits
        axios.put('/document', {
        	sharelink: sharelinkId,
        	textS3: JSON.stringify(quill.getContents())
        })
          .then(function(result) {
            console.log('data saved');

            // change = new Delta();

          });
      } 
    }, 5000);

    this.setState({ saveInterval: saveInterval }, () => {
      axios.post('/document', {
      	sharelink: sharelinkId
      })
        .then(function(res) {
          console.log('new doc:', sharelinkId);
          quill.setContents();

          var emaillink = window.location.hostname + ':' + window.location.port + '?sharelink=' + sharelinkId;
          console.log('link to pass', emaillink);
        });
      
    });

  }

  render () {
  	return (
  		<div>
		    <button id="newdoc" onClick={ () => { this.makeDoc(this.state.quill) } }>New Document</button>
	      <div id="editor">
	        <p>Type here...</p>
	      </div>
      </div>
	);
  }
} 

export default TextEditor;
