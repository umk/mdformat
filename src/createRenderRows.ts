import TemplateDataByRefs, { groupDataByRefs } from './TemplateDataByRefs'
import TemplateRender, { getRenderRefs, isRender } from './TemplateRender'
import TemplateRenderPartial from './TemplateRenderPartial'
import Token from './Token'
import createTemplate from './createTemplate'
import renderTemplate from './renderTemplate'

function createRenderRows(): TemplateRenderPartial {
  return function (token: Token, next: TemplateRender): TemplateRender {
    if ('rows' in token) {
      const renderRows = token.rows.map((r) => r.map((c) => createTemplate(c as Token)))
      if (renderRows.some((r) => r.some(isRender))) {
        const rowsRefs = renderRows
          .map((r) => r.map(getRenderRefs))
          .map((r) => ({
            groupRefs: r.flatMap((r) => r.groupRefs),
            groupDataRefs: r.flatMap((r) => r.groupDataRefs),
          }))
        const render = (data: TemplateDataByRefs): Array<Token> => {
          const current = renderTemplate(next, data)
          const rows = renderRows.flatMap((t, i) => {
            const refs = rowsRefs[i]
            const groups = groupDataByRefs(data.data, refs.groupRefs)
            return groups.flatMap((g) =>
              t.reduce(
                (prev, cur) => {
                  const r = renderTemplate(cur, g)
                  return prev.flatMap((p) => r.map((r) => [...p, r]))
                },
                [[]] as Array<Array<Token>>,
              ),
            )
          })
          return current.map((t) => ({ ...t, rows }) as typeof token)
        }
        const nextRefs = getRenderRefs(next)
        const groupDataRefs = renderRows
          .flatMap((r) => r.filter(isRender))
          .flatMap((c) => [...c.groupRefs, ...c.groupDataRefs])
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

export default createRenderRows
