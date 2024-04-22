import { faker } from '@faker-js/faker'

import { createTemplate } from './Template'
import { getTemplateData } from './TemplateData'

describe('template data', () => {
  it('gets template data for array field', () => {
    const template = createTemplate('Hello {{name}}!')
    const data = getTemplateData(template, {
      name: [faker.person.firstName(), faker.person.firstName(), faker.person.firstName()],
    })
    expect(data).toMatchSnapshot()
  })
})
