import type { TemplateRender } from './TemplateRender'
import type { Token } from './Token'

export type TemplateRenderPartial = (token: Token, next: TemplateRender) => TemplateRender
