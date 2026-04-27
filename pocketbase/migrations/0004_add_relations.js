migrate(
  (app) => {
    const athletes = app.findCollectionByNameOrId('athletes')
    athletes.fields.add(
      new RelationField({
        name: 'club_id',
        collectionId: app.findCollectionByNameOrId('clubs').id,
        maxSelect: 1,
      }),
    )
    athletes.fields.add(
      new RelationField({
        name: 'category_id',
        collectionId: app.findCollectionByNameOrId('athlete_categories').id,
        maxSelect: 1,
      }),
    )
    app.save(athletes)

    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!users.fields.getByName('theme')) users.fields.add(new TextField({ name: 'theme' }))
    if (!users.fields.getByName('cpf_cnpj')) users.fields.add(new TextField({ name: 'cpf_cnpj' }))
    if (!users.fields.getByName('birth_date'))
      users.fields.add(new DateField({ name: 'birth_date' }))
    if (!users.fields.getByName('phone')) users.fields.add(new TextField({ name: 'phone' }))
    if (!users.fields.getByName('is_athlete'))
      users.fields.add(new BoolField({ name: 'is_athlete' }))
    if (!users.fields.getByName('club_id'))
      users.fields.add(
        new RelationField({
          name: 'club_id',
          collectionId: app.findCollectionByNameOrId('clubs').id,
          maxSelect: 1,
        }),
      )
    if (!users.fields.getByName('category_id'))
      users.fields.add(
        new RelationField({
          name: 'category_id',
          collectionId: app.findCollectionByNameOrId('athlete_categories').id,
          maxSelect: 1,
        }),
      )
    if (!users.fields.getByName('categoria')) users.fields.add(new TextField({ name: 'categoria' }))
    if (!users.fields.getByName('status')) users.fields.add(new TextField({ name: 'status' }))
    app.save(users)

    const products = app.findCollectionByNameOrId('products')
    products.fields.add(
      new RelationField({
        name: 'group_id',
        collectionId: app.findCollectionByNameOrId('product_groups').id,
        maxSelect: 1,
      }),
    )
    app.save(products)

    const orderItems = app.findCollectionByNameOrId('order_items')
    orderItems.fields.add(
      new RelationField({
        name: 'order_id',
        collectionId: app.findCollectionByNameOrId('orders').id,
        required: true,
        maxSelect: 1,
      }),
    )
    orderItems.fields.add(
      new RelationField({
        name: 'product_id',
        collectionId: app.findCollectionByNameOrId('products').id,
        required: true,
        maxSelect: 1,
      }),
    )
    app.save(orderItems)

    const appointments = app.findCollectionByNameOrId('appointments')
    appointments.fields.add(
      new RelationField({
        name: 'service_id',
        collectionId: app.findCollectionByNameOrId('services').id,
        maxSelect: 1,
      }),
    )
    app.save(appointments)

    const quotes = app.findCollectionByNameOrId('quotes')
    quotes.fields.add(
      new RelationField({
        name: 'service_id',
        collectionId: app.findCollectionByNameOrId('services').id,
        maxSelect: 1,
      }),
    )
    app.save(quotes)

    const tournaments = app.findCollectionByNameOrId('tournaments')
    tournaments.fields.add(
      new RelationField({
        name: 'course_id',
        collectionId: app.findCollectionByNameOrId('courses').id,
        maxSelect: 1,
      }),
    )
    app.save(tournaments)
  },
  (app) => {
    const collections = [
      { name: 'athletes', fields: ['club_id', 'category_id'] },
      {
        name: '_pb_users_auth_',
        fields: [
          'theme',
          'cpf_cnpj',
          'birth_date',
          'phone',
          'is_athlete',
          'club_id',
          'category_id',
          'categoria',
          'status',
        ],
      },
      { name: 'products', fields: ['group_id'] },
      { name: 'order_items', fields: ['order_id', 'product_id'] },
      { name: 'appointments', fields: ['service_id'] },
      { name: 'quotes', fields: ['service_id'] },
      { name: 'tournaments', fields: ['course_id'] },
    ]

    for (const item of collections) {
      try {
        const col = app.findCollectionByNameOrId(item.name)
        for (const field of item.fields) {
          col.fields.removeByName(field)
        }
        app.save(col)
      } catch (_) {}
    }
  },
)
