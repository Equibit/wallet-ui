user: {
  watchlist: [], // app.service('watch-items').find()
  flaglist: [] // app.service('flags')
}

toggleWatchList () {
  this.watchPromise = User.addtoWatchList({enabled: this.iswatched, issuance: this.issuance.id}).then(() => {
    this.isWatched = !this.isWatched;
  });
}

watchListPromise: undefined

issuance: {
  isWatched: {value: true, set () {}},
  isFlagged: true
}


<button class="toolbar-action" {{#if watchListPromise.isPending}}disabled{{/if}} ($click)="toggleWatchlist()">
  {{#if isWatched}}
    <i class="icon icon-add-eyeball" />
  {{else}}
    <i class="icon icon-remove-eyeball" />
  {{/if}}
</button>



<action-toggle {active}="isWatched" (ontoggle)="toggleWatchList()">
  <div ($click)="onClick()">
    {{#if isWatched}}
      <i class="icon icon-add-eyeball {{#if isPending}}pending{{/if}}" />
    {{else}}
      <i class="icon icon-remove-eyeball {{#if isPending}}pending{{/if}}" />
    {{/if}}
  </div>
</action-toggle>

vm: {
  onClick () {
    if (!this.isPending) {
      this.isPending = true
      this.cached = this.value

      this.dispatch('ontoggle')

      setTimeout(() => {
        this.isPending = false
      }, 5000)
    }
  },
  value: {
    set (val) {
      this.isPending = false
      return val
    }
  }
  isPending: 'boolean'
}