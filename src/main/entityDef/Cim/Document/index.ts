import IdentifiedObject from '../IdentifiedObject'

class Document extends IdentifiedObject {
  approver: any
  author: any
  author_name: any
  comment: any
  created_date_time: any
  doc_status: any
  editor: any
  electronic_address: any
  issuer: any
  last_modified_date_time: any
  revision_number: any
  status: any
  subject: any
  title: any
  type: any
  constructor() {
    super()
    this.type = null
    this.created_date_time = null
    this.last_modified_date_time = null
    this.revision_number = null
    this.electronic_address = null
    this.subject = null
    this.title = null
    this.doc_status = null
    this.status = null
    this.author_name = null
    this.comment = null
    this.author = null
    this.editor = null
    this.issuer = null
    this.approver = null
  }
}

export default Document
