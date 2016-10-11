import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import * as editor from '../actions/editorActions.jsx';
import * as doclist from '../actions/documentlistActions.jsx';


class TextEditor extends React.Component {
  constructor(props) {
    super(props);
  };

  componentDidMount () {
    var username = window.localStorage.user.slice(1, window.localStorage.user.length - 1);
    axios.get('users/?username=' + username)
      .then(function(res) {
        this.props.dispatch( doclist.setUserId(JSON.stringify(res.data.id) ));
      }.bind(this))
      .catch(function(err) {
        console.log('Error retrieving user.')
      });

    var Delta = Quill.import('delta');
    var urldocId = window.location.search.split('').splice(11).join('');
    var user = 'user_' + Date.now(); // temp unique user identifier; swap out later with username
    
    // may need setSelectionLoc in store
    var context = this;
    var setSelectionLoc = this.props.setSelectionLoc;
    
    var sharelinkId = urldocId.length === 0 ? 'hr46' : urldocId; // default to public doc if there is no doc id in url
    

    this.props.dispatch(editor.setLink(sharelinkId));


    var quill = new Quill('#editor', {
      theme: 'snow'
    });

    // this.props.dispatch
    this.props.dispatch(editor.initQuill(quill));

      var socket = io('/editor');

      var change = new Delta();
      quill.on('text-change', function(delta, olddelta, source) {
        if (source === 'user') {
          change = change.compose(delta); // for saving partial changes
          socket.emit('change', {'sharelinkId': sharelinkId, 'who': user, 'delta': JSON.stringify(delta)});
        }
      });

      // GET SELECTION LOCATION
      quill.on('selection-change', function(range, oldRange, source) {
        if (range) {
          if (range.length == 0) {
            console.log('User cursor is on', range.index);
          } else {
            var text = quill.getText(range.index, range.length);
            console.log('User has highlighted', text);
            console.log('range index:', range.index);
          }
        } else {
          console.log('Cursor not in the editor');
        }

        var bounds = quill.getBounds(range.index);
        console.log('bounds:', bounds);
        if (range.length !== 0) {
          setSelectionLoc(bounds.top);          
        }

        if (range.length === 0) {
          setSelectionLoc(null);
        }
      });


      socket.on('change', function(msg){
        if(msg.who !== user && sharelinkId === msg.sharelinkId) { // prevent infinite loop; user who emitted msg should not receive it
          var del = JSON.parse(msg.delta);
          quill.updateContents( del );
        }
      });
      
      axios.get('/document?sharelink=' + sharelinkId)
        .then(function(res) {
        quill.setContents( JSON.parse(res.data.textS3) );
        })
        .catch(function(err) {
          console.log('Error:' + err);
        });

      /*
        Include save Interval for auto save
      */
      // var saveInterval = setInterval(function() {
      //   if (change.length() > 0) {
      //     console.log('Saving changes', sharelinkId);

      //     // should commet out to limit AWS RDS db hits
      //     axios.put('/document', {
      //       sharelink: sharelinkId,
      //       textS3: JSON.stringify(quill.getContents())
      //     })
      //       .then(function(result) {
      //         console.log('data saved');

      //         change = new Delta();

      //       });
      //   } 
      // }, 5000);

      // this.setState({ saveInterval: saveInterval });
  }

  saveDoc(quill, sharelinkId) {
    axios.put('/document', {
      sharelink: sharelinkId,
      textS3: JSON.stringify(quill.getContents()),
      title: quill.getText().slice( 0, quill.getText().indexOf('\n') )
    })
   .then(function(result) {
     console.log('data saved:', result);
    });
  }

  render () {
    return (
      <div>
        <span>{ this.props.quill }</span>
        <button onClick={ () => { this.saveDoc(this.props.quill, this.props.sharelinkId) } }>Save</button>
        <div id="editor">
        </div>
      </div>
  );
  }
} 

// export default TextEditor;

export default connect((store) => {
  return {
    quill: store.editor.quill,
    saveInterval: null,
    sharelinkId: store.editor.sharelinkId,
    user: null,
    curUser: store.documentlist.curUser
  }
})(TextEditor);
