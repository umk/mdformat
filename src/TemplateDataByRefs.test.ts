import { createTemplate, getTemplateRefs } from './Template'
import { getTemplateData } from './TemplateData'
import { groupDataByRefs } from './TemplateDataByRefs'
import { formatTemplate } from './formatTemplate'

describe('groupDataByRefs', () => {
  it('groups data by zero refs', () => {
    const template = createTemplate(
      'Lorem ipsum {{gr:dolor}} sit {{gr:amet}}, consectetur {{adipiscing}} elit',
    )
    const data = getTemplateData(template, [
      {
        dolor: ['perspiciatis', 'unde'],
        amet: ['omnis', 'iste', 'natus'],
        adipiscing: ['ex', 'ea'],
      },
      {
        dolor: ['sequi'],
        amet: ['porro', 'quisquam'],
        adipiscing: ['non', 'proident'],
      },
    ])
    const groups = groupDataByRefs(data, [])
    expect(groups).toHaveLength(1)
    expect(Object.entries(groups[0].key.groups)).toHaveLength(0)
    expect(groups[0].data).toHaveLength(6)
  })

  it('groups data by refs', () => {
    const template = createTemplate(
      'Lorem ipsum {{gr:dolor}} sit {{gr:amet}}, consectetur {{adipiscing}} elit',
    )
    const refs = getTemplateRefs(template)
    const data = getTemplateData(template, [
      {
        dolor: ['perspiciatis', 'unde'],
        amet: ['omnis', 'iste', 'natus'],
        adipiscing: ['ex', 'ea'],
      },
      {
        dolor: ['sequi'],
        amet: ['porro', 'quisquam'],
        adipiscing: ['non', 'proident'],
      },
    ])
    const groups = groupDataByRefs(
      data,
      refs.filter((r) => ['dolor', 'amet'].includes(r.path)),
    )
    const templateGr = createTemplate('{{gr:dolor}} {{gr:amet}}')
    const content = groups.map((g) => formatTemplate(templateGr, g.key)).join('\n')
    expect(content).toMatchSnapshot()
  })

  it('groups data by refs cross several groups', () => {
    const template = createTemplate(
      'Lorem ipsum {{gr:dolor}} sit {{gr:amet}}, consectetur {{adipiscing}} elit',
    )
    const refs = getTemplateRefs(template)
    const data = getTemplateData(template, [
      {
        dolor: ['perspiciatis', 'unde'],
        amet: ['omnis', 'iste', 'natus'],
        adipiscing: ['ex', 'ea'],
      },
      {
        dolor: ['sequi'],
        amet: ['porro', 'quisquam'],
        adipiscing: ['non', 'proident'],
      },
    ])
    const groups = groupDataByRefs(
      data,
      refs.filter((r) => ['dolor', 'adipiscing'].includes(r.path)),
    )
    const templateA = createTemplate('{{gr:dolor}} {{adipiscing}}')
    const templateB = createTemplate('\t{{gr:amet}}')
    const content = groups
      .map((g) => {
        const a = formatTemplate(templateA, g.key)
        const b = g.data.map((d) => formatTemplate(templateB, d))
        return [a, ...b].join('\n')
      })
      .join('\n')
    expect(content).toMatchSnapshot()
  })

  it("groups data by refs if ref data doesn't exist", () => {
    const template = createTemplate(
      'Lorem ipsum {{gr:dolor}} sit {{gr:amet}}, consectetur {{adipiscing}} elit',
    )
    const refs = getTemplateRefs(template)
    const data = getTemplateData(template, [
      {
        dolor: ['perspiciatis', 'unde'],
        // amet missing
        adipiscing: ['ex', 'ea'],
      },
      {
        dolor: ['sequi'],
        // amet missing
        adipiscing: ['non', 'proident'],
      },
    ])
    const groups = groupDataByRefs(
      data,
      refs.filter((r) => ['dolor', 'amet'].includes(r.path)),
    )
    const templateGr = createTemplate('{{gr:dolor}} {{gr:amet}}')
    const content = groups.map((g) => formatTemplate(templateGr, g.key)).join('\n')
    expect(content).toMatchSnapshot()
  })

  it('groups data by ref with and without explicit group ID', () => {
    const template = createTemplate('{{gr:testA}} {{gr:testB}} {{testA}}')
    const refs = getTemplateRefs(template)
    const data = getTemplateData(template, [
      {
        testA: ['a', 'b', 'c'],
        testB: ['1', '2', '3'],
      },
    ])
    const groups = groupDataByRefs(data, refs)
    const content = groups.map((g) => formatTemplate(template, g.key)).join('\n')
    expect(content).toMatchSnapshot()
  })
})
