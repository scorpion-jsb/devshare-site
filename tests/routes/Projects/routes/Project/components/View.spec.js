import React from 'react'
import View from 'routes/Projects/routes/Project/components/View/View'
import { shallow } from 'enzyme'

describe('(Project:Component) View', () => {
  let _component
  const exampleProject = { name: 'test', owner: 'tester' }

  beforeEach(() => {
    _component = shallow(
      <View
        project={exampleProject}
        visible={true}
        index={0}
        onRequestClose={() => console.log('request close')}
      />
    )
  })

  it('Renders', () => {
    const item = _component.find('div')
    expect(item).to.exist
  })

})
