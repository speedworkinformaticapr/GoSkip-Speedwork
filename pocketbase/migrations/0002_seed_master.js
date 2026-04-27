migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'ias2371@gmail.com')
      return // already seeded
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('ias2371@gmail.com')
    record.setPassword('Sp23Wk71@1994')
    record.setVerified(true)
    record.set('name', 'Iverson')
    record.set('role', 'master')

    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'ias2371@gmail.com')
      app.delete(record)
    } catch (_) {}
  },
)
