import React, { Component } from 'react' // eslint-disable-line
import map from 'lodash/map'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { randomProjectId } from '../../helpers'
import { Actions } from 'redux-devshare'
import './Home.scss'
// React Components
import RaisedButton from 'material-ui/lib/raised-button'
import Theme from '../../theme'
import GroupIcon from 'material-ui/lib/svg-icons/social/group'
import CloudDownload from 'material-ui/lib/svg-icons/file/cloud-download'
import StartIcon from 'material-ui/lib/svg-icons/content/create'
import Paper from 'material-ui/lib/paper'
import { event } from '../../helpers/ga'

const iconStyle = {
  width: '130px',
  height: '130px'
}
const buttonStyle = {
  margin: '3rem',
  height: '3rem',
  marginBottom: 5
}
const buttonLabelStyle = { fontSize: '1.5rem' }

class Home extends Component {
  trackEvent = () => {
    event({ category: 'Projects', action: 'Create Anonymous' })
  }

  render () {
    const meInThree = [
      {
        title: 'Work with others in real-time',
        icon: <GroupIcon style={iconStyle} />,
        desc: 'Share a link or add someone with an account directly to your project.'
      },
      {
        title: 'Start from anywhere',
        icon: <StartIcon style={iconStyle} />,
        desc: 'Upload an existing project or start from scratch.'
      },
      {
        title: 'Download your project',
        icon: <CloudDownload style={iconStyle} />,
        desc: 'Export all the files and folder into a zip file to continue development or deploy.'
      }
    ]

    const meInThreeElements = map(meInThree, (content, key) => {
      return (
        <div className='Home-MeInThree-Item' key={ key } >
          { content.icon }
          <div className='Home-MeInThree-Title'>
            { content.title }
          </div>
          <div className='Home-MeInThree-Desc'>
            { content.desc }
          </div>
        </div>
      )
    })

    return (
      <div className='Home' style={{ color: Theme.palette.primary2Color }}>
        <div>
          <div className='Home-Hero'>
            <div className='Home-Logo'>
              <img src='assets/devShareLogo.gif' />
              <span className='Home-Brand'>devShare</span>
            </div>
            <span className='Home-Name'>Build together</span>
            <span className='Home-Description'>
            real-time, full-project code editing in browser
            </span>
            <RaisedButton
              primary={ true }
              label='Share Code'
              style={ buttonStyle }
              labelStyle={ buttonLabelStyle }
              containerElement={ <Link to={ `/anon/${randomProjectId()}` } /> }
              onClick={ this.trackEvent }
            />
            <span className='Home-Muted'>No sign up required</span>
            <div className='Home-VideoContainer'>
              <Paper style={{marginBottom: -10}} zDepth={1}>
                <img className='Home-PreviewVideo' src='assets/devShareEdit.gif' />
              </Paper>
            </div>
          </div>
          <div className='Home-MeInThree'>
          { meInThreeElements }
          </div>
          <div className='Home-Footer'>
            Made by <a target='_blank' href='http://kyper.io'>Kyper</a>
          </div>
        </div>
        </div>
      )
  }
}

// Place state of redux store into props of component
function mapStateToProps (state) {
  return {
    account: state.account,
    router: state.router
  }
}

// Place action methods into props
function mapDispatchToProps (dispatch) {
  return bindActionCreators(Actions.projects, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
