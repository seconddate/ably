import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'phone_authentication'

  public async up () {
    this.schema.raw('SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";')
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned()
      table.string('phone_number', 45).notNullable()
      table.string('email', 50).notNullable()
      table.string('verification_code', 45).notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
      */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('expired_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
