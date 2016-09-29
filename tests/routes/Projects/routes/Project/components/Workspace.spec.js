import React from 'react'
import WorkspacePopover from 'routes/Projects/routes/Project/components/WorkspacePopover/WorkspacePopover'
import { shallow } from 'enzyme'

describe('(Project:Component) WorkspacePopover', () => {
  let _component
  const exampleProject = { name: 'test', owner: 'tester' }

  beforeEach(() => {
    _component = shallow(
      <WorkspacePopover
        type={'file'}
        onSubmit={() => console.log('request close')}
      />
    )
  })

  it('Renders Popover', () => {
    const item = _component.find('Popover')
    expect(item).to.exist
  })

})
