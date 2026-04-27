migrate(
  (app) => {
    // 1. Create clubs collection
    const clubs = new Collection({
      name: 'clubs',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.role = 'Master' || @request.auth.role = 'Admin'",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'logo', type: 'file', maxSelect: 1, mimeTypes: ['image/jpeg', 'image/png'] },
        { name: 'active', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(clubs)

    // 2. Add club_id to users
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!users.fields.getByName('club_id')) {
      users.fields.add(
        new RelationField({
          name: 'club_id',
          collectionId: clubs.id,
          maxSelect: 1,
          cascadeDelete: false,
        }),
      )
      app.save(users)
    }

    // 3. Create events collection
    const events = new Collection({
      name: 'events',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.role = 'Master' || @request.auth.role = 'Admin'",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'date', type: 'date', required: true },
        { name: 'club_id', type: 'relation', collectionId: clubs.id, maxSelect: 1 },
        {
          name: 'status',
          type: 'select',
          values: ['draft', 'published', 'completed'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(events)

    // 4. Create players collection
    const players = new Collection({
      name: 'players',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'user_id', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
        { name: 'club_id', type: 'relation', collectionId: clubs.id, maxSelect: 1 },
        {
          name: 'category',
          type: 'select',
          values: ['Male', 'Female', 'Senior', 'Junior'],
          maxSelect: 1,
        },
        { name: 'handicap', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(players)
  },
  (app) => {
    const players = app.findCollectionByNameOrId('players')
    if (players) app.delete(players)

    const events = app.findCollectionByNameOrId('events')
    if (events) app.delete(events)

    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    if (users.fields.getByName('club_id')) {
      users.fields.removeByName('club_id')
      app.save(users)
    }

    const clubs = app.findCollectionByNameOrId('clubs')
    if (clubs) app.delete(clubs)
  },
)
