import React from 'react';
import { render } from 'react-dom'; // needed?
import axios from 'axios';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as doclist from '../actions/documentlistActions.jsx';
// set curUser: user id using username

class DocumentList extends React.Component {

  constructor(props) {
  	super(props);
  }

  componentDidMount () {
    var username = window.localStorage.user.slice(1, window.localStorage.user.length - 1);
    axios.get('users/?username=' + username)
      .then(function(res) {
        this.props.dispatch( doclist.setUserId(JSON.stringify(res.data.id) ));
      }.bind(this))
      .catch(function(err) {
        console.log('Error retrieving user.')
      });

  	//populate documents array with list of documents for user
    axios.get('document/all?username=' + window.localStorage.user.slice(1, window.localStorage.user.length - 1))
      .then(function(res) {
        this.props.dispatch( doclist.populateDocs(res.data));
      }.bind(this))
      .catch(function(err) {
        console.log('Error retrieving user documents:', err);
      });
  }

  createNewDoc (username) {
  	// if (this.props.inputValue === '') {
  	// 	this.props.dispatch(doclist.showMessage('Please enter a title.'));
  	// 	return;
  	// }
  	// this.props.dispatch(doclist.clearMessage());
	  var sharelinkId = 'doc' + Date.now();

	  axios.post('/document', {
	  	username: username,
	  	sharelink: sharelinkId,
	  	// title: this.props.inputValue
	  	title: 'untitled'
	  })
	  .then(function(res) {
		  browserHistory.push('/?sharelink=' + sharelinkId);
	  })
	  .catch(function(err) {
      console.log('Error creating the document:', err);
	  });
  }

  deleteDoc (sharelinkId, index, title) {
  	if (confirm('The document "' + title + '" will be deleted.')) {

	  	axios.delete('/document?sharelink=' + sharelinkId)
	  	  .then(function(res) {
	        console.log('doc deleted');
	        var docs = this.props.documents.slice();
	        docs.splice(index, 1);

	        this.props.dispatch( doclist.populateDocs(docs) );
	  	  }.bind(this));
	  	} 
  }

  updateInputValue (event) {
  	var val = event.target.value;


  	this.props.dispatch(doclist.setInputvalue(val));
  	// console.log('inputval upd:', this.props.inputValue);
  	// this.setState({
   //    inputValue: val
  	// }, () => {
  	// 	if (val.length > 0) {
   //      this.setState({ message: '' });
   //    }
  	// });
  }

  calcTime (time) {
  	var unixTime = new Date(time).getTime();
    var now = Date.now();
  	var result = '';
  	var diff = (now - unixTime) / 1000;

  	if ( diff < 60 ) {
  		result += Math.round( diff );
  		result === '1' ? result += ' second' : result += ' seconds';
  	} else if ( diff < 3600 ) {
  		result += Math.round( diff / 60 );
  		result === '1' ? result += ' minute' : result += ' minutes';
  	} else if ( diff < 86400 ) {
  		result += Math.round( diff / 3600 );
  		result === '1' ? result += ' hour' : result += ' hours';
  	} else {
  		result += Math.round( diff / 86400 );
  		result === '1' ? result += ' day' : result += ' days';
  	}
    return 'Last edited ' + result + ' ago.';
  }
  
  openDoc (doc) {
   browserHistory.push('/?sharelink=' + doc);
  }
	// Title: <input value={ this.props.inputValue } onChange={ this.updateInputValue.bind(this) }type='text' placeholder='Enter the title for the document'/>

	render() {
		var messageStyle = {
      color: 'red'
		};

		var lastUpdateStyle = {
			fontSize: 12,
      color: 'grey'
		};

    var docIconStyle = {
      height: 40,
      width: 25,
      float: 'left',
      marginRight: 10
    };

	  return (
		  <div className="container">
		    <button className="btn btn btn-primary btn-large btn-block" onClick={ () => { this.createNewDoc(window.localStorage.user.slice(1, window.localStorage.user.length - 1)) } }>Create new doc</button>
		    <br />
		    <span style={ messageStyle }>{ this.props.message }</span>
        <br />

			    <ul>
			    	{ this.props.documents.length > 0 ? this.props.documents.map( (doc, index) => {
			    		  return ( 
			    		  	<li className="doclist-li" key={ index }>
			    		  	  <div>
			    		  	    <img style={ docIconStyle }src="http://images.clipshrine.com/getimg/PngMedium-Paper-3-icon-19797.png" />
			    		  	  </div>
			    		  	  <div>
				    		  	  <a onClick={ () => { this.openDoc( doc.sharelink ) } }>{ doc.title }</a>
		                  &nbsp;<a className="del-doc-link" onClick={ () => { this.deleteDoc(doc.sharelink, index, doc.title) } }>Delete</a>
		                  <br />
		                  <span style={ lastUpdateStyle }>{ this.calcTime( doc.updatedAt ) }</span>
	                  </div>
	                  <hr />
			    		  	</li> 
			    		  );
			    	  }) : ''
			      }
			    </ul>

		    <br />
      </div>
		  		);
	}
}

DocumentList.propTypes = {
  message: React.PropTypes.string.isRequired,
  username: React.PropTypes.string.isRequired,
  documents: React.PropTypes.array.isRequired,
  inputValue: React.PropTypes.string.isRequired
}

export default connect((store) => {
	return {
		message: store.documentlist.message,
		username: store.documentlist.username,
		documents: store.documentlist.documents,
		inputValue: store.documentlist.inputValue,
    curUser: store.documentlist.curUser
	}
})(DocumentList);
