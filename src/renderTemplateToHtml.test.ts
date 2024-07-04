import renderTemplateToHtml from './renderTemplateToHtml'

describe('renderTemplateToHtml', () => {
  it('renders template without data references', () => {
    const content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    const data = {}
    const result = renderTemplateToHtml(content, data)
    expect(result).toEqual('<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>\n')
  })

  it('renders template with array data references', () => {
    const content = 'Lorem ipsum dolor {{sit}} amet'
    const data = {
      sit: ['consectetur', 'adipiscing', 'elit'],
    }
    const result = renderTemplateToHtml(content, data)
    expect(result).toEqual(`<p>Lorem ipsum dolor consectetur amet</p>
<p>Lorem ipsum dolor adipiscing amet</p>
<p>Lorem ipsum dolor elit amet</p>
`)
  })

  it('renders template with array data references in a list', () => {
    const content = '- Lorem ipsum dolor {{sit}} amet'
    const data = {
      sit: ['consectetur', 'adipiscing', 'elit'],
    }
    const result = renderTemplateToHtml(content, data)
    expect(result).toEqual(`<ul>
<li>Lorem ipsum dolor consectetur amet</li>
<li>Lorem ipsum dolor adipiscing amet</li>
<li>Lorem ipsum dolor elit amet</li>
</ul>
`)
  })

  it('renders template with array data references in a table', () => {
    const content = `
| A           | B                  |
| ----------- | ------------------ |
| Lorem ipsum | dolor {{sit}} amet |
`
    const data = {
      sit: ['consectetur', 'adipiscing', 'elit'],
    }
    const result = renderTemplateToHtml(content, data)
    expect(result).toEqual(`<table>
<thead>
<tr>
<th>A</th>
<th>B</th>
</tr>
</thead>
<tbody><tr>
<td>Lorem ipsum</td>
<td>dolor consectetur amet</td>
</tr>
<tr>
<td>Lorem ipsum</td>
<td>dolor adipiscing amet</td>
</tr>
<tr>
<td>Lorem ipsum</td>
<td>dolor elit amet</td>
</tr>
</tbody></table>
`)
  })

  it('renders template with data reference in query parameter', () => {
    const content = 'Lorem [ipsum](https://dolor.com/?sit={{sit}}) amet'
    const data = {
      sit: 'do&eiusmod=tempor',
    }
    const result = renderTemplateToHtml(content, data)
    expect(result).toEqual(
      '<p>Lorem <a href="https://dolor.com/?sit=do%26eiusmod%3Dtempor">ipsum</a> amet</p>\n',
    )
  })
  it('renders template with data reference in URL', () => {
    const content = 'Lorem [ipsum](https://dolor.com/{{sit}}/?sit=amet) amet'
    const data = {
      sit: 'do&eiusmod=tempor',
    }
    const result = renderTemplateToHtml(content, data)
    expect(result).toEqual(
      '<p>Lorem <a href="https://dolor.com/do%26eiusmod%3Dtempor/?sit=amet">ipsum</a> amet</p>\n',
    )
  })
  it('renders nested lists', () => {
    const content = '- Lorem {{ipsum.consectetur}}\n  - Dolor sit {{ipsum.amet}}'
    const data = {
      ipsum: [
        {
          consectetur: 'proin consequat',
          amet: ['Lorem ipsum dolor sit amet', 'consectetur adipiscing elit'],
        },
        {
          consectetur: 'magna aliqua',
          amet: ['Sed do eiusmod tempor', 'incididunt ut labore', 'et dolore magna aliqua'],
        },
        {
          consectetur: 'neque sit amet',
          amet: ['Ut enim ad minim veniam', 'quis nostrud exercitation ullamco laboris'],
        },
      ],
    }
    const result = renderTemplateToHtml(content, data)
    expect(result).toMatchSnapshot()
  })
})
