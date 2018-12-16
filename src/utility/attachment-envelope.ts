
export interface Attachment {
  fallback:string
  color?: string
  pretext?: string
  text?: string
  author_name?: string
  author_link?: string
  author_icon?: string
  title?: string
  title_link?: string
  image_url?:string
  thumb_url?:string
  fields?: Field[]
  actions?: Action[]
}
export interface Field {
  title:string
  value:string
  short?:boolean
}
export interface Action {
  name:string
}

interface EnvelopeProps {
  attachments: Attachment[]
}

export class AttachmentEnvelope {
  public props: EnvelopeProps
  constructor() {
    this.props = {
      attachments: []
    }
  }
  public add(attachment: Attachment): void {
    this.props.attachments.push(attachment)
  }
}
