import Template from './Template'
import TemplateRender from './TemplateRender'
import TemplateRenderPartial from './TemplateRenderPartial'
import Token from './Token'

export type TemplateFormatter = (template: Template) => Template

function createIgnoreComplexToken(render: TemplateRenderPartial): TemplateRenderPartial {
  return function (token: Token, next: TemplateRender): TemplateRender {
    return 'tokens' in token ? next : render(token, next)
  }
}

export default createIgnoreComplexToken
