import TemplateDataByRefs from './TemplateDataByRefs'
import { Ref } from './TemplatePart'
import Token from './Token'
import createIgnoreComplexToken from './createIgnoreComplexToken'
import createRenderItems from './createRenderItems'
import createRenderRows from './createRenderRows'
import createRenderString from './createRenderString'
import createRenderTokens from './createRenderTokens'
import formatHrefTemplate from './formatHrefTemplate'

type TemplateRender = Token | TemplateGroupRender

export const createTemplateRender = (() => {
  const evaluations = [
    createIgnoreComplexToken(createRenderString('text')),
    createRenderString('title'),
    createRenderString('href', formatHrefTemplate),
    createRenderTokens(),
    createRenderItems(),
    createRenderRows(),
  ]
  return (token: Token) =>
    evaluations.reduce<TemplateRender>((prev, cur) => cur(token, prev), token)
})()

export type TemplateGroupRender = {
  render: (data: TemplateDataByRefs) => Array<Token>
  groupRefs: Array<Ref>
  groupDataRefs: Array<Ref>
}

export function isRender(render: TemplateRender): render is TemplateGroupRender {
  return 'render' in render
}

export function getRenderRefs(render: TemplateRender) {
  if (isRender(render)) {
    return {
      groupRefs: render.groupRefs,
      groupDataRefs: render.groupDataRefs,
    }
  }
  return { groupRefs: [], groupDataRefs: [] }
}

export default TemplateRender
