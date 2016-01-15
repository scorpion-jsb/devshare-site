import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Actions } from 'redux-grout';
import Grout from 'kyper-grout';
import CircularProgress from 'material-ui/lib/circular-progress';

const grout = new Grout();
import './OAuth.scss';

class OAuth extends Component {
  constructor(props){
    super(props);
  }
  state = { isLoading: false, error: null };
  static propTypes = {

  };
  componentDidMount() {
    console.log('oAuth mounted', grout);
    let code = grout.utils.dom.getQueryParam('code')
    let provider = grout.utils.dom.getQueryParam('provider') || 'google';
    console.log('calling providerSignup:', {provider, code});
    this.state.isLoading = true;
    grout.providerSignup({provider, code}).then(account => {
      console.log('provider signup successful:', account);
      this.setState({
        isLoading: false
      });
      // this.props.history.pushState(null, `/${this.props.account.username}`)
    }, error => {
      console.error('error with provider signup', error);
      this.setState({
        isLoading: false,
        error
      });
    });
  }
  render(){
    if(!this.state.isLoading){
      return (
        <div className="Login">
          { this.state.error || 'state no longer loading'}
        </div>
      );
    }
    return (
      <div className="OAuth">
        <div className="OAuth-Progress">
          <CircularProgress  mode="indeterminate" />
        </div>
      </div>
    );
  }
}
//Place state of redux store into props of component
function mapStateToProps(state) {
  return {
    account: state.account,
    router: state.router
  };
}
//Place action methods into props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(OAuth);
