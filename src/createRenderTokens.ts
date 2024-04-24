import TemplateDataByRefs from './TemplateDataByRefs'
import TemplateRender, { getRenderRefs, isRender } from './TemplateRender'
import { createTemplateRender } from './TemplateRender'
import TemplateRenderPartial from './TemplateRenderPartial'
import Token from './Token'
import renderTemplate from './renderTemplate'

function createRenderTokens(): TemplateRenderPartial {
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

export default createRenderTokens
