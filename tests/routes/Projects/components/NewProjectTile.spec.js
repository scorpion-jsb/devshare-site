import React from 'react'
import NewProjectTile from 'routes/Projects/components/NewProjectTile/NewProjectTile'
import { shallow } from 'enzyme'

describe('(Projects:Component) NewProjectTile', () => {
  let _component
  beforeEach(() => {
    _component = shallow(
      <NewProjectTile />
    )
  })

  it('Renders', () => {
    const paper = _component.find('Paper')
    expect(paper).to.exist
  })

})
