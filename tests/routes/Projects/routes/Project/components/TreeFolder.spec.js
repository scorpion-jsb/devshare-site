import React from 'react'
import TreeFolder from 'routes/Projects/routes/Project/components/TreeFolder/TreeFolder'
import { shallow } from 'enzyme'

describe('(Project:Component) TreeFolder', () => {
  let _component
  const exampleProject = { name: 'test', owner: 'tester' }
  const data = { file: { name: 'asdf' } }

  beforeEach(() => {
    _component = shallow(
      <TreeFolder
        data={data}
        project={exampleProject}
        open={false}
        onRequestClose={() => console.log('request close')}
      />
    )
  })

  it('Renders List Item', () => {
    const item = _component.find('li')
    expect(item).to.exist
  })

})
