import React from 'react'
import SettingsDialog from 'routes/Projects/routes/Project/components/SettingsDialog/SettingsDialog'
import { shallow } from 'enzyme'

describe('(Project:Component) SettingsDialog', () => {
  let _component
  const exampleProject = { name: 'test', owner: 'tester' }

  beforeEach(() => {
    _component = shallow(
      <SettingsDialog
        project={exampleProject}
        open={false}
        onRequestClose={() => console.log('request close')}
      />
    )
  })

  it('Renders Dialog', () => {
    const dialog = _component.find('Dialog')
    expect(dialog).to.exist
  })

  it('Renders TextFields', () => {
    const textfields = _component.find('TextField')
    expect(textfields.length).to.equal(3)
  })
})
