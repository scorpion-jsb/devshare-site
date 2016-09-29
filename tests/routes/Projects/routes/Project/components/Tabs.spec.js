import React from 'react'
import Tabs from 'routes/Projects/routes/Project/components/Tabs/Tabs'
import { shallow } from 'enzyme'

describe('(Project:Component) Tabs', () => {
  let _component

  beforeEach(() => {
    _component = shallow(
      <Tabs
        open={false}
        onSelect={(i) => console.log('request select', i)}
        onClose={() => console.log('request close')}
      />
    )
  })

  it('Renders List', () => {
    const dialog = _component.find('ul')
    expect(dialog).to.exist
  })

})
