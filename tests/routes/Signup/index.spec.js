import SignupRoute from 'routes/Signup'

describe('(Route) Signup', () => {
  let _route
  let _component
  let _childRoutes

  beforeEach(() => {
    _route = SignupRoute()
  })

  it('Should return a route configuration object', () => {
    expect(SignupRoute).to.be.a.function
  })

  it('Sets Path to :username', () => {
    expect(_route.path).to.equal('signup')
  })
  it('Defines a getComponent function', () => {
    expect(_route.getComponent).to.be.a.function
  })
  it('Defines a getChildRoutes function', () => {
    expect(_route.getChildRoutes).to.be.a.function
  })

})
