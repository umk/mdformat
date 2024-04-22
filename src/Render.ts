import { Lexer } from 'marked'

import Content from './Content'
import { getTemplateData } from './TemplateData'
import { groupDataByRefs } from './TemplateDataByRefs'
import { Ref } from './TemplatePart'
import { getRenderRefs } from './TemplateRender'
import Token from './Token'
import createTemplate from './createTemplate'
import renderTemplate from './renderTemplate'

type Render = ((data: Content) => Array<Token>) & {
  refs: Array<Ref>
}

export function createRender(content: string | Token | Array<Token>, lexer?: Lexer): Render {
  const tokens =
    typeof content === 'string'
      ? (lexer ?? new Lexer()).lex(content)
      : Array.isArray(content)
        ? content
        : [content]
  const renderRefs = tokens.flatMap((t) => {
    const template = createTemplate(t as Token)
    const refs = getRenderRefs(template)
    return { template, refs }
  })
  const render = function (data: Content) {
    return renderRefs.flatMap(({ template, refs }) => {
      const templateData = getTemplateData([...refs.groupRefs, ...refs.groupDataRefs], data)
      const groups = groupDataByRefs(templateData, refs.groupRefs)
      return groups.flatMap((g) => renderTemplate(template, g))
    })
  }
  return Object.assign(render, {
    refs: renderRefs.flatMap((r) => [...r.refs.groupRefs, ...r.refs.groupDataRefs]),
  })
}

export default Render
