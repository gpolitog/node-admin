# State Management

State management allows objects to have one or more states. As a state changes, the correct chain of events will be fired of and appropriate properties will be modified. By defining and separating the concepts involved in state management and enforcing certain rules, this gives the code more structure and maintainability.

![vuex](vuex.png)

## Store

The store is basically a container that holds the application state. It is reactive so a change of state will also trigger the change of elements using this state. And the only way to change state is to commit mutations. This ensures every state change leaves a track-able record, and enables tooling that helps us better understand the applications.

By providing the store option to the root instance, the store will be injected into all child components of the root and will be available on them as `this.$store`:

    computed: {
      count () {
        return this.$store.state.count
      }
    }

## State

Vuex uses a single state tree including all application level state objects and serves as the "single source of truth". For debugging the application a snapshot of the state tree may help. To modularize the application the single state tree is split into sub modules.

The `mapState` helper which generates computed getter functions for us, saving us some keystrokes:

    // in full builds helpers are exposed as Vuex.mapState
    import { mapState } from 'vuex'

    export default {
      // ...
      computed: mapState({
        // arrow functions can make the code very succinct!
        count: state => state.count,
        // passing the string value 'count' is same as `state => state.count`
        countAlias: 'count',
      })
    }

We can also pass a string array to mapState when the name of a mapped computed property is the same as a state sub tree name.

    computed: mapState([
      // map this.count to store.state.count
      'count'
    ])

Use the spread operator to mix the outer object with the state object:

    computed: {
      localComputed () { .... },
      ...mapState({
        // ...
      })
    }

## Getters

Getters are methods defined in the store to retrieve derived states:

    const store = new Vuex.Store({
      state: {
        todos: [
          { id: 1, text: '...', done: true },
          { id: 2, text: '...', done: false }
        ]
      },
      getters: {
        doneTodos: state => {
          return state.todos.filter(todo => todo.done)
        }
      }
    })

You can then call them using:

    computed: {
      doneTodosCount () {
        return this.$store.getters.doneTodosCount
      }
    }

The `mapGetters` helper simply maps store getters to local computed properties:

    import { mapGetters } from 'vuex'

    export default {
      // ...
      computed: {
        // mix the getters into computed with object spread operator
        ...mapGetters([
          'doneTodosCount'
        ])
      }
    }

## Mutations

The only way to actually change state in a Vuex store is by committing a mutation. Vuex mutations are very similar to events: each mutation has a string type and a handler. The handler function is where we perform actual state modifications, and it will receive the state as the first argument:

    const store = new Vuex.Store({
      state: {
        count: 1
      },
      mutations: {
        increment (state) {
          state.count++
        }
      }
    })

The mutation is calles using a commit:

    store.commit('increment')

Keep in mind that all mutations have to be synchronous.

Also a helper is there to map mutations directly to component methods:

    import { mapMutations } from 'vuex'

    export default {
      // ...
      methods: {
        ...mapMutations([
          'increment', // map `this.increment()` to `this.$store.commit('increment')`

          // `mapMutations` also supports payloads:
          'incrementBy' // map `this.incrementBy(amount)` to `this.$store.commit('incrementBy', amount)`
        ]),
        ...mapMutations({
          add: 'increment' // map `this.add()` to `this.$store.commit('increment')`
        })
      }
    }

## Actions

Actions are similar to mutations, in reality actions will trigger mutations.
The real differences is that they may be asynchronous.

    const store = new Vuex.Store({
      state: {
        count: 0
      },
      mutations: {
        increment (state) {
          state.count++
        }
      },
      actions: {
        increment (context) {
          context.commit('increment')
        }
      }
    })

As before you may use `mapActions` here.

## Modules

Due to using a single state tree, all state of our application is contained inside one big object. However, as our application grows in scale, the store can get really bloated.

To help with that, Vuex allows us to divide our store into modules. Each module can contain its own state, mutations, actions, getters, and even nested modules.
