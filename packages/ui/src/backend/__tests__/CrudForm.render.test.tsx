jest.mock('next/navigation', () => ({ useRouter: () => ({ push: () => {} }) }))
jest.mock('remark-gfm', () => ({ __esModule: true, default: {} }))
jest.mock('@uiw/react-md-editor', () => ({ __esModule: true, default: () => null }))

import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { CrudForm, type CrudField } from '../CrudForm'

describe('CrudForm SSR render', () => {
  it('renders base fields', () => {
    const fields: CrudField[] = [
      { id: 'title', label: 'Title', type: 'text' },
      { id: 'is_done', label: 'Done', type: 'checkbox' },
    ]
    const html = renderToString(
      React.createElement(CrudForm as any, {
        title: 'Form',
        fields,
        onSubmit: () => {},
      })
    )
    expect(html).toContain('Title')
    expect(html).toContain('Done')
  })
})
