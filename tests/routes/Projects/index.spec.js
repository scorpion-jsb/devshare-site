import ProjectsRoute from 'routes/Projects'
import { shallow } from 'enzyme'

describe('(Route) Projects', () => {
  let _route
  let _component
  let _childRoutes

  beforeEach(() => {
    _route = ProjectsRoute()
  })

  // it('Should return a route configuration object', () => {
  //   expect(typeof(ProjectsRoute)).to.equal('object')
  // })

  it('Sets Path to :username', () => {
    expect(_route.path).to.equal(':username')
  })
  it('Defines a getComponent function', () => {
    expect(_route.getComponent).to.be.a.function
  })
  it('Defines a getChildRoutes function', () => {
    expect(_route.getChildRoutes).to.be.a.function
  })

  // describe.skip('(Component)', () => {
  //   beforeEach(() => {
  //     _component = _route.getComponent()
  //   })
  //   it('exists', () => {
  //     expect(_component).to.exist
  //   })
  // })
  //
  // describe.skip('Child Routes', () => {
  //   beforeEach(() => {
  //     _childRoutes = _route.getChildRoutes()
  //   })
  //   it('exists', () => {
  //     expect(_childRoutes).to.exist
  //   })
  // })

})
