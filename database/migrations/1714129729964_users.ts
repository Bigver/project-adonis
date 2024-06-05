import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('username')
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.enum('role', ['admin', 'user']).defaultTo('admin')
      table.string('remember_me_token').nullable()
      table.text('access').defaultTo('[{\"userAdmin\":\"yes\",\"checkAdmin\":\"yes\",\"pageAdmin\":\"yes\"}]')
      table.enum('login_method', ['facebook', 'twitter', 'google', 'normal']).defaultTo('normal')
      table.boolean('password_updated').defaultTo(false)
      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
