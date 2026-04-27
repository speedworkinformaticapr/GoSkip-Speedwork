migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    if (!users.fields.getByName('role')) {
      users.fields.add(
        new SelectField({
          name: 'role',
          values: ['master', 'user'],
          maxSelect: 1,
          required: false,
        }),
      )
    }

    users.listRule = "id = @request.auth.id || @request.auth.role = 'master'"
    users.viewRule = "id = @request.auth.id || @request.auth.role = 'master'"
    users.updateRule = "id = @request.auth.id || @request.auth.role = 'master'"
    users.deleteRule =
      "(id = @request.auth.id && role != 'master') || (@request.auth.role = 'master' && role != 'master')"

    app.save(users)
  },
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    users.fields.removeByName('role')

    users.listRule = 'id = @request.auth.id'
    users.viewRule = 'id = @request.auth.id'
    users.updateRule = 'id = @request.auth.id'
    users.deleteRule = 'id = @request.auth.id'

    app.save(users)
  },
)
