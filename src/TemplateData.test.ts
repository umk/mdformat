import { createTemplate } from './Template'
import { getTemplateData } from './TemplateData'

describe('template data', () => {
  it('gets template data for array field', () => {
    const template = createTemplate('Hello {{name}}!')
    const data = getTemplateData(template, {
      name: ['Alice', 'Bob', 'Charlie'],
    })
    expect(data).toMatchSnapshot()
  })
})
