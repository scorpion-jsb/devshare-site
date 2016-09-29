import AccountRoute from 'routes/Account'

describe('(Route) Account', () => {
  let _route
  let _component
  let _childRoutes

  beforeEach(() => {
    _route = AccountRoute()
  })

  it('Should return a route configuration object', () => {
    expect(AccountRoute).to.be.a.function
  })

  it('Sets Path to :username', () => {
    expect(_route.path).to.equal('account')
  })
  it('Defines a getComponent function', () => {
    expect(_route.getComponent).to.be.a.function
  })
  it('Defines a getChildRoutes function', () => {
    expect(_route.getChildRoutes).to.be.a.function
  })

})
