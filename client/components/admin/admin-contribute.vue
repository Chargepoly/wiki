<template lang='pug'>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data() {
    return {
      backers: []
    }
  },
  apollo: {
    backers: {
      query: gql`
        {
          contribute {
            contributors {
              id
              source
              name
              joined
              website
              twitter
              avatar
            }
          }
        }
      `,
      fetchPolicy: 'network-only',
      update: (data) => data.contribute.contributors,
      watchLoading (isLoading) {
        this.$store.commit(`loading${isLoading ? 'Start' : 'Stop'}`, 'admin-contribute-refresh')
      }
    }
  }
}
</script>