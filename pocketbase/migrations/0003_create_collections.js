migrate(
  (app) => {
    const athleteCategories = new Collection({
      name: 'athlete_categories',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(athleteCategories)

    const clubs = new Collection({
      name: 'clubs',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text' },
        {
          name: 'logo',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png'],
        },
        { name: 'description', type: 'text' },
        { name: 'owner_id', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
        { name: 'status', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(clubs)

    const athletes = new Collection({
      name: 'athletes',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule:
        "@request.auth.id != '' && user_id = @request.auth.id || @request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        { name: 'user_id', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
        { name: 'club_id', type: 'relation', collectionId: clubs.id, maxSelect: 1 },
        { name: 'category_id', type: 'relation', collectionId: athleteCategories.id, maxSelect: 1 },
        { name: 'ranking_points', type: 'number' },
        { name: 'name', type: 'text' },
        { name: 'cpf', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'handicap', type: 'number' },
        { name: 'category', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
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
      users.fields.add(new RelationField({ name: 'club_id', collectionId: clubs.id, maxSelect: 1 }))
    if (!users.fields.getByName('category_id'))
      users.fields.add(
        new RelationField({
          name: 'category_id',
          collectionId: athleteCategories.id,
          maxSelect: 1,
        }),
      )
    if (!users.fields.getByName('categoria')) users.fields.add(new TextField({ name: 'categoria' }))
    if (!users.fields.getByName('status')) users.fields.add(new TextField({ name: 'status' }))
    app.save(users)

    const systemData = new Collection({
      name: 'system_data',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        { name: 'razao_social', type: 'text' },
        { name: 'slogan', type: 'text' },
        { name: 'cnpj', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
        { name: 'dark_mode', type: 'bool' },
        { name: 'language', type: 'text' },
        { name: 'bg_opacity', type: 'number' },
        { name: 'bg_image_url', type: 'url' },
        { name: 'menu_logo_size', type: 'number' },
        { name: 'show_cnpj', type: 'bool' },
        { name: 'show_contact_bar', type: 'bool' },
        { name: 'session_lifetime', type: 'number' },
        { name: 'ai_context', type: 'text' },
        { name: 'integrations', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(systemData)

    const blogPosts = new Collection({
      name: 'blog_posts',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'content', type: 'editor' },
        { name: 'excerpt', type: 'text' },
        {
          name: 'image',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png'],
        },
        { name: 'author_id', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
        { name: 'published', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(blogPosts)

    const courses = new Collection({
      name: 'courses',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'location', type: 'text' },
        { name: 'holes', type: 'number' },
        { name: 'par', type: 'number' },
        {
          name: 'image',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png'],
        },
        { name: 'description', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(courses)

    const gallery = new Collection({
      name: 'gallery',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'image',
          type: 'file',
          required: true,
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png'],
        },
        { name: 'description', type: 'text' },
        { name: 'category', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(gallery)

    const productGroups = new Collection({
      name: 'product_groups',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(productGroups)

    const products = new Collection({
      name: 'products',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'price', type: 'number', required: true },
        { name: 'stock', type: 'number', required: true },
        { name: 'group_id', type: 'relation', collectionId: productGroups.id, maxSelect: 1 },
        {
          name: 'image',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png'],
        },
        { name: 'active', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(products)

    const orders = new Collection({
      name: 'orders',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'master')",
      viewRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'master')",
      createRule: "@request.auth.id != ''",
      updateRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'master')",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        { name: 'user_id', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
        { name: 'status', type: 'text' },
        { name: 'total_amount', type: 'number' },
        { name: 'payment_intent_id', type: 'text' },
        { name: 'shipping_address', type: 'json' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(orders)

    const orderItems = new Collection({
      name: 'order_items',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        {
          name: 'order_id',
          type: 'relation',
          collectionId: orders.id,
          required: true,
          maxSelect: 1,
        },
        {
          name: 'product_id',
          type: 'relation',
          collectionId: products.id,
          required: true,
          maxSelect: 1,
        },
        { name: 'quantity', type: 'number', required: true },
        { name: 'price', type: 'number', required: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(orderItems)

    const pages = new Collection({
      name: 'pages',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'content', type: 'json' },
        { name: 'published', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(pages)

    const services = new Collection({
      name: 'services',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'duration_minutes', type: 'number' },
        { name: 'price', type: 'number' },
        { name: 'active', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(services)

    const appointments = new Collection({
      name: 'appointments',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'master')",
      viewRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'master')",
      createRule: "@request.auth.id != ''",
      updateRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'master')",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        { name: 'user_id', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
        { name: 'service_id', type: 'relation', collectionId: services.id, maxSelect: 1 },
        { name: 'appointment_date', type: 'date', required: true },
        { name: 'status', type: 'text' },
        { name: 'notes', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(appointments)

    const quotes = new Collection({
      name: 'quotes',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'master')",
      viewRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'master')",
      createRule: "@request.auth.id != ''",
      updateRule:
        "@request.auth.id != '' && (user_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'master')",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        { name: 'user_id', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
        { name: 'service_id', type: 'relation', collectionId: services.id, maxSelect: 1 },
        { name: 'status', type: 'text' },
        { name: 'details', type: 'text' },
        { name: 'estimated_price', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(quotes)

    const rules = new Collection({
      name: 'rules',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'editor' },
        { name: 'order_index', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(rules)

    const tournaments = new Collection({
      name: 'tournaments',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'course_id', type: 'relation', collectionId: courses.id, maxSelect: 1 },
        { name: 'start_date', type: 'date' },
        { name: 'end_date', type: 'date' },
        { name: 'status', type: 'text' },
        { name: 'registration_fee', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(tournaments)

    const billingRegistrationConfig = new Collection({
      name: 'billing_registration_config',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      updateRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        { name: 'charge_on_athlete_registration', type: 'bool' },
        { name: 'athlete_registration_amount', type: 'number' },
        { name: 'payment_method', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(billingRegistrationConfig)

    const financialCharges = new Collection({
      name: 'financial_charges',
      type: 'base',
      listRule:
        "@request.auth.id != '' && (athlete_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'master')",
      viewRule:
        "@request.auth.id != '' && (athlete_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'master')",
      createRule: "@request.auth.id != ''",
      updateRule:
        "@request.auth.id != '' && (athlete_id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'master')",
      deleteRule: "@request.auth.role = 'master' || @request.auth.role = 'admin'",
      fields: [
        { name: 'client_name', type: 'text' },
        { name: 'amount', type: 'number' },
        { name: 'due_date', type: 'date' },
        { name: 'status', type: 'text' },
        { name: 'category', type: 'text' },
        { name: 'type', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'athlete_id', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(financialCharges)
  },
  (app) => {
    const collections = [
      'financial_charges',
      'billing_registration_config',
      'tournaments',
      'rules',
      'quotes',
      'appointments',
      'services',
      'pages',
      'order_items',
      'orders',
      'products',
      'product_groups',
      'gallery',
      'courses',
      'blog_posts',
      'system_data',
      'athletes',
      'clubs',
      'athlete_categories',
    ]
    for (const name of collections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        app.delete(col)
      } catch (_) {}
    }
  },
)
