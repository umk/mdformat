import { Lexer } from 'marked'

import type { Content } from './Content'
import { getTemplateData } from './TemplateData'
import { groupDataByRefs } from './TemplateDataByRefs'
import type { Ref } from './TemplatePart'
import { createTemplateRender, getRenderRefs } from './TemplateRender'
import type { Token } from './Token'
import { renderTemplate } from './renderTemplate'

export type Render = ((data: Content) => Array<Token>) & {
  refs: Array<Ref>
}

export function createRender(template: string | Token | Array<Token>, lexer?: Lexer): Render {
  const tokens =
    typeof template === 'string'
      ? (lexer ?? new Lexer()).lex(template)
      : Array.isArray(template)
        ? template
        : [template]
  const renderRefs = tokens.flatMap((t) => {
    const renderTok = createTemplateRender(t as Token)
    const refs = getRenderRefs(renderTok)
    return { template: renderTok, refs }
  })
  const render = function (data: Content): Array<Token> {
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
