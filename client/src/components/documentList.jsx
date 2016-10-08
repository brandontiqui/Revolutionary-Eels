import React from 'react';
import { render } from 'react-dom'; // needed?
import axios from 'axios';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

import { connect } from 'react-redux';
import * as doclist from '../actions/documentlistActions.jsx';

// import { bindActionCreators } from 'redux'; // ?
// import { show } from '../actions/documentlistActions.jsx'; // ?

class DocumentList extends React.Component {

  constructor(props) {
  	super(props);

  	// this.state = {
  	// 	// username: 'b', // change later after auth complete
  	// 	// documents: [],
  	// 	// inputValue: '',
  	// 	message: 'test'
  	// }
  }

  componentWillMount () {
    // this.props.dispatch( showMessage('waaaaa') );
    this.props.dispatch( doclist.showMessage('cool') );
  }

  componentDidMount () {
  	//populate documents array with list of documents for user
  	// console.log('this:', this);
   //  console.log('username on mount', this.state.username);

   //  axios.get('document/all?username=' + this.state.username)
   //    .then(function(res) {
   //    	console.log('this in axios: ', this);
   //      console.log('response on mount: ', res.data);
   //      this.setState({ documents: res.data });
   //    }.bind(this))
   //    .catch(function(err) {
   //      console.log('Error retrieving user documents:', err);
   //    });
  }

  // createNewDoc (username) {
  // 	if (this.state.inputValue === '') {
  // 		this.setState({message: 'Please enter a title.'});
  // 		return;
  // 	}
	 //  var sharelinkId = 'doc' + Date.now();
	 //  // create doc
	 //  // pass in username
	 //  axios.post('/document', {
	 //  	username: username,
	 //  	sharelink: sharelinkId,
	 //  	title: this.state.inputValue
	 //  })
	 //  .then(function(res) {

		//   browserHistory.push('/?sharelink=' + sharelinkId);
	 //  })
	 //  .catch(function(err) {
  //     console.log('Error creating the document:', err);
	 //  });
  // }

  // deleteDoc (sharelinkId, index, title) {
  // 	if (confirm('The document "' + title + '" will be deleted.')) {

	 //  	axios.delete('/document?sharelink=' + sharelinkId)
	 //  	  .then(function(res) {
	 //        console.log('doc deleted');
	 //        console.log(this.state.documents);
	 //        var docs = this.state.documents;
	 //        docs.splice(index, 1);
	 //        this.setState({ documents: docs });
	 //  	  }.bind(this));
	 //  	} 
  // }

  // updateInputValue (event) {
  // 	var val = event.target.value;

  // 	this.setState({
  //     inputValue: val
  // 	}, () => {
  // 		if (val.length > 0) {
  //       this.setState({ message: '' });
  //     }
  // 	});
  // }


  /***

<div>
		    <button onClick={ () => { this.createNewDoc(this.state.username) } }>New Doc</button>
		    <br />
		    Title: <input value={ this.state.inputValue } onChange={ this.updateInputValue.bind(this) }type='text' placeholder='Enter the title for the document'/>
		    <br />
		    <span style={ messageStyle }>{ this.state.message }</span>
		    <h1>Document List</h1>
		    <ul>
		    	{ this.state.documents.length > 0 ? this.state.documents.map( (doc, index) => {
		    		  return ( 
		    		  	<li key={ index }>
		    		  	  <a href={ 'http://localhost:8000/?sharelink=' + doc.sharelink }>{ doc.title }</a>
                  &nbsp;<a onClick={ () => { this.deleteDoc(doc.sharelink, index, doc.title) } }>Delete</a>
		    		  	</li> 
		    		  );
		    	  }) : 'loading...'
		      }
		    </ul>
		  </div>



  ***/

	render() {
		var messageStyle = {
      color: 'red'
		};

		return (
			<div>
		    <span style={ messageStyle }>{ this.props.message }</span>
		    <br />
		    <span style={ messageStyle }>{ this.props.username }</span>
      </div>
		  		);
	}
}

// DocumentList.propTypes = {
// 	// message: React.PropTypes.string.isRequired
// 	show: React.PropTypes.func.isRequired
// }

// function mapStateToProps(state) {
// 	return {
// 		showMessage: state.documentlist
// 	}
// }

// function mapDispatchToProps(dispatch) {
// 	return 
// 		bindActionCreators({show: showMessage}, dispatch);
	
// }

// export default DocumentList;
// export default connect(null, { show })(DocumentList);
export default connect((store) => {
	return {
		message: store.documentlist.message,
		username: store.documentlist.username
	}
})(DocumentList);
