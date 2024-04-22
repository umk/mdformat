import { Tokens } from 'marked'

import Template, { createTemplate, getTemplateRefs } from './Template'
import TemplateDataByRefs from './TemplateDataByRefs'
import TemplateRender, { getRenderRefs } from './TemplateRender'
import TemplateRenderPartial from './TemplateRenderPartial'
import Token from './Token'
import formatTemplate from './formatTemplate'
import renderTemplate from './renderTemplate'

export type TemplateFormatter = (template: Template) => Template

function createRenderString(
  property: string,
  ...formatters: Array<TemplateFormatter>
): TemplateRenderPartial {
  return function (token: Token, next: TemplateRender): TemplateRender {
    if (property in token) {
      const value = (token as Tokens.Generic)[property] as string | null | undefined
      if (value) {
        const template = formatters.reduce((prev, cur) => cur(prev), createTemplate(value))
        const groupRefs = getTemplateRefs(template)
        if (groupRefs.length > 0) {
          const render = (data: TemplateDataByRefs): Array<Token> => {
            const current = renderTemplate(next, data)
            const text = formatTemplate(template, data.key)
            return current.map((t) => ({ ...t, [property]: text }))
          }
          const nextRefs = getRenderRefs(next)
          return {
            render,
            groupRefs: [...groupRefs, ...nextRefs.groupRefs],
            groupDataRefs: nextRefs.groupDataRefs,
          }
        }
      }
    }
    return next
  }
}

export default createRenderString
