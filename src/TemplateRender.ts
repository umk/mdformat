import TemplateDataByRefs from './TemplateDataByRefs'
import { Ref } from './TemplatePart'
import Token from './Token'

type TemplateRender = Token | TemplateGroupRender

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
