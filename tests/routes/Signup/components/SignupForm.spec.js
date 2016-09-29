import React from 'react'
import { SignupForm } from 'routes/Signup/components/SignupForm/SignupForm'
import { shallow } from 'enzyme'

describe('(Signup:Component) SignupForm', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<SignupForm />)
  })

  it('Renders form', () => {
    const form = _component.find('form')
    expect(form).to.exist
  })

})
