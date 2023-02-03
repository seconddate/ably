import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user'

  public async up () {
    this.schema.raw('SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";')
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('uid', 45).notNullable()
      table.string('password', 255).notNullable()
      table.string('name', 45).notNullable()
      table.string('email', 50).notNullable()
      table.string('nickname', 45).notNullable()
      table.string('tel', 45).notNullable()
      table.integer('is_tel_certified', 1).notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('last_logined_at', { useTz: true })
      table.timestamp('tel_verified_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
