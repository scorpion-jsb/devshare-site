import React from 'react'
import ProjectTile from 'routes/Projects/components/ProjectTile/ProjectTile'
import { shallow } from 'enzyme'

describe('(Projects:Component) ProjectTile', () => {
  let _component
  const exampleProject = { name: 'test', owner: 'tester' }
  beforeEach(() => {
    _component = shallow(
      <ProjectTile
        project={exampleProject}
        onSelect={(proj) => console.log('select clicked', proj)}
      />
    )
  })

  it('Renders div', () => {
    const logo = _component.find('div')
    expect(logo).to.exist
  })
})
