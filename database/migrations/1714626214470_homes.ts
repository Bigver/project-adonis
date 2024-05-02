import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'homes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('keyvisual_img_url')
      table.string('slideshow1_img_url')
      table.string('slideshow2_img_url')
      table.string('slideshow3_img_url')
      table.string('slideshow1_video_url')
      table.string('slideshow2_video_url')
      table.string('slideshow3_video_url')
      table.text('home_messages')
      table.enum('status', ['show', 'hide']).defaultTo('show')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
