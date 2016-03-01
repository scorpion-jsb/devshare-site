import ga from 'react-ga'
import config from '../../config.json'

ga.initialize(config.gaTrackingId, { debug: true })

export default ga
