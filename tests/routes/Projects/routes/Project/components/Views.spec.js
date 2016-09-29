import React from 'react'
import Views from 'routes/Projects/routes/Project/components/Views/Views'
import { shallow } from 'enzyme'

describe('(Project:Component) Views', () => {
  let _component
  const exampleProject = { name: 'test', owner: 'tester' }

  beforeEach(() => {
    _component = shallow(
      <Views
        project={exampleProject}
      />
    )
  })

  it('Renders', () => {
    const item = _component.find('div')
    expect(item).to.exist
  })

})
