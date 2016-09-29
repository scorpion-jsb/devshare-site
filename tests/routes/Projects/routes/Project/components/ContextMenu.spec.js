import React from 'react'
import ContextMenu from 'routes/Projects/routes/Project/components/ContextMenu/ContextMenu'
import { shallow } from 'enzyme'

describe('(Project:Component) ContextMenu', () => {
  let _component
  beforeEach(() => {
    _component = shallow(
      <ContextMenu />
    )
  })

  it('Renders', () => {
    const paper = _component.find('ul')
    expect(paper).to.exist
  })

})
