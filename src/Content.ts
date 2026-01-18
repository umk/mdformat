export type Content = ContentObject | ContentArray | ContentPrimitive

export type ContentObject = { [K in string]: Content }

export type ContentArray = Array<Content>

export type ContentPrimitive = string | number | boolean | undefined
