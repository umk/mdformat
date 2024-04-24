import TemplateDataByRefs, { groupDataByRefs } from './TemplateDataByRefs'
import TemplateRender, { getRenderRefs, isRender } from './TemplateRender'
import { createTemplateRender } from './TemplateRender'
import TemplateRenderPartial from './TemplateRenderPartial'
import Token from './Token'
import renderTemplate from './renderTemplate'

function createRenderItems(): TemplateRenderPartial {
  return function (token: Token, next: TemplateRender): TemplateRender {
    if ('items' in token) {
      const renderToks = token.items.map(createTemplateRender)
      if (renderToks.some(isRender)) {
        const itemsRefs = renderToks.map(getRenderRefs)
        const render = (data: TemplateDataByRefs): Array<Token> => {
          const current = renderTemplate(next, data)
          const items = renderToks.flatMap((t, i) => {
            const refs = itemsRefs[i]
            const groups = groupDataByRefs(data.data, refs.groupRefs)
            return groups.flatMap((g) => renderTemplate(t, g))
          })
          return current.map((t) => ({ ...t, items }) as typeof token)
        }
        const nextRefs = getRenderRefs(next)
        const groupDataRefs = itemsRefs.flatMap((r) => [...r.groupRefs, ...r.groupDataRefs])
        return {
          render,
          groupRefs: nextRefs.groupRefs,
          groupDataRefs: [...nextRefs.groupDataRefs, ...groupDataRefs],
        }
      }
    }
    return next
  }
}

export default createRenderItems
