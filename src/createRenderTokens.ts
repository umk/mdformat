import type { TemplateDataByRefs } from './TemplateDataByRefs'
import type { TemplateRender } from './TemplateRender'
import { createTemplateRender, getRenderRefs, isRender } from './TemplateRender'
import type { TemplateRenderPartial } from './TemplateRenderPartial'
import type { Token } from './Token'
import { renderTemplate } from './renderTemplate'

export function createRenderTokens(): TemplateRenderPartial {
  return function (token: Token, next: TemplateRender): TemplateRender {
    if ('tokens' in token && token.tokens) {
      const renderToks = (token.tokens as Array<Token>).map(createTemplateRender)
      if (renderToks.some(isRender)) {
        const render = (data: TemplateDataByRefs): Array<Token> => {
          const current = renderTemplate(next, data)
          const tokens = renderToks.flatMap((t) => renderTemplate(t, data))
          return current.map((t) => ({ ...t, tokens }))
        }
        const nextRefs = getRenderRefs(next)
        const tokenRefs = renderToks.map(getRenderRefs)
        const groupRefs = tokenRefs.flatMap((r) => r.groupRefs)
        const groupDataRefs = tokenRefs.flatMap((r) => r.groupDataRefs)
        return {
          render,
          groupRefs: [...groupRefs, ...nextRefs.groupRefs],
          groupDataRefs: [...groupDataRefs, ...nextRefs.groupDataRefs],
        }
      }
    }
    return next
  }
}
