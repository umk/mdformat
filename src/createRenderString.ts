import type { Tokens } from 'marked'

import { createTemplate, getTemplateRefs, type Template } from './Template'
import type { TemplateDataByRefs } from './TemplateDataByRefs'
import type { TemplateRender } from './TemplateRender'
import { getRenderRefs } from './TemplateRender'
import type { TemplateRenderPartial } from './TemplateRenderPartial'
import type { Token } from './Token'
import { formatTemplate } from './formatTemplate'
import { renderTemplate } from './renderTemplate'

export type TemplateFormatter = (template: Template) => Template

export function createRenderString(
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
