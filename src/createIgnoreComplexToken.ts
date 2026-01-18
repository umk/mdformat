import type { Template } from './Template'
import type { TemplateRender } from './TemplateRender'
import type { TemplateRenderPartial } from './TemplateRenderPartial'
import type { Token } from './Token'

export type TemplateFormatter = (template: Template) => Template

export function createIgnoreComplexToken(render: TemplateRenderPartial): TemplateRenderPartial {
  return function (token: Token, next: TemplateRender): TemplateRender {
    return 'tokens' in token ? next : render(token, next)
  }
}
