import React from 'react'
import Tab from 'routes/Projects/routes/Project/components/Tab/Tab'
import { shallow } from 'enzyme'

describe('(Project:Component) Tab', () => {
  let _component
  const exampleProject = { name: 'test', owner: 'tester' }

  beforeEach(() => {
    _component = shallow(
      <Tab
        title={'testtitle'}
        index={0}
        project={exampleProject}
        open={false}
        onRequestClose={() => console.log('request close')}
      />
    )
  })

  it('Renders List Item', () => {
    const dialog = _component.find('li')
    expect(dialog).to.exist
  })

})
