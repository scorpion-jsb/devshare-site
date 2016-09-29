import React from 'react'
import TreeFile from 'routes/Projects/routes/Project/components/TreeFile/TreeFile'
import { shallow } from 'enzyme'

describe('(Project:Component) TreeFile', () => {
  let _component
  const exampleProject = { name: 'test', owner: 'tester' }
  const data = { name: 'asdf', path: 'index.html' }

  beforeEach(() => {
    _component = shallow(
      <TreeFile
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
