import React from 'react'
import NewProjectDialog from 'routes/Projects/components/NewProjectDialog/NewProjectDialog'
import { shallow } from 'enzyme'

describe.skip('(Projects:Component) NewProjectDialog', () => {
  let _component
  beforeEach(() => {
    _component = shallow(
      <NewProjectDialog
        open
        onRequestClose={() => console.log('request close')}
        onCreateClick={() => console.log('create click')}
      />
    )
  })

  it('Renders Dialog', () => {
    const dialog = _component.find('Dialog')
    expect(dialog).to.exist
  })
})
