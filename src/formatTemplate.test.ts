import { createTemplate } from './Template'
import { getTemplateData } from './TemplateData'
import { formatTemplate } from './formatTemplate'

describe('template', () => {
  it('creates template without data', () => {
    const template = createTemplate('Lorem ipsum dolor sit amet')
    const data = getTemplateData(template, {})
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
  it('creates template with single data field', () => {
    const template = createTemplate('Hello {{name}}!')
    const data = getTemplateData(template, {
      name: 'John',
    })
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
  it('creates template with single array data field', () => {
    const template = createTemplate('Hello {{name}}!')
    const data = getTemplateData(template, {
      name: ['Alice', 'Bob', 'Charlie'],
    })
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
  it('creates template with two permutated array data fields', () => {
    const template = createTemplate('{{name}} goes to {{city}}!')
    const data = getTemplateData(template, {
      name: ['Alice', 'Bob', 'Charlie'],
      city: ['Paris', 'London'],
    })
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
  it("doesn't permutate properties, that are not referenced in template", () => {
    const template = createTemplate('Hello {{name}}!')
    const data = getTemplateData(template, {
      name: ['Alice', 'Bob', 'Charlie'],
      city: ['Paris', 'London'],
    })
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
  it('creates template with two zipped array data fields', () => {
    const template = createTemplate('{{itinerary:name}} goes to {{itinerary:city}}!')
    const data = getTemplateData(template, {
      name: ['Alice', 'Bob', 'Charlie'],
      city: ['Paris', 'London', 'Tokyo'],
    })
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
  it('creates template with three combined array data fields', () => {
    const template = createTemplate(
      '{{name}} goes to {{destination:city}} on {{destination:date}}!',
    )
    const data = getTemplateData(template, {
      name: ['Alice', 'Bob'],
      city: ['Paris', 'London', 'Tokyo'],
      date: ['Feb, 5', 'Jan, 1'],
    })
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
  it('takes the least number of zipped items', () => {
    const template = createTemplate('{{greeting:name}} goes to {{greeting:city}}!')
    const data = getTemplateData(template, {
      name: ['Alice', 'Bob', 'Charlie'],
      city: ['Paris', 'London'],
    })
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
  it('resolves path properties', () => {
    const template = createTemplate('Hello {{name.first}} {{name.last}}!')
    const data = getTemplateData(template, {
      name: {
        first: 'John',
        last: 'Doe',
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
      cities: [
        {
          name: 'Paris',
          residents: [
            { name: { first: 'Alice', last: 'Smith' }, age: 25 },
            { name: { first: 'Bob', last: 'Jones' }, age: 30 },
          ],
        },
        {
          name: 'London',
          residents: [
            { name: { first: 'Charlie', last: 'Brown' }, age: 35 },
            { name: { first: 'Diana', last: 'Wilson' }, age: 28 },
          ],
        },
      ],
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
  it('renders object as JSON', () => {
    const template = createTemplate('User: {{user}}')
    const data = getTemplateData(template, {
      user: { name: 'Alice', age: 25 },
    })
    const content = data.map((d) => formatTemplate(template, d)).join('\n')
    expect(content).toMatchSnapshot()
  })
})
