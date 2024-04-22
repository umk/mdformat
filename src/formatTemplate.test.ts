import { faker } from '@faker-js/faker'

import { createTemplate } from './Template'
import { getTemplateData } from './TemplateData'
import formatTemplate from './formatTemplate'

describe('template', () => {
  it('creates template without data', () => {
    const template = createTemplate(faker.lorem.text())
    const data = getTemplateData(template, {})
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
  it('creates template with single data field', () => {
    const template = createTemplate('Hello {{name}}!')
    const data = getTemplateData(template, {
      name: faker.person.firstName(),
    })
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
  it('creates template with single array data field', () => {
    const template = createTemplate('Hello {{name}}!')
    const data = getTemplateData(template, {
      name: [faker.person.firstName(), faker.person.firstName(), faker.person.firstName()],
    })
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
  it('creates template with two permutated array data fields', () => {
    const template = createTemplate('{{name}} goes to {{city}}!')
    const data = getTemplateData(template, {
      name: [faker.person.firstName(), faker.person.firstName(), faker.person.firstName()],
      city: [faker.location.city(), faker.location.city()],
    })
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
  it("doesn't permutate properties, that are not referenced in template", () => {
    const template = createTemplate('Hello {{name}}!')
    const data = getTemplateData(template, {
      name: [faker.person.firstName(), faker.person.firstName(), faker.person.firstName()],
      city: [faker.location.city(), faker.location.city()],
    })
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
  it('creates template with two zipped array data fields', () => {
    const template = createTemplate('{{itinerary:name}} goes to {{itinerary:city}}!')
    const data = getTemplateData(template, {
      name: [faker.person.firstName(), faker.person.firstName(), faker.person.firstName()],
      city: [faker.location.city(), faker.location.city(), faker.location.city()],
    })
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
  it('creates template with three combined array data fields', () => {
    const template = createTemplate(
      '{{name}} goes to {{destination:city}} on {{destination:date}}!',
    )
    const data = getTemplateData(template, {
      name: [faker.person.firstName(), faker.person.firstName()],
      city: [faker.location.city(), faker.location.city(), faker.location.city()],
      date: ['Feb, 5', 'Jan, 1'],
    })
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
  it('takes the least number of zipped items', () => {
    const template = createTemplate('{{greeting:name}} goes to {{greeting:city}}!')
    const data = getTemplateData(template, {
      name: [faker.person.firstName(), faker.person.firstName(), faker.person.firstName()],
      city: [faker.location.city(), faker.location.city()],
    })
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
  it('resolves path properties', () => {
    const template = createTemplate('Hello {{name.first}} {{name.last}}!')
    const data = getTemplateData(template, {
      name: {
        first: faker.person.firstName(),
        last: faker.person.lastName(),
      },
    })
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
  it('resolves array path properties preserving structure of data', () => {
    const template = createTemplate(
      '{{cities.residents.name.first}} {{cities.residents.name.last}} of age {{cities.residents.age}} lives in {{cities.name}}',
    )
    const data = getTemplateData(template, {
      cities: faker.datatype.array(2).map(() => ({
        name: faker.location.city(),
        residents: faker.datatype.array(2).map(() => ({
          name: {
            first: faker.person.firstName(),
            last: faker.person.lastName(),
          },
          age: faker.number.int({ min: 18, max: 65 }),
        })),
      })),
    })
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
  it('preserves the substitution field if root property not found in the data', () => {
    const template = createTemplate('Hello {{name}}!')
    const data = getTemplateData(template, {})
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
})
