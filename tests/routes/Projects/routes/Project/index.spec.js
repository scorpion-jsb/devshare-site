import ProjectRoute from 'routes/Projects/routes/Project'
import { shallow } from 'enzyme'

describe('(Projects:Route) Project', () => {
  let _route

  beforeEach(() => {
    _route = ProjectRoute()
  })

  it('Sets Path to :projectname', () => {
    expect(_route.path).to.equal(':projectname')
  })

  it('Defines a getComponent function', () => {
    expect(_route.getComponent).to.be.a.function
  })

  it('Defines a getChildRoutes function', () => {
    expect(_route.getChildRoutes).to.be.a.function
  })

})
