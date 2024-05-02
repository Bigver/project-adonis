import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary
      table.string('product_name').notNullable
      table.integer('price_product').notNullable
      table.string('img_product').notNullable
      table.string('img2_product').notNullable
      table.string('img3_product').notNullable
      table.text('detail_product').notNullable
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
