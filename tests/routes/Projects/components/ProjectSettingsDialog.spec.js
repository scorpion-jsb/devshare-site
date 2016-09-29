import React from 'react'
import ProjectSettingsDialog from 'routes/Projects/components/ProjectSettingsDialog/ProjectSettingsDialog'
import { shallow } from 'enzyme'

describe('(Component) ProjectSettingsDialog', () => {
  let _component
  const exampleProject = { name: 'test', owner: 'tester' }
  beforeEach(() => {
    _component = shallow(
      <ProjectSettingsDialog
        open={false}
        onRequestClose={() => console.log('request close')}
        project={exampleProject}
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

  it('Renders Delete Button', () => {
    const RaisedButton = _component.find('RaisedButton')
    expect(RaisedButton).to.exist
  })
})
