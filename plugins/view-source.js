
import React from 'react'

export default sourceBase => pageData => ({
  blocks: {
    footer: styles => <p className={styles.utils.noMargin}>
      check out the <a target="_blank" href={sourceBase + pageData.source}>
        markdown source
      </a> for this page
    </p>
  },
})

