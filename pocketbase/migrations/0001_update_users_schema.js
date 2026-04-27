migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('users')
    if (!col.fields.getByName('role')) {
      col.fields.add(new TextField({ name: 'role' }))
    }

    col.listRule = "id = @request.auth.id || @request.auth.role = 'Master'"
    col.viewRule = "id = @request.auth.id || @request.auth.role = 'Master'"
    col.updateRule = "id = @request.auth.id || @request.auth.role = 'Master'"
    col.deleteRule = "(id = @request.auth.id || @request.auth.role = 'Master') && role != 'Master'"

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('users')
    if (col.fields.getByName('role')) {
      col.fields.removeByName('role')
    }

    col.listRule = 'id = @request.auth.id'
    col.viewRule = 'id = @request.auth.id'
    col.updateRule = 'id = @request.auth.id'
    col.deleteRule = 'id = @request.auth.id'

    app.save(col)
  },
)
