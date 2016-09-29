import React from 'react'
import { LoginForm } from 'routes/Login/components/LoginForm/LoginForm'
import { shallow } from 'enzyme'

describe('(Login:Component) LoginForm', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<LoginForm />)
  })

  it('Renders form', () => {
    const form = _component.find('form')
    expect(form).to.exist
  })

})
