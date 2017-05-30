import React from 'react'
import DeleteDialog from 'routes/Projects/components/DeleteDialog/DeleteDialog'
import { shallow } from 'enzyme'

describe.skip('(Projects:Component) DeleteDialog', () => {
  let _component
  beforeEach(() => {
    _component = shallow(
      <DeleteDialog
        open={false}
        name={'testDelete'}
        onRequestClose={() => console.log('request close')}
      />
    )
  })

  it('Renders Dialog', () => {
    const dialog = _component.find('Dialog')
    expect(dialog).to.exist
  })
})
